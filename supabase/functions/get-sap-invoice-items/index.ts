
// Follow Deno Deploy's ES modules support
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

// Main function to handle requests
serve(async (req: Request) => {
  console.log("Edge function get-sap-invoice-items called");

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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract the Invoice ID from the body
    const invoiceId = body?.invoiceId;
    if (!invoiceId) {
      console.error("No invoiceId provided in request body");
      return new Response(JSON.stringify({ error: "invoiceId is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing request for SAP Invoice items, Invoice ID: ${invoiceId}`);

    try {
      // Fetch SAP credentials from the database
      console.log("Attempting to fetch SAP credentials from database...");
      
      const { data: credentialsData, error: credentialsError } = await supabaseClient
        .from('sap_credentials')
        .select('sap_user, sap_password, server, api_path')
        .limit(1)
        .single();

      if (credentialsError) {
        console.error("Error fetching SAP credentials:", credentialsError);
        return new Response(JSON.stringify({ 
          error: "Failed to retrieve SAP credentials", 
          details: credentialsError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!credentialsData) {
        console.error("No SAP credentials found in the database");
        return new Response(JSON.stringify({ error: "SAP credentials not found" }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log("SAP credentials retrieved successfully");
      
      // Extract credentials and connection details
      const sapUsername = credentialsData.sap_user;
      const sapPassword = credentialsData.sap_password;
      const server = credentialsData.server;
      
      // Construct the API path for the invoice items
      const apiPath = `/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/A_BillingDocument('${encodeURIComponent(invoiceId)}')/to_Item`;

      if (!sapUsername || !sapPassword || !server) {
        console.error("SAP credentials or connection details incomplete");
        return new Response(JSON.stringify({ error: "SAP credentials or connection details are incomplete" }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Construct the SAP API URL from the server and API path
      const sapApiUrl = `${server}${apiPath}`;
      console.log("Using SAP API URL:", sapApiUrl);
      
      // First get CSRF token using GET method
      const serviceRootUrl = `${server}/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/A_BillingDocument`;
      console.log("Fetching CSRF token from:", serviceRootUrl);
      
      const csrfResponse = await fetch(serviceRootUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${sapUsername}:${sapPassword}`)}`,
          'x-csrf-token': 'Fetch',
          'Accept': 'application/json'
        }
      });
      
      console.log("CSRF token response status:", csrfResponse.status);
      
      if (!csrfResponse.ok) {
        let errorText;
        try {
          errorText = await csrfResponse.text();
        } catch (e) {
          errorText = "Could not read error response text";
        }
        console.error("Error fetching CSRF token:", errorText);
        return new Response(JSON.stringify({ 
          error: "Error authenticating with SAP", 
          details: errorText 
        }), {
          status: 502, // Bad Gateway
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Extract the CSRF token and cookies
      const csrfToken = csrfResponse.headers.get('x-csrf-token');
      const cookiesHeader = csrfResponse.headers.get('set-cookie');
      
      console.log("CSRF token obtained:", csrfToken ? "Yes" : "No");
      console.log("Cookies obtained:", cookiesHeader ? "Yes" : "No");
      
      // Parse cookies
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
      
      // Construct the final URL with format parameter
      const formatParam = '?$format=json';
      const url = `${sapApiUrl}${formatParam}`;
      
      console.log("Calling SAP API URL with token and cookies:", url);

      // Set up headers for the SAP API call
      const headers: Record<string, string> = {
        'Authorization': `Basic ${btoa(`${sapUsername}:${sapPassword}`)}`,
        'Accept': 'application/json'
      };
      
      // Add CSRF token and cookies if available
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
      
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader;
      }
      
      // Make the request to the SAP API
      const sapResponse = await fetch(url, { headers });

      // Log the status code from SAP
      console.log("SAP API response status:", sapResponse.status);
      
      // Parse the response
      let sapData;
      let responseText;
      
      try {
        responseText = await sapResponse.text();
        console.log("SAP API response text length:", responseText.length);
        console.log("SAP API response preview:", responseText.substring(0, 200) + "...");
        
        // Only try to parse as JSON if we got a successful response
        if (sapResponse.ok) {
          try {
            sapData = JSON.parse(responseText);
          } catch (parseError) {
            console.error("Error parsing SAP API response:", parseError);
            throw new Error("Invalid JSON response from SAP API");
          }
        }
      } catch (textError) {
        console.error("Error reading SAP API response text:", textError);
        throw new Error("Error reading response from SAP API");
      }
      
      // Check if the response was successful
      if (!sapResponse.ok) {
        console.error("SAP API returned an error:", responseText);
        return new Response(JSON.stringify({ 
          error: "Error from SAP API", 
          details: responseText,
          status: sapResponse.status,
          statusText: sapResponse.statusText
        }), {
          status: 200, // Return 200 with error details to prevent CORS issues
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Return the SAP API response
      return new Response(JSON.stringify(sapData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } catch (error) {
      console.error("Error calling SAP API:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to call SAP API", 
        message: error.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502, // Bad Gateway
      });
    }

  } catch (error) {
    console.error(`Error in edge function: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
