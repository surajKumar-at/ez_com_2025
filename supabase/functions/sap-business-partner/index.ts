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
        .select('esc_user_name, esc_password, esc_base_url')
        .eq('esc_name', 'DEMO')
        .eq('esc_is_active', 'TRUE')
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

      const baseUrl = credentials.esc_base_url;
      
      // Step 1: Call GET_BUSINESS_PARTNERS to get BPCustomerNumber
      const businessPartnersEndpoint = businessPartnersEndpointData.value
        .replace('{CUSTOMER}', soldTo)
        .replace('{SALES_ORG}', salesOrg || '')
        .replace('{DIST_CHANNEL}', distributionChannel || '')
        .replace('{DIVISION}', division || '');
      
      const businessPartnersUrl = `${baseUrl}${businessPartnersEndpoint}`;
      console.log(`Step 1 - Calling GET_BUSINESS_PARTNERS: ${businessPartnersUrl}`);

      // Create basic auth header
      const authHeader = btoa(`${credentials.esc_user_name}:${credentials.esc_password}`);

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

      // Extract all unique BPCustomerNumber values from the response
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

      // Get all unique BPCustomerNumber values
      const uniqueBPCustomerNumbers = [...new Set(
        partnerFunctions
          .map(pf => pf.BPCustomerNumber)
          .filter(bpNum => bpNum && bpNum.trim() !== '')
      )];

      if (!uniqueBPCustomerNumbers.length) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'No valid BPCustomerNumber found in partner functions' 
          }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`Extracted unique BPCustomerNumbers: ${uniqueBPCustomerNumbers.join(', ')}`);

      // Step 2: Call GET_SELECTED_SOLDTO for each unique BPCustomerNumber
      const businessPartnerResults = [];
      
      for (const bpCustomerNumber of uniqueBPCustomerNumbers) {
        const selectedSoldToEndpoint = selectedSoldToEndpointData.value.replace('{PARTNER}', bpCustomerNumber);
        const selectedSoldToUrl = `${baseUrl}${selectedSoldToEndpoint}`;
        
        console.log(`Step 2.${uniqueBPCustomerNumbers.indexOf(bpCustomerNumber) + 1} - Calling GET_SELECTED_SOLDTO for ${bpCustomerNumber}: ${selectedSoldToUrl}`);

        try {
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
            console.error(`GET_SELECTED_SOLDTO API Error for ${bpCustomerNumber}:`, errorText);
            
            businessPartnerResults.push({
              bpCustomerNumber,
              success: false,
              error: `API Error: ${selectedSoldToResponse.status} - ${errorText}`,
              data: null
            });
          } else {
            const selectedSoldToData = await selectedSoldToResponse.json();
            console.log(`GET_SELECTED_SOLDTO Response received for ${bpCustomerNumber}`);
            
            businessPartnerResults.push({
              bpCustomerNumber,
              success: true,
              error: null,
              data: selectedSoldToData
            });
          }
        } catch (error) {
          console.error(`Error calling GET_SELECTED_SOLDTO for ${bpCustomerNumber}:`, error);
          businessPartnerResults.push({
            bpCustomerNumber,
            success: false,
            error: `Request failed: ${error.message}`,
            data: null
          });
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          businessPartnersData: businessPartnersData,
          businessPartnerResults: businessPartnerResults,
          uniqueBPCustomerNumbers: uniqueBPCustomerNumbers,
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