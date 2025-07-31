// Follow Deno Deploy's ES modules support
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Set up CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-environment, x-syskey, x-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
};

/**
 * Fetches a CSRF token for SAP API calls
 * @param sapUsername SAP username
 * @param sapPassword SAP password
 * @param serviceUrl SAP service URL
 * @returns CSRF token and cookies for subsequent requests
 */
async function fetchSapCsrfToken(sapUsername: string, sapPassword: string, serviceUrl: string) {
  console.log('Fetching CSRF token from:', serviceUrl);
  
  const csrfStart = performance.now();
  
  try {
    // Make a GET request to fetch the CSRF token
    const response = await fetch(serviceUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${sapUsername}:${sapPassword}`),
        'x-csrf-token': 'Fetch',
        'Accept': 'application/json'
      }
    });
    
    const csrfEnd = performance.now();
    console.log(`CSRF token fetch took ${(csrfEnd - csrfStart).toFixed(2)}ms`);
    console.log('CSRF token request status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching CSRF token:', errorText);
      return { error: 'Failed to authenticate with SAP: ' + response.status + ' ' + response.statusText };
    }
    
    // Extract the CSRF token and cookies
    const csrfToken = response.headers.get('x-csrf-token');
    const cookiesHeader = response.headers.get('set-cookie');
    
    console.log('CSRF token received:', csrfToken ? 'Yes' : 'No');
    console.log('Cookies received:', cookiesHeader ? 'Yes' : 'No');
    
    // Parse cookies from the set-cookie header
    const cookies: string[] = [];
    if (cookiesHeader) {
      const cookieParts = cookiesHeader.split(', ');
      for (const part of cookieParts) {
        if (part.includes('=')) {
          const mainPart = part.split(';')[0].trim();
          cookies.push(mainPart);
        }
      }
    }
    
    const cookieHeader = cookies.join('; ');
    
    return { csrfToken, cookieHeader };
  } catch (error) {
    const csrfEnd = performance.now();
    console.log(`CSRF token fetch failed after ${(csrfEnd - csrfStart).toFixed(2)}ms`);
    console.error('Network error fetching CSRF token:', error);
    return { error: 'Network error: ' + error.message };
  }
}

// Main function to handle requests
serve(async (req: Request) => {
  const functionStart = performance.now();
  console.log("Edge function get-sap-quotes called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Extract the Authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error("No Authorization header found");
      return new Response(JSON.stringify({ error: "No Authorization header" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    console.log("Authorization header found:", authHeader ? "Yes" : "No");
    
    // Create an authenticated Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify the request has a body
    let body;
    try {
      body = await req.json();
      console.log("Request body received:", JSON.stringify(body));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Extract parameters from the body
    const sapSoldToId = body?.sapSoldToId;
    const skip = body?.skip || 0;
    const top = body?.top || 50;
    const countOnly = body?.countOnly || false;
    const statusFilter = body?.statusFilter || null;
    const dateFilter = body?.dateFilter || null;
    
    if (!sapSoldToId) {
      console.error("No sapSoldToId provided in request body");
      return new Response(JSON.stringify({ error: "sapSoldToId is required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    console.log(`Processing request for SAP Sold-To ID: ${sapSoldToId}, skip: ${skip}, top: ${top}, countOnly: ${countOnly}, statusFilter: ${statusFilter}, dateFilter:`, dateFilter);

    try {
      // Fetch SAP credentials from the database - filter for S4 system type only
      console.log("Attempting to fetch SAP credentials from database...");
      
      const credentialsStart = performance.now();
      const { data: credentialsData, error: credentialsError } = await supabaseClient
        .from('sap_credentials')
        .select('sap_user, sap_password, server')
        .eq('sap_system_type', 'S4')
        .limit(1)
        .single();

      const credentialsEnd = performance.now();
      console.log(`SAP credentials fetch took ${(credentialsEnd - credentialsStart).toFixed(2)}ms`);

      if (credentialsError) {
        console.error("Error fetching SAP credentials:", credentialsError);
        return new Response(JSON.stringify({ 
          error: "Failed to retrieve SAP credentials", 
          details: credentialsError.message 
        }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      if (!credentialsData) {
        console.error("No S4 SAP credentials found in the database");
        return new Response(JSON.stringify({ error: "S4 SAP credentials not found" }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      console.log("SAP credentials retrieved successfully");
      
      // Extract credentials and connection details
      const sapUsername = credentialsData.sap_user;
      const sapPassword = credentialsData.sap_password;
      const server = credentialsData.server;
      
      // Use the Sales Quotation API path
      const apiPath = '/sap/opu/odata/sap/API_SALES_QUOTATION_SRV/A_SalesQuotation';

      if (!sapUsername || !sapPassword || !server) {
        console.error("SAP credentials incomplete:", { 
          hasUsername: !!sapUsername, 
          hasPassword: !!sapPassword,
          hasServer: !!server
        });
        return new Response(JSON.stringify({ error: "SAP credentials are incomplete" }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      // Construct the SAP API base URL from the server and API path
      const sapApiBaseUrl = `${server}${apiPath}`;
      console.log("Using SAP Quotes API Base URL:", sapApiBaseUrl);
      
      // Build the base filter string
      let filterString = `SoldToParty%20eq%20'${encodeURIComponent(sapSoldToId)}'`;
      
      // Add status filter if provided (using OverallSDProcessStatus for quotes as well)
      if (statusFilter) {
        filterString += `%20and%20OverallSDProcessStatus%20eq%20'${statusFilter}'`;
      }
      
      // Add date filter if provided - using proper OData operators
      if (dateFilter) {
        if (dateFilter.startDate) {
          const startDate = new Date(dateFilter.startDate);
          const formattedStartDate = startDate.toISOString().split('T')[0];
          // Use 'ge' (greater than or equal) operator for start date
          filterString += `%20and%20CreationDate%20ge%20datetime'${formattedStartDate}T00:00:00'`;
        }
        
        if (dateFilter.endDate) {
          const endDate = new Date(dateFilter.endDate);
          // Add 1 day to end date to include the entire end date
          endDate.setDate(endDate.getDate() + 1);
          const formattedEndDate = endDate.toISOString().split('T')[0];
          // Use 'lt' (less than) operator for end date
          filterString += `%20and%20CreationDate%20lt%20datetime'${formattedEndDate}T00:00:00'`;
        }
      }
      
      // Log the constructed filter string for debugging
      console.log("Using OData filter string:", filterString);
      
      // If we only need the count, make a special request for that
      if (countOnly) {
        // First, get a CSRF token since we might need it even for GET requests
        const { csrfToken, cookieHeader, error: csrfError } = await fetchSapCsrfToken(
          sapUsername, 
          sapPassword, 
          sapApiBaseUrl.split('(')[0] // Use service root URL
        );
        
        if (csrfError) {
          console.error("Error fetching CSRF token:", csrfError);
          return new Response(JSON.stringify({ 
            error: "Authentication error", 
            details: csrfError 
          }), {
            status: 401,
            headers: corsHeaders,
          });
        }
        
        const countUrl = `${sapApiBaseUrl}/$count?$filter=${filterString}`;
        
        console.log("Calling SAP API count URL with token");
        console.log("Count URL:", countUrl);
        
        // Set up headers with token and cookies
        const headers: Record<string, string> = {
          'Authorization': 'Basic ' + btoa(`${sapUsername}:${sapPassword}`),
          'Accept': 'application/json'
        };
        
        if (csrfToken) {
          headers['x-csrf-token'] = csrfToken;
        }
        
        if (cookieHeader) {
          headers['Cookie'] = cookieHeader;
        }
        
        const countCallStart = performance.now();
        const countResponse = await fetch(countUrl, { headers });
        const countCallEnd = performance.now();
        console.log(`SAP count API call took ${(countCallEnd - countCallStart).toFixed(2)}ms`);
        
        if (!countResponse.ok) {
          console.error("Error fetching count from SAP API:", countResponse.status, countResponse.statusText);
          return new Response(JSON.stringify({ 
            error: "Error fetching count from SAP API", 
            status: countResponse.status 
          }), {
            status: 502, // Bad Gateway
            headers: corsHeaders,
          });
        }
        
        const countText = await countResponse.text();
        const count = parseInt(countText, 10);
        
        console.log("Total count from SAP API:", count);
        
        const functionEnd = performance.now();
        console.log(`Total function execution time: ${(functionEnd - functionStart).toFixed(2)}ms`);
        
        return new Response(JSON.stringify({ count }), {
          headers: corsHeaders,
          status: 200,
        });
      }
      
      // First, get a CSRF token
      const { csrfToken, cookieHeader, error: csrfError } = await fetchSapCsrfToken(
        sapUsername, 
        sapPassword, 
        sapApiBaseUrl.split('(')[0] // Use service root URL
      );
      
      if (csrfError) {
        console.error("Error fetching CSRF token:", csrfError);
        return new Response(JSON.stringify({ 
          error: "Authentication error", 
          details: csrfError 
        }), {
          status: 401,
          headers: corsHeaders,
        });
      }
      
      // Construct the URL with filter and pagination parameters
      let url = `${sapApiBaseUrl}?$format=json&$filter=${filterString}`;
      
      // Add skip and top for pagination
      if (skip > 0) {
        url += `&$skip=${skip}`;
      }
      
      if (top > 0) {
        url += `&$top=${top}`;
      }
      
      // Add orderby to sort by SalesQuotation in descending order
      url += `&$orderby=SalesQuotation desc`;
      
      console.log("Calling SAP Quotes API URL with token and pagination");
      console.log("API URL:", url);

      // Set up headers with token and cookies
      const headers: Record<string, string> = {
        'Authorization': 'Basic ' + btoa(`${sapUsername}:${sapPassword}`),
        'Accept': 'application/json'
      };
      
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
      
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader;
      }
      
      // Make the request to the SAP API with timing
      const sapCallStart = performance.now();
      const sapResponse = await fetch(url, { headers });
      const sapCallEnd = performance.now();
      console.log(`SAP quotes API call took ${(sapCallEnd - sapCallStart).toFixed(2)}ms`);

      // Log the status code from SAP
      console.log("SAP API response status:", sapResponse.status);
      
      if (!sapResponse.ok) {
        const errorText = await sapResponse.text();
        console.error("SAP API returned an error:", errorText);
        return new Response(JSON.stringify({ 
          error: `Error from SAP API: ${sapResponse.status} ${sapResponse.statusText}`, 
          details: errorText 
        }), {
          status: 502, // Bad Gateway
          headers: corsHeaders,
        });
      }
      
      // Parse the response
      let sapData;
      try {
        const parseStart = performance.now();
        sapData = await sapResponse.json();
        const parseEnd = performance.now();
        console.log(`SAP response parsing took ${(parseEnd - parseStart).toFixed(2)}ms`);
      } catch (error) {
        console.error("Error parsing SAP API response:", error);
        const responseText = await sapResponse.text();
        console.log("SAP API response text:", responseText);
        throw new Error("Invalid response from SAP API");
      }

      // Also fetch the total count
      // First get the count URL
      const countUrl = `${sapApiBaseUrl}/$count?$filter=${filterString}`;
      
      console.log("Fetching total count from SAP API");
      
      // Make a separate request for the count
      const countCallStart = performance.now();
      const countResponse = await fetch(countUrl, { headers });
      const countCallEnd = performance.now();
      console.log(`SAP count API call took ${(countCallEnd - countCallStart).toFixed(2)}ms`);
      
      let totalCount = 0;
      
      if (countResponse.ok) {
        const countText = await countResponse.text();
        totalCount = parseInt(countText, 10);
        console.log("Total count from SAP API:", totalCount);
      } else {
        console.warn("Could not fetch total count from SAP API:", countResponse.status);
      }
      
      const functionEnd = performance.now();
      console.log(`Total function execution time: ${(functionEnd - functionStart).toFixed(2)}ms`);
      
      // Return the SAP API response with the total count
      return new Response(JSON.stringify({
        ...sapData,
        totalCount,
        pagination: {
          skip,
          top,
          totalCount
        }
      }), {
        headers: corsHeaders,
        status: 200,
      });

    } catch (error) {
      console.error("Error calling SAP API:", error);
      const functionEnd = performance.now();
      console.log(`Function failed after ${(functionEnd - functionStart).toFixed(2)}ms`);
      return new Response(JSON.stringify({ 
        error: "Failed to call SAP API", 
        message: error.message 
      }), {
        headers: corsHeaders,
        status: 502, // Bad Gateway
      });
    }

  } catch (error) {
    console.error(`Error in edge function: ${error.message}`);
    const functionEnd = performance.now();
    console.log(`Function failed after ${(functionEnd - functionStart).toFixed(2)}ms`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});
