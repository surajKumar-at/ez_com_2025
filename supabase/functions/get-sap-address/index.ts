
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the Authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error("No Authorization header found");
      return new Response(JSON.stringify({ error: "No Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Create an authenticated Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { sapAddressNumber, soldToCode } = await req.json();
    
    if (!soldToCode) {
      return new Response(
        JSON.stringify({ error: "Sold-to code is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Log the payload for debugging support
    console.log(`SAP Address API Payload - soldToCode: ${soldToCode}, addressID: ${sapAddressNumber || 'default'}`);

    // Fetch SAP credentials from the database
    console.log("Fetching SAP credentials from database...");
    
    const { data: credentialsData, error: credentialsError } = await supabaseClient
      .from('sap_credentials')
      .select('sap_user, sap_password, server')
      .limit(1)
      .single();

    if (credentialsError) {
      console.error("Error fetching SAP credentials:", credentialsError);
      return new Response(JSON.stringify({ 
        error: "Failed to retrieve SAP credentials", 
        details: credentialsError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!credentialsData) {
      console.error("No SAP credentials found in the database");
      return new Response(JSON.stringify({ error: "SAP credentials not found" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("SAP credentials retrieved successfully");
    
    // Extract credentials and connection details
    const sapUsername = credentialsData.sap_user;
    const sapPassword = credentialsData.sap_password;
    const server = credentialsData.server;

    if (!sapUsername || !sapPassword || !server) {
      console.error("SAP credentials or server incomplete");
      return new Response(JSON.stringify({ error: "SAP credentials are incomplete" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build the SAP API URL - Fix the URL construction
    const sapApiUrl = `${server}/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_BusinessPartner('${soldToCode}')/to_BusinessPartnerAddress?$format=json`;
    
    // Log the URL (without credentials for security)
    console.log(`SAP API URL: ${sapApiUrl} (credentials omitted for logging)`);
    
    // Create Base64 encoded credentials for Basic Auth
    const credentials = btoa(`${sapUsername}:${sapPassword}`);
    
    // Call the SAP API
    const response = await fetch(sapApiUrl, {
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
          error: `SAP API error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }

    const data = await response.json();
    console.log(`SAP API response received. Address count: ${data.d?.results?.length || 0}`);
    
    // Get addresses from the response
    const addresses = data.d?.results || [];
    
    if (addresses.length === 0) {
      return new Response(
        JSON.stringify({ error: `No addresses found for sold-to code ${soldToCode}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    let matchedAddress;
    
    // If sapAddressNumber is provided, find that specific address
    if (sapAddressNumber) {
      matchedAddress = addresses.find((addr) => addr.AddressID === sapAddressNumber);
      
      if (!matchedAddress) {
        return new Response(
          JSON.stringify({ error: `Address with ID ${sapAddressNumber} not found` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }
    } else {
      // If no specific address ID is provided, use the first address
      matchedAddress = addresses[0];
      console.log(`No specific address requested. Using first address with ID: ${matchedAddress.AddressID}`);
    }

    // Format the address according to our needs
    const formattedAddress = {
      AddressID: matchedAddress.AddressID,
      BusinessPartnerName1: matchedAddress.BusinessPartnerName1,
      FullName: matchedAddress.FullName,
      StreetName: matchedAddress.StreetName,
      HouseNumber: matchedAddress.HouseNumber,
      CityName: matchedAddress.CityName,
      Region: matchedAddress.Region,
      PostalCode: matchedAddress.PostalCode,
      CountryCode: matchedAddress.Country,
      Building: matchedAddress.Building,
      Floor: matchedAddress.Floor
    };

    console.log(`Returning formatted address: AddressID=${formattedAddress.AddressID}`);

    return new Response(
      JSON.stringify(formattedAddress),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-sap-address function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
