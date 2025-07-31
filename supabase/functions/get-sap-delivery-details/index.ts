
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Base function for handling requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request to get the delivery ID
    const { deliveryId } = await req.json()
    
    if (!deliveryId) {
      return new Response(
        JSON.stringify({ error: 'Missing delivery ID parameter' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      )
    }

    // Get database credentials from environment
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get SAP credentials from database
    const { data: sapCredentials, error: credentialsError } = await supabaseClient
      .from('sap_credentials')
      .select('*')
      .limit(1)
      .single()

    if (credentialsError || !sapCredentials) {
      console.error('Error fetching SAP credentials:', credentialsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch SAP credentials' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      )
    }

    // Construct the API URL
    const apiUrl = `${sapCredentials.server}/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV/A_OutbDeliveryHeader('${deliveryId}')`
    
    console.log('Making SAP API request to:', apiUrl)

    // Call the SAP API
    const sapResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${btoa(`${sapCredentials.sap_user}:${sapCredentials.sap_password}`)}`,
        Accept: 'application/json',
      },
    })

    // Check for API errors
    if (!sapResponse.ok) {
      const errorText = await sapResponse.text()
      console.error('SAP API error:', errorText)
      
      // Return the full error response including status code and text
      return new Response(
        JSON.stringify({ 
          error: `SAP API error: ${sapResponse.status} ${sapResponse.statusText}`,
          details: errorText,
          url: apiUrl
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
      )
    }

    // Parse and return the API response
    const deliveryData = await sapResponse.json()
    
    return new Response(
      JSON.stringify(deliveryData),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error in get-sap-delivery-details:', error)
    
    // Instead of returning 500, return 200 with error details
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
    )
  }
})
