
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-client.ts'

// Base function for handling requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request to get the sold to ID
    const { sapSoldToId } = await req.json()
    
    if (!sapSoldToId) {
      return new Response(
        JSON.stringify({ error: 'Missing Sold To ID parameter' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      )
    }

    // Get SAP credentials from database
    const { data: sapCredentials, error: credentialsError } = await supabaseAdmin
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

    // Construct the API URL with filter for the specific sold to party
    const filter = encodeURIComponent(`SoldToParty eq '${sapSoldToId}'`)
    const serviceRootUrl = `${sapCredentials.server}/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV`
    const apiUrl = `${serviceRootUrl}/A_OutbDeliveryHeader?$filter=${filter}`
    
    console.log('Fetching CSRF token from service root:', serviceRootUrl)

    // First make a GET request to fetch a CSRF token
    const csrfResponse = await fetch(serviceRootUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${sapCredentials.sap_user}:${sapCredentials.sap_password}`)}`,
        'x-csrf-token': 'Fetch',
        'Accept': 'application/json'
      }
    })
    
    if (!csrfResponse.ok) {
      const errorText = await csrfResponse.text()
      console.error('Error fetching CSRF token:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: `CSRF token error: ${csrfResponse.status} ${csrfResponse.statusText}`,
          details: errorText
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 }
      )
    }
    
    // Extract CSRF token and cookies
    const csrfToken = csrfResponse.headers.get('x-csrf-token')
    const cookiesHeader = csrfResponse.headers.get('set-cookie')
    
    console.log('CSRF token obtained:', csrfToken ? 'Yes' : 'No')
    console.log('Cookies obtained:', cookiesHeader ? 'Yes' : 'No')
    
    // Parse cookies
    const cookies = []
    if (cookiesHeader) {
      const cookieParts = cookiesHeader.split(',')
      for (const part of cookieParts) {
        if (part.includes('=')) {
          const mainPart = part.split(';')[0].trim()
          cookies.push(mainPart)
        }
      }
    }
    
    const cookieHeader = cookies.join('; ')
    console.log('Making SAP API request to:', apiUrl)
    
    // Call the SAP API with the CSRF token and cookies
    const headers: Record<string, string> = {
      'Authorization': `Basic ${btoa(`${sapCredentials.sap_user}:${sapCredentials.sap_password}`)}`,
      'Accept': 'application/json',
      'x-csrf-token': csrfToken || ''
    }
    
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    const sapResponse = await fetch(apiUrl, {
      method: 'GET',
      headers
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
    console.error('Error in get-sap-delivery-list:', error)
    
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
