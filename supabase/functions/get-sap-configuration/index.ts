
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
 * Fetches SAP credentials from the database
 */
const fetchSapCredentials = async (supabaseClient: any) => {
  console.log("🔍 Attempting to fetch SAP credentials from database...");
  
  const { data: credentialsData, error: credentialsError } = await supabaseClient
    .from('sap_credentials')
    .select('sap_user, sap_password, server')
    .limit(1)
    .single();

  if (credentialsError) {
    console.error("❌ Error fetching SAP credentials:", credentialsError);
    return null;
  }

  if (!credentialsData) {
    console.error("❌ No SAP credentials found in the database");
    return null;
  }

  console.log("✅ SAP credentials retrieved successfully");
  console.log("📊 Credentials info:", {
    hasUsername: !!credentialsData.sap_user,
    hasPassword: !!credentialsData.sap_password,
    server: credentialsData.server || "https://demo21.answerthinkdemo.com"
  });
  
  const sapUsername = credentialsData.sap_user;
  const sapPassword = credentialsData.sap_password;
  const server = credentialsData.server || "https://demo21.answerthinkdemo.com";
  
  if (!sapUsername || !sapPassword) {
    console.error("❌ SAP credentials incomplete:", { 
      hasUsername: !!sapUsername, 
      hasPassword: !!sapPassword,
      hasServer: !!server,
    });
    return null;
  }
  
  return { sapUsername, sapPassword, server };
};

serve(async (req: Request) => {
  console.log("🚀 Edge function get-sap-configuration called");
  console.log("📋 Request method:", req.method);
  console.log("🌐 Request URL:", req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("✈️ Handling CORS preflight request");
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ No authorization header found');
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    console.log("🔑 Authorization header present");

    const payload = await req.json();
    console.log("📦 Raw request payload received:");
    console.log(JSON.stringify(payload, null, 2));

    // Validate the payload structure
    if (!payload || !payload.sales_documents || !Array.isArray(payload.sales_documents)) {
      console.error('❌ Invalid payload structure');
      console.log("📋 Expected: { sales_documents: [{ vbeln: string }] }");
      return new Response(JSON.stringify({ error: 'Invalid payload structure' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Extract the order number from the first sales document
    const vbeln = payload.sales_documents[0]?.vbeln;
    if (!vbeln) {
      console.error('❌ No order number (vbeln) found in payload');
      return new Response(JSON.stringify({ error: 'Order number (vbeln) is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`🎯 Processing configuration request for order: ${vbeln}`);

    // Fetch SAP credentials from database
    const credentials = await fetchSapCredentials(supabaseClient);
    if (!credentials) {
      return new Response(JSON.stringify({ error: 'SAP credentials not found or incomplete' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Construct the proper SAP payload with i_bapi_view
    const sapPayload = {
      i_bapi_view: {
        header: "X",
        item: "X",
        sdschedule: "",
        partner: "",
        SDCOND: "X",
        configure: "X"  // This is crucial for configuration data
      },
      sales_documents: [
        {
          vbeln: vbeln
        }
      ],
      order_headers_out: [],
      order_cfgs_curefs_out: [],
      order_cfgs_cucfgs_out: [],
      order_cfgs_cuins_out: [],
      order_cfgs_cuvals_out: [],
      order_cfgs_cuprts_out: [],
      return: []
    };

    // Construct the SAP API URL with credentials
    const sapUrl = `${credentials.server}/sap/zfmcall/BAPISDORDER_GETDETAILEDLIST?format=json&sap-user=${encodeURIComponent(credentials.sapUsername)}&sap-password=${encodeURIComponent(credentials.sapPassword)}`;

    console.log("🔗 SAP API Configuration:");
    console.log("  📍 Server:", credentials.server);
    console.log("  👤 Username:", credentials.sapUsername);
    console.log("  🔗 Full URL:", sapUrl.replace(credentials.sapPassword, '[REDACTED]'));
    console.log("  📤 Payload to SAP:");
    console.log(JSON.stringify(sapPayload, null, 2));

    console.log("📡 Making SAP API call...");
    const startTime = Date.now();
    
    const response = await fetch(sapUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(sapPayload),
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log("📊 SAP API Response Info:");
    console.log("  ⏱️ Response time:", `${responseTime}ms`);
    console.log("  📈 Status:", response.status);
    console.log("  📋 Status text:", response.statusText);
    console.log("  📦 Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ SAP API error response:");
      console.error("  📄 Error text:", errorText);
      console.error("  📈 Status:", response.status);
      console.error("  📋 Status text:", response.statusText);
      
      return new Response(JSON.stringify({ 
        error: `SAP API error: ${response.status} ${response.statusText}`,
        details: errorText 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    const data = await response.json();
    console.log("✅ SAP configuration data received successfully");
    console.log("📊 Response data structure:");
    console.log("  🔢 Keys in response:", Object.keys(data || {}));
    
    if (data) {
      // Log structure of key arrays
      if (data.order_cfgs_curefs_out) {
        console.log("  📋 order_cfgs_curefs_out count:", data.order_cfgs_curefs_out.length);
        if (data.order_cfgs_curefs_out.length > 0) {
          console.log("  📄 First curefs item:", JSON.stringify(data.order_cfgs_curefs_out[0], null, 2));
        }
      }
      
      if (data.order_cfgs_cuvals_out) {
        console.log("  📋 order_cfgs_cuvals_out count:", data.order_cfgs_cuvals_out.length);
        if (data.order_cfgs_cuvals_out.length > 0) {
          console.log("  📄 First cuvals item:", JSON.stringify(data.order_cfgs_cuvals_out[0], null, 2));
        }
      }
      
      if (data.order_cfgs_cuins_out) {
        console.log("  📋 order_cfgs_cuins_out count:", data.order_cfgs_cuins_out.length);
        if (data.order_cfgs_cuins_out.length > 0) {
          console.log("  📄 First cuins item:", JSON.stringify(data.order_cfgs_cuins_out[0], null, 2));
        }
      }
      
      // Log the full response for detailed debugging (can be large)
      console.log("📋 Full SAP response data:");
      console.log(JSON.stringify(data, null, 2));
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("💥 Error in get-sap-configuration function:", error);
    console.error("📋 Error details:");
    console.error("  📄 Message:", error.message);
    console.error("  📊 Stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
