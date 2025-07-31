
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// SAP Product endpoint
const SAP_API_URL = "https://newdemo.answerthinkdemo.com/sap/opu/odata/sap/API_PRODUCT_SRV";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Received request to get-sap-product');

  try {
    // First verify the JWT token
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', authHeader ? 'Yes' : 'No');
    
    if (!authHeader) {
      console.error('No authorization header present');
      return new Response(
        JSON.stringify({ error: 'No authorization header present' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Supabase URL available:', supabaseUrl ? 'Yes' : 'No');
    console.log('Supabase Key available:', supabaseKey ? 'Yes' : 'No');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials in environment');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    try {
      // Verify the user's JWT
      const { data, error } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      console.log('Auth verification result:', error ? 'Error' : 'Success');
      
      if (error || !data.user) {
        console.error('Invalid authorization token:', error);
        return new Response(
          JSON.stringify({ error: 'Invalid authorization token', details: error?.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      console.log('Authenticated user:', data.user.email);
    } catch (authError) {
      console.error('Error during auth verification:', authError);
      return new Response(
        JSON.stringify({ error: 'Error verifying authentication', details: authError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Process the request data
    let requestData;
    try {
      requestData = await req.json();
      console.log('Parsed request data:', JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      console.error('Error parsing request JSON:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request format', details: parseError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { productCode } = requestData;
    
    if (!productCode) {
      console.error('Missing product code in request');
      return new Response(
        JSON.stringify({ error: 'Product code is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Fetching SAP product data for product code: ${productCode}`);

    // Get the SAP credentials from the database
    let sapCredentials;
    try {
      const { data, error } = await supabaseClient
        .from('sap_credentials')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching SAP credentials:', error);
        throw new Error('Failed to retrieve SAP credentials');
      }
      
      sapCredentials = data;
      console.log('SAP credentials retrieved successfully');
    } catch (credError) {
      console.error('Error retrieving SAP credentials:', credError);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve SAP credentials', details: credError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const { sap_user, sap_password } = sapCredentials;

    // Build the URL for product data
    const productUrl = `${SAP_API_URL}/A_Product('${productCode}')?$format=json&sap-user=${sap_user}&sap-password=${sap_password}`;
    
    console.log(`Calling SAP API URL (credentials omitted for security): ${SAP_API_URL}/A_Product('${productCode}')?$format=json&sap-user=*****&sap-password=*****`);
    
    // Fetch product data
    let sapResponse;
    try {
      sapResponse = await fetch(productUrl);
      console.log('SAP API response status:', sapResponse.status);
    } catch (fetchError) {
      console.error('Network error calling SAP API:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to connect to SAP API', details: fetchError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }
    
    if (!sapResponse.ok) {
      const errorText = await sapResponse.text();
      console.error(`SAP API error (${sapResponse.status}):`, errorText);
      return new Response(
        JSON.stringify({ error: `SAP API returned error: ${sapResponse.status}`, details: errorText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: sapResponse.status }
      );
    }

    let productData;
    try {
      productData = await sapResponse.json();
      console.log('SAP product data received:', JSON.stringify(productData, null, 2));
    } catch (parseError) {
      console.error('Error parsing SAP response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid response from SAP API', details: parseError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }

    // Extract ItemCategoryGroup from the response
    const itemCategoryGroup = productData?.d?.ItemCategoryGroup;
    console.log('Extracted ItemCategoryGroup:', itemCategoryGroup);

    // Process the data and update the product in the database
    const productUpdateData = {
      sap_item_category_group: itemCategoryGroup || null,
      sap_status_date: new Date().toISOString()
    };

    console.log('Updating product in database with data:', JSON.stringify(productUpdateData, null, 2));

    // Update the product in the database
    try {
      const { error } = await supabaseClient
        .from('products')
        .update(productUpdateData)
        .eq('sap_product_code', productCode);

      if (error) {
        console.error('Error updating product data:', error);
        throw new Error('Failed to update product data in database');
      }
      
      console.log('Product data successfully updated in database');
    } catch (updateError) {
      console.error('Error during database update:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update product data in database', details: updateError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        productData: {
          ...productUpdateData,
          itemCategoryGroup
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unhandled error in get-sap-product function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
