
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { secureVerifyAuth, validateAndSanitizeInput } from "../_shared/secureAuth.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSapCredentials } from "./services/credentialsService.ts";
import { getSoldToParty } from "./services/soldToService.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Auth header present:', req.headers.get('Authorization') ? 'Yes' : 'No');
    
    // Secure authentication verification
    const { user, error: authError } = await secureVerifyAuth(req.headers.get('Authorization'));
    if (authError) {
      return new Response(JSON.stringify(authError), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: authError.status,
      });
    }

    // Parse and validate request body
    const body = await req.json();
    const productCode = validateAndSanitizeInput(body.productCode, 50);
    
    if (!productCode) {
      return new Response(JSON.stringify({ 
        error: 'Product code is required',
        status: 400 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`Processing secure request for product code: ${productCode}, user ID: ${user.id}`);
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get sold-to party information
    const { soldTo, error: soldToError } = await getSoldToParty(supabaseClient, user.id);
    if (soldToError) {
      return new Response(JSON.stringify(soldToError), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: soldToError.status,
      });
    }

    // Get SAP credentials
    const { credentials, error: credError } = await getSapCredentials(supabaseClient);
    if (credError) {
      return new Response(JSON.stringify(credError), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: credError.status,
      });
    }

    // Prepare SAP API request with secure headers
    const sapPayload = {
      SALESORGANIZATION: credentials.sales_organization || "1710",
      DISTRIBUTIONCHANNEL: credentials.distribution_channel || "10", 
      DIVISION: credentials.division || "00",
      TRANSACTIONCURRENCY: "USD",
      SALESDOCUMENTTYPE: "OR",
      SOLDTOPARTY: soldTo.sap_sold_to_id,
      PRICINGDATE: new Date().toISOString().split('T')[0],
      Items: [{
        MATERIAL: productCode,
        TARGETQUANTITY: "1.000",
        TARGETQUANTITYUNIT: "EA"
      }]
    };

    console.log('Calling SAP API with payload:', JSON.stringify(sapPayload));
    console.log('Using SAP server from credentials:', credentials.server);

    // Create secure authentication header
    const authString = btoa(`${credentials.sap_user}:${credentials.sap_password}`);
    
    // Build the full SAP API URL using the server from credentials
    const sapApiUrl = `${credentials.server}/sap/opu/odata4/sap/api_salesprice/srvd_a2x/sap/salesprice/0001/`;
    
    // Fetch CSRF token first (with error handling)
    let csrfToken = '';
    try {
      const csrfResponse = await fetch(sapApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authString}`,
          'X-CSRF-Token': 'Fetch',
          'Accept': 'application/json'
        }
      });
      
      if (csrfResponse.ok) {
        csrfToken = csrfResponse.headers.get('X-CSRF-Token') || '';
      } else {
        console.error(`Error fetching CSRF token for SAP API ${csrfResponse.status} ${csrfResponse.statusText}`);
      }
    } catch (csrfError) {
      console.error('CSRF token fetch failed:', csrfError);
    }

    // Make SAP API request with security headers
    const response = await fetch(`${sapApiUrl}SalesPriceFunction`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(csrfToken && { 'X-CSRF-Token': csrfToken })
      },
      body: JSON.stringify(sapPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SAP API error ${response.status}:`, errorText);
      
      return new Response(JSON.stringify({
        error: `SAP API returned ${response.status}`,
        details: 'Unable to fetch pricing information',
        status: response.status
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    const sapData = await response.json();
    console.log('SAP API response received successfully');

    // Return secure response
    return new Response(JSON.stringify({
      success: true,
      data: sapData
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      },
      status: 200,
    });

  } catch (error) {
    console.error('Secure API error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      status: 500
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
