
import { corsHeaders } from "../utils/cors.ts";
import { createAuthenticatedClient, getSapSoldToId } from "../services/authService.ts";
import { fetchSapCredentials } from "../services/credentialsService.ts";
import { callSapApi } from "../services/sapApiService.ts";

/**
 * Handles the request to get SAP order details
 * @param req The HTTP request
 * @returns Response with the order details or an error
 */
export const handleOrderDetailsRequest = async (req: Request) => {
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

    // Create an authenticated Supabase client
    const supabaseClient = createAuthenticatedClient(authHeader);
    
    if (!supabaseClient) {
      return new Response(JSON.stringify({ error: "Failed to create authenticated client" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    // Extract the salesOrderId and soldToId from the body
    let salesOrderId = body?.salesOrderId;
    const soldToId = body?.soldToId;
    
    if (!salesOrderId) {
      console.error("No salesOrderId provided in request body");
      return new Response(JSON.stringify({ error: "salesOrderId is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!soldToId) {
      console.error("No soldToId provided in request body");
      return new Response(JSON.stringify({ error: "soldToId is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clean the sales order ID - remove any non-numeric characters
    salesOrderId = salesOrderId.toString().replace(/\D/g, '');
    
    console.log(`Processing request for SAP Sales Order ID: ${salesOrderId} (original), Sold-To ID: ${soldToId}`);

    // Get the SAP sold-to ID associated with the sold-to ID
    const sapSoldToId = await getSapSoldToId(supabaseClient, soldToId);

    // Fetch SAP credentials
    const credentials = await fetchSapCredentials(supabaseClient);
    
    if (!credentials) {
      return new Response(JSON.stringify({ error: "Failed to retrieve SAP credentials" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ensure salesOrderId is 10 digits, padded with zeros
    const paddedSalesOrderId = salesOrderId.padStart(10, '0');
    console.log(`Padded Sales Order ID: ${paddedSalesOrderId}`);
    
    // Ensure soldToId is 10 digits, padded with zeros
    const paddedSoldToId = sapSoldToId.padStart(10, '0');
    console.log(`Padded Sold-To ID: ${paddedSoldToId}`);

    // Call SAP API
    const { sapResponse, sapData } = await callSapApi(credentials, paddedSalesOrderId, paddedSoldToId);
    
    // Check if the response was successful
    if (!sapResponse.ok) {
      console.error("SAP API returned an error:", sapData);
      return new Response(JSON.stringify({ 
        error: "Error from SAP API", 
        details: sapData 
      }), {
        status: 502, // Bad Gateway
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return the SAP API response
    return new Response(JSON.stringify(sapData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error(`Error in order details handler: ${error.message}`);
    return new Response(JSON.stringify({ 
      error: "Failed to call SAP API", 
      message: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 502, // Bad Gateway
    });
  }
};
