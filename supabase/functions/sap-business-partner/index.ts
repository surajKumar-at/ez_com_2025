import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createDbClient } from '../../../src/lib/db/client.ts';

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
    const db = createDbClient(Deno.env.get('DATABASE_URL')!);

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
      const credentialResult = await db.query(`
        SELECT username, password 
        FROM ezc_sap_credincials 
        WHERE environment = 'DEMO' 
        ORDER BY created_at DESC 
        LIMIT 1
      `);

      if (credentialResult.rows.length === 0) {
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

      const { username, password } = credentialResult.rows[0];

      // Get SAP URLs
      const baseUrlResult = await db.query(`
        SELECT value 
        FROM ezc_sap_urls 
        WHERE key = 'BASE_URL'
      `);

      const endpointResult = await db.query(`
        SELECT value 
        FROM ezc_sap_urls 
        WHERE key = 'GET_SELECTED_SOLDTO'
      `);

      if (baseUrlResult.rows.length === 0 || endpointResult.rows.length === 0) {
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

      const baseUrl = baseUrlResult.rows[0].value;
      const endpoint = endpointResult.rows[0].value.replace('{PARTNER}', soldTo);
      
      const fullUrl = `${baseUrl}${endpoint}`;

      console.log(`Calling SAP API: ${fullUrl}`);

      // Create basic auth header
      const authHeader = btoa(`${username}:${password}`);

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