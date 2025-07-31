
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { secureVerifyAuth, validateAndSanitizeInput } from "../_shared/secureAuth.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSapCredentials } from "./services/credentialsService.ts";
import { getSoldToParty } from "./services/soldToService.ts";

serve(async (req) => {
  const functionStart = performance.now();
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Auth header present:', req.headers.get('Authorization') ? 'Yes' : 'No');
    
    // Secure authentication verification
    const authStart = performance.now();
    const { user, error: authError } = await secureVerifyAuth(req.headers.get('Authorization'));
    const authEnd = performance.now();
    console.log(`Authentication took ${(authEnd - authStart).toFixed(2)}ms`);
    
    if (authError) {
      return new Response(JSON.stringify(authError), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: authError.status,
      });
    }

    // Parse and validate request body
    const body = await req.json();
    const productCode = validateAndSanitizeInput(body.productCode, 50);
    const quantity = body.quantity || "1";
    
    if (!productCode) {
      return new Response(JSON.stringify({ 
        error: 'Product code is required',
        status: 400 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`Processing SAP pricing simulation for product: ${productCode}, quantity: ${quantity}, user: ${user.id}`);
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get sold-to party information
    const soldToStart = performance.now();
    const { soldTo, error: soldToError } = await getSoldToParty(supabaseClient, user.id);
    const soldToEnd = performance.now();
    console.log(`Sold-to party fetch took ${(soldToEnd - soldToStart).toFixed(2)}ms`);
    
    if (soldToError) {
      return new Response(JSON.stringify(soldToError), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: soldToError.status,
      });
    }

    // Get SAP credentials
    const credStart = performance.now();
    const { credentials, error: credError } = await getSapCredentials(supabaseClient);
    const credEnd = performance.now();
    console.log(`SAP credentials fetch took ${(credEnd - credStart).toFixed(2)}ms`);
    
    if (credError) {
      return new Response(JSON.stringify(credError), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: credError.status,
      });
    }

    // Prepare SAP API request payload for pricing simulation with schedule lines
    const sapPayload = {
      SalesOrderType: "OR",
      SalesOrganization: credentials.sales_organization || "1710",
      DistributionChannel: credentials.distribution_channel || "10",
      OrganizationDivision: credentials.division || "00",
      SoldToParty: soldTo.sap_sold_to_id,
      PurchaseOrderByCustomer: "Pricing Simulation",
      to_Pricing: {},
      to_PricingElement: [],
      to_Item: [
        {
          SalesOrderItem: "10",
          Material: productCode,
          RequestedQuantity: quantity,
          to_ScheduleLine: []
        }
      ]
    };

    console.log('Calling SAP Pricing Simulation API with payload:', JSON.stringify(sapPayload));
    console.log('Using SAP server from credentials:', credentials.server);

    // Create secure authentication header
    const authString = btoa(`${credentials.sap_user}:${credentials.sap_password}`);
    
    // Build the SAP API URL for pricing simulation
    const sapApiUrl = `${credentials.server}/sap/opu/odata/sap/API_SALES_ORDER_SIMULATION_SRV/A_SalesOrderSimulation`;
    
    // Step 1: Fetch CSRF token using HEAD request to service document
    let csrfToken = '';
    let sessionCookies = '';
    try {
      console.log('Fetching CSRF token using HEAD request to service document...');
      const serviceDocUrl = `${credentials.server}/sap/opu/odata/sap/API_SALES_ORDER_SIMULATION_SRV/`;
      
      const csrfStart = performance.now();
      const csrfResponse = await fetch(serviceDocUrl, {
        method: 'HEAD',
        headers: {
          'Authorization': `Basic ${authString}`,
          'X-CSRF-Token': 'Fetch',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      const csrfEnd = performance.now();
      console.log(`CSRF token fetch took ${(csrfEnd - csrfStart).toFixed(2)}ms`);
      
      console.log('CSRF response status:', csrfResponse.status);
      console.log('CSRF response headers:', Object.fromEntries(csrfResponse.headers.entries()));
      
      if (csrfResponse.ok) {
        csrfToken = csrfResponse.headers.get('X-CSRF-Token') || '';
        
        // Extract session cookies from Set-Cookie headers
        const setCookieHeaders = csrfResponse.headers.get('set-cookie');
        if (setCookieHeaders) {
          // Parse multiple Set-Cookie headers properly
          const cookies = setCookieHeaders.split(',')
            .map(cookie => cookie.split(';')[0].trim())
            .filter(cookie => cookie.includes('='));
          sessionCookies = cookies.join('; ');
        }
        
        console.log('CSRF token received:', csrfToken ? 'Yes' : 'No');
        console.log('Session cookies received:', sessionCookies ? 'Yes' : 'No');
        
        if (!csrfToken) {
          console.warn('No CSRF token received from SAP - this may cause issues');
        }
      } else {
        const errorText = await csrfResponse.text();
        console.error(`CSRF token fetch failed: ${csrfResponse.status} ${csrfResponse.statusText}`);
        console.error('Error details:', errorText);
        
        // Continue without CSRF token - some systems may not require it
        console.warn('Continuing without CSRF token...');
      }
    } catch (csrfError) {
      console.error('CSRF token fetch failed:', csrfError);
      console.warn('Continuing without CSRF token...');
    }

    // Step 2: Make the actual POST request with CSRF token and cookies
    const requestHeaders: Record<string, string> = {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Include CSRF token if we have one
    if (csrfToken) {
      requestHeaders['X-CSRF-Token'] = csrfToken;
    }

    // Include session cookies if we have them
    if (sessionCookies) {
      requestHeaders['Cookie'] = sessionCookies;
    }

    console.log('Making POST request to SAP API...');
    console.log('Request headers included:', Object.keys(requestHeaders));
    console.log('CSRF token being sent:', csrfToken ? 'Yes' : 'No');
    console.log('Cookies being sent:', sessionCookies ? 'Yes' : 'No');

    const sapCallStart = performance.now();
    const response = await fetch(sapApiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(sapPayload)
    });
    const sapCallEnd = performance.now();
    console.log(`SAP pricing simulation API call took ${(sapCallEnd - sapCallStart).toFixed(2)}ms`);

    console.log('SAP API response status:', response.status);
    console.log('SAP API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SAP Pricing Simulation API error ${response.status}:`, errorText);
      
      return new Response(JSON.stringify({
        error: `SAP Pricing Simulation API returned ${response.status}`,
        details: 'Unable to fetch pricing simulation',
        sapError: errorText,
        status: response.status
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    const parseStart = performance.now();
    const sapData = await response.json();
    const parseEnd = performance.now();
    console.log(`SAP response parsing took ${(parseEnd - parseStart).toFixed(2)}ms`);
    console.log('SAP Pricing Simulation API response received successfully');

    // Extract pricing information from the response
    let unitPrice = null;
    let currency = null;
    let scheduleLines = [];
    let isAvailable = true;
    let availabilityMessage = '';
    
    if (sapData.d && sapData.d.to_Item && sapData.d.to_Item.results && sapData.d.to_Item.results.length > 0) {
      const firstItem = sapData.d.to_Item.results[0];
      unitPrice = firstItem.NetAmount;
      currency = firstItem.TransactionCurrency;
      
      // Process schedule lines for ATP checking
      if (firstItem.to_ScheduleLine && firstItem.to_ScheduleLine.results) {
        scheduleLines = firstItem.to_ScheduleLine.results;
        console.log('Schedule lines received:', scheduleLines.length);
        
        // Check availability based on confirmed delivery dates
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare dates only
        
        for (const scheduleLine of scheduleLines) {
          if (scheduleLine.ConfdOrderQtyByMatlAvailCheck && scheduleLine.ConfdOrderQtyByMatlAvailCheck > 0) {
            const confirmedDeliveryDate = new Date(scheduleLine.ConfirmedDeliveryDate);
            confirmedDeliveryDate.setHours(0, 0, 0, 0);
            
            if (confirmedDeliveryDate > today) {
              isAvailable = false;
              availabilityMessage = `Available from ${confirmedDeliveryDate.toLocaleDateString()}`;
              console.log(`Product not available today. Available from: ${confirmedDeliveryDate.toLocaleDateString()}`);
              break;
            }
          }
        }
        
        if (isAvailable) {
          console.log('Product is available today based on ATP checking');
        }
      }
      
      console.log(`Extracted unit price: ${unitPrice} ${currency}`);
    }

    const functionEnd = performance.now();
    console.log(`Total function execution time: ${(functionEnd - functionStart).toFixed(2)}ms`);

    // Return secure response with pricing and availability information
    return new Response(JSON.stringify({
      success: true,
      data: sapData,
      pricing: {
        unitPrice,
        currency,
        quantity
      },
      availability: {
        isAvailable,
        scheduleLines,
        message: availabilityMessage
      }
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      },
      status: 200,
    });

  } catch (error) {
    console.error('SAP Pricing Simulation API error:', error);
    const functionEnd = performance.now();
    console.log(`Function failed after ${(functionEnd - functionStart).toFixed(2)}ms`);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message,
      status: 500
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
