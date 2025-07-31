
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
  console.log("Edge function get-sap-quote-item-flow called");

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
    const { quoteNumber, quoteItem, apiVersion = 'S4' } = body;

    if (!quoteNumber || !quoteItem) {
      return new Response(JSON.stringify({ error: "quoteNumber and quoteItem are required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Fetching document flow for quote ${quoteNumber}, item ${quoteItem}`);

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

    // Set up headers for GET request - no CSRF token needed for GET
    const headers: Record<string, string> = {
      'Authorization': 'Basic ' + btoa(`${sapUsername}:${sapPassword}`),
      'Accept': 'application/json'
    };

    // Fetch quote item document flow using the navigation property
    const flowUrl = `${server}/sap/opu/odata/sap/API_SALES_QUOTATION_SRV/A_SalesQuotationItem(SalesQuotation='${quoteNumber}',SalesQuotationItem='${quoteItem}')/to_SubsequentProcFlowDocItem?$format=json`;
    console.log("Fetching document flow from URL:", flowUrl);

    const flowResponse = await fetch(flowUrl, { 
      method: 'GET',
      headers 
    });

    if (!flowResponse.ok) {
      const errorText = await flowResponse.text();
      console.error("SAP API error response:", errorText);
      console.error("SAP API error status:", flowResponse.status);
      console.error("SAP API error headers:", Object.fromEntries(flowResponse.headers.entries()));
      
      return new Response(JSON.stringify({ 
        error: `SAP API error: ${flowResponse.status}`,
        details: errorText,
        status: flowResponse.status
      }), {
        status: 200, // Return 200 to avoid CORS issues, but include error details
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const flowData = await flowResponse.json();
    console.log(`Document flow data received: ${flowData.d?.results?.length || 0} entries`);

    if (flowData.d?.results) {
      console.log("Document flow results:", JSON.stringify(flowData.d.results, null, 2));
    }

    return new Response(JSON.stringify(flowData), {
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
