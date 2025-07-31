
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Parse the request body
    const { salesOrderId, partnerFunction } = await req.json();
    
    if (!salesOrderId || !partnerFunction) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: salesOrderId and partnerFunction are required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }
    
    console.log(`Fetching address for Sales Order: ${salesOrderId}, Partner Function: ${partnerFunction}`);
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Fetch SAP credentials from database
    console.log("Attempting to fetch SAP credentials from database...");
    const { data: credentialsData, error: credentialsError } = await supabaseClient
      .from('sap_credentials')
      .select('sap_user, sap_password, server')
      .limit(1)
      .single();

    if (credentialsError) {
      console.error("Error fetching SAP credentials:", credentialsError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to retrieve SAP credentials from database' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    if (!credentialsData) {
      console.error("No SAP credentials found in the database");
      return new Response(
        JSON.stringify({ 
          error: 'No SAP credentials found in database' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 404 
        }
      );
    }

    console.log("SAP credentials retrieved successfully");
    
    const sapUsername = credentialsData.sap_user;
    const sapPassword = credentialsData.sap_password;
    const server = credentialsData.server || 'https://demo21.answerthinkdemo.com';
    
    if (!sapUsername || !sapPassword) {
      console.error('Missing SAP credentials');
      return new Response(
        JSON.stringify({ 
          error: 'SAP credentials are incomplete' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }
    
    // Build the SAP API URL for partner address
    const apiUrl = `${server}/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrderHeaderPartner(SalesOrder='${encodeURIComponent(salesOrderId)}',PartnerFunction='${encodeURIComponent(partnerFunction)}')/to_Address?$format=json`;
    
    console.log(`Calling SAP API URL: ${apiUrl} (credentials omitted)`);
    
    // Create Base64 encoded credentials for Basic Auth
    const credentials = btoa(`${sapUsername}:${sapPassword}`);
    
    // Fetch data from SAP
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SAP API error (${response.status}): ${errorText}`);
      
      return new Response(
        JSON.stringify({ 
          error: `Error fetching data from SAP: ${response.statusText}`,
          details: errorText
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: response.status 
        }
      );
    }
    
    // Parse and return the response
    const data = await response.json();
    console.log('SAP address API response received:', JSON.stringify(data).substring(0, 500) + '...');
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred processing the request',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
