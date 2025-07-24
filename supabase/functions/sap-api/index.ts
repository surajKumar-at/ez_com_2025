import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`SAP API endpoint: ${req.method}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { soldTo, salesOrg, division, distributionChannel } = await req.json();

      if (!soldTo) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Sold To is required' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get SAP credentials
      const { data: credentials, error: credError } = await supabase
        .from('ezc_sap_credincials')
        .select('username, password')
        .eq('environment', 'DEMO')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (credError || !credentials) {
        console.error('Error fetching SAP credentials:', credError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'SAP credentials not found' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get SAP URLs
      const { data: baseUrlData, error: baseUrlError } = await supabase
        .from('ezc_sap_urls')
        .select('value')
        .eq('key', 'BASE_URL')
        .single();

      const { data: endpointData, error: endpointError } = await supabase
        .from('ezc_sap_urls')
        .select('value')
        .eq('key', 'GET_SELECTED_SOLDTO')
        .single();

      if (baseUrlError || endpointError || !baseUrlData || !endpointData) {
        console.error('Error fetching SAP URLs:', baseUrlError, endpointError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'SAP URL configuration not found' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const baseUrl = baseUrlData.value;
      const endpoint = endpointData.value.replace('{PARTNER}', soldTo);
      
      const fullUrl = `${baseUrl}${endpoint}`;

      console.log(`Calling SAP API: ${fullUrl}`);

      // Create basic auth header
      const authHeader = btoa(`${credentials.username}:${credentials.password}`);

      // Call SAP API
      const sapResponse = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!sapResponse.ok) {
        const errorText = await sapResponse.text();
        console.error('SAP API Error:', errorText);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `SAP API Error: ${sapResponse.status} - ${errorText}` 
          }),
          { 
            status: sapResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const sapData = await sapResponse.json();
      
      console.log('SAP API Response received');

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: sapData,
          requestData: {
            soldTo,
            salesOrg,
            division,
            distributionChannel
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in SAP API function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});