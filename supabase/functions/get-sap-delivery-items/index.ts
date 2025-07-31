
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

    // Construct the API URL for delivery items - UPDATED PATH
    const apiUrl = `${sapCredentials.server}/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV/A_OutbDeliveryHeader('${deliveryId}')/to_DeliveryDocumentItem`
    
    console.log('Making SAP API request to:', apiUrl)
    
    // First get CSRF token using GET method
    const serviceRootUrl = `${sapCredentials.server}/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV/A_OutbDeliveryHeader`
    console.log('Fetching CSRF token from:', serviceRootUrl)
    
    try {
      const csrfResponse = await fetch(serviceRootUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${sapCredentials.sap_user}:${sapCredentials.sap_password}`)}`,
          'x-csrf-token': 'Fetch',
          'Accept': 'application/json'
        }
      })
      
      console.log('CSRF token response status:', csrfResponse.status)
      
      // Extract the CSRF token and cookies
      const csrfToken = csrfResponse.headers.get('x-csrf-token')
      const cookiesHeader = csrfResponse.headers.get('set-cookie')
      
      console.log('CSRF token obtained:', csrfToken ? 'Yes' : 'No')
      console.log('Cookies obtained:', cookiesHeader ? 'Yes' : 'No')
      
      // Set up headers for the SAP API call
      const headers: Record<string, string> = {
        'Authorization': `Basic ${btoa(`${sapCredentials.sap_user}:${sapCredentials.sap_password}`)}`,
        'Accept': 'application/json',
      }
      
      // Add CSRF token if available
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken
      }
      
      // Parse cookies and add to headers if available
      if (cookiesHeader) {
        const cookies: string[] = []
        const cookieParts = cookiesHeader.split(', ')
        for (const part of cookieParts) {
          if (part.includes('=')) {
            const mainPart = part.split(';')[0].trim()
            cookies.push(mainPart)
          }
        }
        
        const cookieHeader = cookies.join('; ')
        if (cookieHeader) {
          headers['Cookie'] = cookieHeader
        }
      }

      // Call the SAP API with token and cookies
      const sapResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: headers,
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
      const itemsData = await sapResponse.json()
      
      return new Response(
        JSON.stringify(itemsData),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    } catch (fetchError) {
      console.error('Error calling SAP API:', fetchError)
      return new Response(
        JSON.stringify({ 
          error: 'Error communicating with SAP API',
          details: fetchError.message
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 502 }
      )
    }
  } catch (error) {
    console.error('Error in get-sap-delivery-items:', error)
    
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
