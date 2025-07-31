
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders, createCorsResponse, createErrorResponse, createSuccessResponse } from './cors.ts';

serve(async (req: Request) => {
  console.log("Edge function get-sap-quote-partner-address called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return createCorsResponse();
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No Authorization header found");
      return createErrorResponse("No Authorization header", 401);
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    let body;
    try {
      body = await req.json();
      console.log("Request body:", JSON.stringify(body));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return createErrorResponse("Invalid request body", 400);
    }

    const { quoteNumber, partnerFunction } = body;

    if (!quoteNumber || !partnerFunction) {
      console.error("Missing required parameters");
      return createErrorResponse("quoteNumber and partnerFunction are required", 400);
    }

    console.log(`Fetching quote partner address for quote: ${quoteNumber}, function: ${partnerFunction}`);

    // Fetch SAP credentials
    const { data: credentialsData, error: credentialsError } = await supabaseClient
      .from('sap_credentials')
      .select('sap_user, sap_password, server')
      .eq('sap_system_type', 'S4')
      .limit(1)
      .single();

    if (credentialsError || !credentialsData) {
      console.error("Error fetching SAP credentials:", credentialsError);
      return createErrorResponse("Failed to retrieve SAP credentials", 500);
    }

    const { sap_user: sapUsername, sap_password: sapPassword, server } = credentialsData;

    if (!sapUsername || !sapPassword || !server) {
      console.error("Incomplete SAP credentials");
      return createErrorResponse("SAP credentials are incomplete", 500);
    }

    // Build the SAP API URL for quote partner (using the correct entity)
    // First get the partner information from A_SalesQuotationPartner
    const sapUrl = `${server}/sap/opu/odata/sap/API_SALES_QUOTATION_SRV/A_SalesQuotationPartner?$filter=SalesQuotation eq '${quoteNumber}' and PartnerFunction eq '${partnerFunction}'&$format=json`;

    console.log("Calling SAP API for quote partner:", sapUrl);

    const sapResponse = await fetch(sapUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${sapUsername}:${sapPassword}`),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!sapResponse.ok) {
      const errorText = await sapResponse.text();
      console.error("SAP API error:", errorText);
      return createErrorResponse(`Error from SAP API: ${sapResponse.statusText}`, 502);
    }

    const sapData = await sapResponse.json();
    console.log("SAP quote partner response:", JSON.stringify(sapData, null, 2));

    // Check if we have partner data
    if (!sapData?.d?.results || sapData.d.results.length === 0) {
      console.log("No partner data found for quote:", quoteNumber, "function:", partnerFunction);
      return createSuccessResponse({ d: { results: [] } });
    }

    const partnerData = sapData.d.results[0];
    console.log(`Found partner: ${partnerData.Customer || partnerData.Supplier || 'Unknown'}`);

    // The partner data from A_SalesQuotationPartner contains the Customer/Supplier ID
    // but not the full address details. We need to structure the response to include
    // the partner info so the service can fetch address details using the Business Partner API
    const responseData = {
      d: {
        results: [{
          SalesQuotation: partnerData.SalesQuotation,
          PartnerFunction: partnerData.PartnerFunction,
          Customer: partnerData.Customer,
          Supplier: partnerData.Supplier,
          // These fields will be empty from this API, but the service will fetch them
          // from the Business Partner API as a fallback
          AddresseeFullName: null,
          OrganizationName1: null,
          CityName: null,
          StreetName: null,
          HouseNumber: null,
          PostalCode: null,
          Region: null,
          Country: null,
          PhoneNumber: null,
          EmailAddress: null
        }]
      }
    };

    return createSuccessResponse(responseData);

  } catch (error) {
    console.error(`Error in quote partner address function: ${error.message}`);
    return createErrorResponse(`Failed to call SAP API: ${error.message}`, 502);
  }
});
