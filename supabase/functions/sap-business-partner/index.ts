import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`SAP Business Partner endpoint: ${req.method}`);

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
        .from('ezc_sap_credentials')
        .select('username, password, base_url')
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
      const { data: businessPartnersEndpointData, error: businessPartnersError } = await supabase
        .from('ezc_sap_urls')
        .select('value')
        .eq('key', 'GET_BUSINESS_PARTNERS')
        .single();

      const { data: selectedSoldToEndpointData, error: selectedSoldToError } = await supabase
        .from('ezc_sap_urls')
        .select('value')
        .eq('key', 'GET_SELECTED_SOLDTO')
        .single();

      if (businessPartnersError || selectedSoldToError || !businessPartnersEndpointData || !selectedSoldToEndpointData) {
        console.error('Error fetching SAP URLs:', businessPartnersError, selectedSoldToError);
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

      const baseUrl = credentials.base_url;
      
      // Step 1: Call GET_BUSINESS_PARTNERS to get BPCustomerNumber
      const businessPartnersEndpoint = businessPartnersEndpointData.value
        .replace('{CUSTOMER}', soldTo)
        .replace('{SALES_ORG}', salesOrg || '')
        .replace('{DIST_CHANNEL}', distributionChannel || '')
        .replace('{DIVISION}', division || '');
      
      const businessPartnersUrl = `${baseUrl}${businessPartnersEndpoint}`;
      console.log(`Step 1 - Calling GET_BUSINESS_PARTNERS: ${businessPartnersUrl}`);

      // Create basic auth header
      const authHeader = btoa(`${credentials.username}:${credentials.password}`);

      // Call GET_BUSINESS_PARTNERS API
      const businessPartnersResponse = await fetch(businessPartnersUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!businessPartnersResponse.ok) {
        const errorText = await businessPartnersResponse.text();
        console.error('GET_BUSINESS_PARTNERS API Error:', errorText);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `GET_BUSINESS_PARTNERS API Error: ${businessPartnersResponse.status} - ${errorText}` 
          }),
          { 
            status: businessPartnersResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const businessPartnersData = await businessPartnersResponse.json();
      console.log('GET_BUSINESS_PARTNERS Response received:', JSON.stringify(businessPartnersData, null, 2));

      // Extract BPCustomerNumber from the response
      const partnerFunctions = businessPartnersData?.d?.results || [];
      if (!partnerFunctions.length) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'No partner functions found for the given customer' 
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Use the first BPCustomerNumber found (you can modify this logic if needed)
      const bpCustomerNumber = partnerFunctions[0].BPCustomerNumber;
      if (!bpCustomerNumber) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'BPCustomerNumber not found in partner functions' 
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`Extracted BPCustomerNumber: ${bpCustomerNumber}`);

      // Step 2: Call GET_SELECTED_SOLDTO with the BPCustomerNumber
      const selectedSoldToEndpoint = selectedSoldToEndpointData.value.replace('{PARTNER}', bpCustomerNumber);
      const selectedSoldToUrl = `${baseUrl}${selectedSoldToEndpoint}`;
      
      console.log(`Step 2 - Calling GET_SELECTED_SOLDTO: ${selectedSoldToUrl}`);

      // Call GET_SELECTED_SOLDTO API
      const selectedSoldToResponse = await fetch(selectedSoldToUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!selectedSoldToResponse.ok) {
        const errorText = await selectedSoldToResponse.text();
        console.error('GET_SELECTED_SOLDTO API Error:', errorText);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `GET_SELECTED_SOLDTO API Error: ${selectedSoldToResponse.status} - ${errorText}` 
          }),
          { 
            status: selectedSoldToResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const selectedSoldToData = await selectedSoldToResponse.json();
      console.log('GET_SELECTED_SOLDTO Response received');

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: selectedSoldToData,
          businessPartnersData: businessPartnersData,
          bpCustomerNumber: bpCustomerNumber,
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
    console.error('Error in SAP Business Partner function:', error);
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