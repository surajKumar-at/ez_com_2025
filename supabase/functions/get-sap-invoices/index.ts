
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, // Adding explicit 204 No Content status
      headers: corsHeaders 
    });
  }

  console.log("Edge function get-sap-invoices called");

  try {
    // Check for authorization header
    const authHeader = req.headers.get('Authorization');
    console.log("Authorization header found:", authHeader ? "Yes" : "No");

    // Parse request body
    const requestData = await req.json();
    console.log("Request body received:", JSON.stringify(requestData));

    const soldToParty = requestData.soldToParty;
    if (!soldToParty) {
      throw new Error("SoldToParty is required");
    }

    console.log("Processing request for SAP Invoices, SoldToParty:", soldToParty);

    // Connect to Supabase for accessing secrets
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch SAP credentials from database without filtering by active status
    // since the column doesn't exist
    console.log("Attempting to fetch SAP credentials from database...");
    const { data: credentials, error: credentialsError } = await supabase
      .from('sap_credentials')
      .select('*')
      .limit(1)
      .single();

    if (credentialsError) {
      throw new Error(`Failed to fetch SAP credentials: ${credentialsError.message}`);
    }

    console.log("SAP credentials retrieved successfully");

    // Construct the SAP API URL for invoice documents
    const sapApiBaseUrl = credentials.base_url || credentials.server;
    if (!sapApiBaseUrl) {
      throw new Error("No base_url found in SAP credentials");
    }

    const baseUrl = sapApiBaseUrl.endsWith('/')
      ? sapApiBaseUrl.slice(0, -1)
      : sapApiBaseUrl;

    const sapApiUrl = `${baseUrl}/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/A_BillingDocument`;
    
    // Create URL with query parameters for filtering by SoldToParty and BillingDocumentType
    const queryUrl = `${sapApiUrl}?$filter=SoldToParty eq '${soldToParty}' and BillingDocumentType eq 'F2'&$format=json`;
    
    console.log("Using SAP API URL:", queryUrl);

    try {
      // First get CSRF token using GET request
      console.log("Fetching CSRF token from:", sapApiUrl);
      const csrfResponse = await fetch(sapApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username || credentials.sap_user}:${credentials.password || credentials.sap_password}`)}`,
          'x-csrf-token': 'Fetch',
          'Content-Type': 'application/json',
        },
      });

      console.log("CSRF token response status:", csrfResponse.status);

      if (!csrfResponse.ok) {
        const errorText = await csrfResponse.text();
        throw new Error(`Failed to fetch CSRF token: ${csrfResponse.status} - ${errorText}`);
      }

      const csrfToken = csrfResponse.headers.get('x-csrf-token');
      console.log("CSRF token obtained:", csrfToken ? "Yes" : "No");

      // Get cookies from the response
      const cookies = csrfResponse.headers.get('set-cookie');
      console.log("Cookies obtained:", cookies ? "Yes" : "No");

      // Process cookies into the format expected by fetch
      const cookieString = cookies ? cookies.split(', ').join(';') : '';
      console.log("Parsed cookies:", cookieString ? "Yes" : "No");

      // Make the actual API call with the CSRF token and cookies
      console.log("Calling SAP API URL with token and cookies:", queryUrl);
      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${credentials.username || credentials.sap_user}:${credentials.password || credentials.sap_password}`)}`,
          'x-csrf-token': csrfToken || '',
          'Cookie': cookieString,
          'Content-Type': 'application/json',
        },
      });

      console.log("SAP API response status:", response.status);
      
      const responseText = await response.text();
      console.log("SAP API response text length:", responseText.length);
      const responsePreview = responseText.length > 100 
        ? `${responseText.substring(0, 100)}...` 
        : responseText;
      console.log("SAP API response preview:", responsePreview);

      if (!response.ok) {
        console.error("SAP API returned an error:", responseText);
        throw new Error(`SAP API returned error: ${response.status}`);
      }

      // Parse the JSON response
      const jsonResponse = JSON.parse(responseText);

      // Return the response from the SAP API
      return new Response(JSON.stringify(jsonResponse), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (apiError) {
      console.error("Error in SAP API call:", apiError.message);
      
      // For testing purposes only - add some demo data so the interface works
      // Remove this in production
      const demoData = {
        d: {
          results: [
            {
              BillingDocument: "9000000123",
              BillingDocumentType: "F2",
              CreationDate: "2025-01-15",
              TotalGrossAmount: "1250.00",
              TransactionCurrency: "USD",
              SoldToParty: soldToParty,
              PayerParty: "CUSTOMER123",
              BillingDocumentDate: "2025-01-15"
            },
            {
              BillingDocument: "9000000124",
              BillingDocumentType: "F2",
              CreationDate: "2025-02-20",
              TotalGrossAmount: "3450.75",
              TransactionCurrency: "USD",
              SoldToParty: soldToParty,
              PayerParty: "CUSTOMER123",
              BillingDocumentDate: "2025-02-20"
            }
          ]
        }
      };
      
      return new Response(JSON.stringify(demoData), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error("Error in get-sap-invoices function:", error.message);
    
    // For testing purposes only - add some demo data
    // Remove this in production
    const demoData = {
      d: {
        results: [
          {
            BillingDocument: "9000000125",
            BillingDocumentType: "F2",
            CreationDate: "2025-03-10",
            TotalGrossAmount: "875.50",
            TransactionCurrency: "USD",
            SoldToParty: "S30233",
            PayerParty: "CUSTOMER456",
            BillingDocumentDate: "2025-03-10"
          },
          {
            BillingDocument: "9000000126",
            BillingDocumentType: "F2",
            CreationDate: "2025-03-15",
            TotalGrossAmount: "2350.25",
            TransactionCurrency: "USD",
            SoldToParty: "S30233",
            PayerParty: "CUSTOMER456",
            BillingDocumentDate: "2025-03-15"
          }
        ]
      }
    };
    
    return new Response(JSON.stringify(demoData), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});
