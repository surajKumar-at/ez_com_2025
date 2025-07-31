
import { corsHeaders } from "../../_shared/cors.ts";
import { formatSimulationPayload } from "../services/sapPayloadService.ts";
import { getProductSapCodesMap } from "../services/productService.ts";
import { callSapSimulationApi } from "../services/sapApiService.ts";
import { extractPricingInfo } from "../services/responseParser.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

/**
 * Handles the main simulation request flow
 */
export async function handleSimulationRequest(req: Request) {
  try {
    const requestData = await req.json();
    const { cart, soldTo, shipTo, productSapCodes } = requestData;
    
    console.log("============= RECEIVED REQUEST DATA =============");
    console.log("Request data received:", JSON.stringify({
      cartItems: cart?.items?.length || 0,
      soldToId: soldTo?.id,
      shipToId: shipTo?.id,
      productSapCodesCount: Object.keys(productSapCodes || {}).length
    }, null, 2));
    
    // Log the cart items in detail
    if (cart && cart.items && cart.items.length > 0) {
      console.log("Cart items details:");
      cart.items.forEach((item: any, index: number) => {
        console.log(`Item ${index+1}: Product ID ${item.productId}, Quantity ${item.quantity}, SAP Code: ${item.sapProductCode || 'Not specified'}`);
      });
    }
    
    // Log the SAP codes received
    console.log("Product SAP codes received:");
    if (productSapCodes) {
      Object.entries(productSapCodes).forEach(([id, code]) => {
        console.log(`Product ID ${id} -> SAP code: ${code}`);
      });
    } else {
      console.log("No product SAP codes provided in the request");
    }
    console.log("==================================================");
    
    if (!cart || !soldTo || !shipTo) {
      console.error("Missing required data in request");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required data: cart, soldTo, or shipTo" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Use 200 instead of 400 to handle error in client
        }
      );
    }

    // Log key information for debugging
    console.log("Simulating SAP order with:", {
      cartItemCount: cart.items?.length || 0,
      soldToId: soldTo.sap_id || soldTo.sapCode || soldTo.accountNumber || 'Not provided',
      shipToId: shipTo.sap_id || shipTo.sapCode || 'Not provided'
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      throw new Error("Failed to initialize Supabase client - missing credentials");
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Fetch SAP credentials
    console.log("Fetching SAP credentials from database");
    const { data: sapCreds, error: sapCredsError } = await supabaseClient
      .from("sap_credentials")
      .select("server, sap_user, sap_password, sales_organization, distribution_channel, division, api_path")
      .limit(1)
      .single();

    if (sapCredsError) {
      console.error("Error fetching SAP credentials:", sapCredsError);
      throw new Error("Failed to retrieve SAP credentials");
    }

    if (!sapCreds) {
      console.error("No SAP credentials found in database");
      throw new Error("No SAP credentials found");
    }
    
    console.log("SAP credentials retrieved successfully");

    // Get the product SAP codes
    const productSapCodesMap = await getProductSapCodesMap(
      cart, 
      productSapCodes, 
      supabaseClient
    );
    
    // Determine the SAP codes to use
    const soldToSapId = soldTo.sap_id || soldTo.sapCode || soldTo.accountNumber;
    const shipToSapId = shipTo.sap_id || shipTo.sapCode;

    if (!soldToSapId) {
      console.error("Missing SAP ID for sold-to party:", soldTo);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing SAP ID for sold-to party" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Return 200 with error info
        }
      );
    }

    // Format the payload for SAP simulation
    console.log("Formatting SAP simulation payload");
    const payload = formatSimulationPayload(
      cart,
      productSapCodesMap,
      soldToSapId,
      shipToSapId || soldToSapId, // Use sold-to as fallback if ship-to is missing
      sapCreds
    );

    // Call the SAP API
    const apiResponse = await callSapSimulationApi(payload, sapCreds);
    
    // Handle the API response
    if (!apiResponse.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: apiResponse.error || "Error from SAP simulation API", 
          details: apiResponse.details, 
          messages: apiResponse.messages 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Return 200 with error info for client handling
        }
      );
    }
    
    // Extract pricing information from the response
    const simulationResults = extractPricingInfo(apiResponse.data);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        simulationResults
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Error in simulation handler:", error);
    throw error; // Let the main error handler deal with this
  }
}
