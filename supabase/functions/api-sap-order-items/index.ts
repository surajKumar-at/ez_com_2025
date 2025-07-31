import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { verifyUserSoldToAccess } from "../_shared/userSoldToVerification.ts";
import { ApiResponse } from "../_shared/types.ts";

// Set up CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Main function to handle requests
serve(async (req: Request) => {
  console.log("Edge function api-sap-order-items called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Extract the authentication information
    const authHeader = req.headers.get('Authorization');
    const apiKeyHeader = req.headers.get('x-api-key');
    
    console.log("Auth header present:", !!authHeader);
    console.log("API key header present:", !!apiKeyHeader);
    
    // Validate either an API key or JWT token is provided
    if (!authHeader && !apiKeyHeader) {
      console.log("No authentication provided, returning 401");
      return new Response(JSON.stringify({
        success: false,
        error: {
          message: "Authentication required",
          code: "auth_required"
        }
      } as ApiResponse<any>), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // Create an authenticated Supabase client for user requests
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );

    // If using API key, validate it
    let hasValidPermissions = false;
    let verificationResult = null;
    
    // Parse request body to get the required data for verification
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body received:", JSON.stringify(requestBody));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({ 
        success: false,
        error: { 
          message: "Invalid request body",
          code: "invalid_request" 
        }
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    
    // Extract required parameters
    const salesOrderId = requestBody?.salesOrderId;
    const soldToId = requestBody?.soldToId;
    
    if (!salesOrderId) {
      console.error("No salesOrderId provided in request body");
      return new Response(JSON.stringify({ 
        success: false,
        error: {
          message: "salesOrderId is required",
          code: "missing_parameter"
        }
      }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    
    if (apiKeyHeader && !authHeader) {
      console.log("Processing API key authentication...");
      
      if (!soldToId) {
        console.error("Missing soldToId parameter for API key access");
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: "soldToId is required when using API key authentication",
            code: "missing_parameter"
          }
        } as ApiResponse<any>), {
          status: 400,
          headers: corsHeaders,
        });
      }
      
      // Verify that the API key has permission to access this soldToId
      verificationResult = await verifyUserSoldToAccess(
        apiKeyHeader,
        soldToId,
        supabaseUrl,
        supabaseServiceKey
      );
      
      if (!verificationResult.verified) {
        console.error("API key verification failed:", verificationResult.error);
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: verificationResult.error,
            code: "verification_failed"
          }
        } as ApiResponse<any>), {
          status: verificationResult.status || 401,
          headers: corsHeaders,
        });
      }
      
      // Verify API key has order items permission
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const { data: apiKeyData, error: apiKeyError } = await supabaseAdmin
        .from('api_keys')
        .select('permissions, active')
        .eq('key', apiKeyHeader)
        .single();
        
      if (apiKeyError || !apiKeyData) {
        console.error("Invalid API key or database error:", apiKeyError?.message || "No data returned");
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: "Invalid API key",
            code: "invalid_api_key"
          }
        } as ApiResponse<any>), {
          status: 401,
          headers: corsHeaders,
        });
      }
      
      // Check if the API key is active
      if (!apiKeyData.active) {
        console.log("API key is inactive");
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: "API key is inactive",
            code: "inactive_api_key"
          }
        } as ApiResponse<any>), {
          status: 401,
          headers: corsHeaders,
        });
      }
      
      // Check if the API key has permission to access SAP order items
      if (!apiKeyData.permissions.includes('sap_order_items')) {
        console.log("API key missing required permission: sap_order_items");
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: "API key does not have permission to access SAP order items",
            code: "insufficient_permissions"
          }
        } as ApiResponse<any>), {
          status: 403,
          headers: corsHeaders,
        });
      }
      
      console.log("API key verification successful");
      hasValidPermissions = true;
    }

    // Only proceed if authentication is valid
    if (!authHeader && !hasValidPermissions) {
      console.log("Authentication failed, returning 401");
      return new Response(JSON.stringify({
        success: false,
        error: {
          message: "Authentication failed",
          code: "auth_failed"
        }
      } as ApiResponse<any>), {
        status: 401,
        headers: corsHeaders,
      });
    }

    console.log(`Processing request for SAP Sales Order ID items: ${salesOrderId}`);

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
          success: false,
          error: {
            message: "Failed to retrieve SAP credentials",
            details: credentialsError.message,
            code: "credentials_error"
          }
        }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      if (!credentialsData) {
        console.error("No SAP credentials found in the database");
        return new Response(JSON.stringify({ 
          success: false,
          error: {
            message: "SAP credentials not found",
            code: "missing_credentials"
          }
        }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      console.log("SAP credentials retrieved successfully");
      
      // Extract credentials and connection details
      const sapUsername = credentialsData.sap_user;
      const sapPassword = credentialsData.sap_password;
      const server = credentialsData.server;
      
      // Construct the API path for the specific sales order items
      const apiPath = `/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('${encodeURIComponent(salesOrderId)}')/to_Item`;

      if (!sapUsername || !sapPassword || !server) {
        console.error("SAP credentials or connection details incomplete:", { 
          hasUsername: !!sapUsername, 
          hasPassword: !!sapPassword,
          hasServer: !!server,
        });
        return new Response(JSON.stringify({ 
          success: false,
          error: {
            message: "SAP credentials or connection details are incomplete",
            code: "incomplete_credentials"
          }
        }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      // Construct the SAP API URL from the server and API path
      const sapApiUrl = `${server}${apiPath}`;
      console.log("Using SAP API URL:", sapApiUrl);
      
      // First get CSRF token using GET method
      const serviceRootUrl = `${server}/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder`;
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
        const errorText = await csrfResponse.text();
        console.error("Error fetching CSRF token:", errorText);
        return new Response(JSON.stringify({ 
          success: false,
          error: {
            message: "Error authenticating with SAP",
            details: errorText,
            code: "sap_auth_error"
          }
        }), {
          status: 502,
          headers: corsHeaders,
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
      
      console.log("Calling SAP API URL with token and cookies:", url.replace(/sap-password=([^&]*)/, 'sap-password=*****'));

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
          success: false,
          error: {
            message: "Error from SAP API",
            details: responseText,
            status: sapResponse.status,
            statusText: sapResponse.statusText,
            code: "sap_api_error"
          }
        }), {
          status: 200, // Return 200 with error details to prevent CORS issues
          headers: corsHeaders,
        });
      }

      // Return the SAP API response with API standard formatting
      return new Response(JSON.stringify({
        success: true,
        data: sapData.d?.results || [],
        meta: {
          version: "v1",
          apiSource: "S4",
          count: sapData.d?.results?.length || 0
        }
      } as ApiResponse<any>), {
        headers: corsHeaders,
        status: 200,
      });

    } catch (error) {
      console.error("Error calling SAP API:", error);
      return new Response(JSON.stringify({ 
        success: false,
        error: {
          message: "Failed to call SAP API",
          details: error.message,
          code: "sap_api_call_failed"
        }
      }), {
        headers: corsHeaders,
        status: 502, // Bad Gateway
      });
    }

  } catch (error) {
    console.error(`Error in edge function: ${error.message}`);
    return new Response(JSON.stringify({ 
      success: false,
      error: {
        message: error.message,
        code: "internal_error"
      }
    }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});
