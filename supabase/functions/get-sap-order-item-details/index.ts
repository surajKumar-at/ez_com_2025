
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SapCredentials {
  sap_user: string;
  sap_password: string;
  server: string;
}

serve(async (req: Request) => {
  console.log("Edge function get-sap-order-item-details called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No Authorization header found");
      return new Response(JSON.stringify({ error: "No Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const body = await req.json();
    const { salesOrderId, salesOrderItem, apiVersion = 'S4' } = body;

    if (!salesOrderId || !salesOrderItem) {
      return new Response(JSON.stringify({ error: "salesOrderId and salesOrderItem are required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Fetching order item details for order ${salesOrderId}, item ${salesOrderItem}`);

    // Get SAP credentials
    const { data: credentialsData, error: credentialsError } = await supabaseClient
      .from('sap_credentials')
      .select('sap_user, sap_password, server')
      .eq('sap_system_type', apiVersion)
      .limit(1)
      .single();

    if (credentialsError) {
      console.error("Error fetching SAP credentials:", credentialsError);
      return new Response(JSON.stringify({ error: "Failed to retrieve SAP credentials" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { sap_user: sapUsername, sap_password: sapPassword, server } = credentialsData as SapCredentials;

    // Simple headers for GET request - no CSRF token needed
    const headers: Record<string, string> = {
      'Authorization': 'Basic ' + btoa(`${sapUsername}:${sapPassword}`),
      'Accept': 'application/json'
    };

    // Fetch order item details
    const orderItemUrl = `${server}/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrderItem(SalesOrder='${salesOrderId}',SalesOrderItem='${salesOrderItem}')?$format=json`;
    console.log("Fetching order item from URL:", orderItemUrl);

    const orderItemResponse = await fetch(orderItemUrl, { 
      method: 'GET',
      headers 
    });

    if (!orderItemResponse.ok) {
      const errorText = await orderItemResponse.text();
      console.error("SAP API error response:", errorText);
      console.error("SAP API error status:", orderItemResponse.status);
      
      return new Response(JSON.stringify({ 
        error: `SAP API error: ${orderItemResponse.status}`,
        details: errorText,
        status: orderItemResponse.status
      }), {
        status: 200, // Return 200 to avoid CORS issues, but include error details
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const orderItemData = await orderItemResponse.json();
    console.log(`Order item data received for ${salesOrderId}-${salesOrderItem}:`, JSON.stringify(orderItemData, null, 2));

    return new Response(JSON.stringify(orderItemData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`Error in edge function: ${error.message}`);
    console.error("Full error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
