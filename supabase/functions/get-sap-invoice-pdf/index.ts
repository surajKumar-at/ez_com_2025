// Follow Deno Deploy's ES modules support
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

// Main function to handle requests
serve(async (req: Request) => {
  console.log("Edge function get-sap-invoice-pdf called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
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

    console.log("Authorization header found:", authHeader ? "Yes" : "No");
    
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

    // Verify the request has a body
    let body;
    try {
      body = await req.json();
      console.log("Request body received:", JSON.stringify(body));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract the Invoice ID from the body - check for both invoiceId and billingDocument
    const invoiceId = body?.invoiceId || body?.billingDocument;
    if (!invoiceId) {
      console.error("No invoiceId or billingDocument provided in request body");
      return new Response(JSON.stringify({ error: "invoiceId or billingDocument is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing request for SAP Invoice PDF ID: ${invoiceId}`);

    try {
      // Fetch SAP credentials from the database
      console.log("Attempting to fetch SAP credentials from database...");
      
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!credentialsData) {
        console.error("No SAP credentials found in the database");
        return new Response(JSON.stringify({ error: "SAP credentials not found" }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log("SAP credentials retrieved successfully");
      
      // Extract credentials and connection details
      const sapUsername = credentialsData.sap_user;
      const sapPassword = credentialsData.sap_password;
      const baseUrl = credentialsData.server;
      
      // Construct the API path for the specific invoice PDF
      // THIS MUST BE A GET REQUEST - not a POST - to the GetPDF endpoint
      const formattedInvoiceId = `'${invoiceId}'`;
      const apiPath = `/sap/opu/odata/SAP/API_BILLING_DOCUMENT_SRV/GetPDF`;
      const queryParams = new URLSearchParams({
        'BillingDocument': formattedInvoiceId,
        '$format': 'json'
      });

      // Construct the SAP API URL from the server and API path
      const sapApiUrl = `${baseUrl}${apiPath}?${queryParams.toString()}`;
      console.log("Using SAP API URL:", sapApiUrl);
      
      // Set up Basic Auth
      const basicAuth = `Basic ${btoa(`${sapUsername}:${sapPassword}`)}`;
      
      // Make the request to the SAP API explicitly using GET method
      console.log("Sending GET request to SAP API");
      const response = await fetch(sapApiUrl, {
        method: 'GET',  // This MUST be GET for S4 PDF API - using POST will result in 404
        headers: {
          'Authorization': basicAuth,
          'Accept': 'application/json'
        }
      });

      // Log the status code from SAP
      console.log("SAP API response status:", response.status);
      
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = "Could not read error response text";
        }
        console.error("Error from SAP API:", errorText);
        return new Response(JSON.stringify({ 
          error: "Error from SAP API", 
          details: errorText,
          status: response.status
        }), {
          status: 502, // Bad Gateway
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Get the full response text for debugging
      const responseText = await response.text();
      console.log("SAP API response text sample (first 100 chars):", responseText.substring(0, 100));
      
      // Parse the response as JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log("Response structure keys:", Object.keys(responseData));
        if (responseData.d) {
          console.log("d structure keys:", Object.keys(responseData.d));
        }
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        return new Response(JSON.stringify({ 
          error: "Failed to parse SAP response", 
          details: error.message,
          responsePreview: responseText.substring(0, 100)
        }), {
          status: 502, // Bad Gateway
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Handle exact structure from sample JSON provided
      let pdfBase64 = null;
      
      // Extract PDF from the nested structure based on your sample
      if (responseData?.d?.GetPDF?.BillingDocumentBinary) {
        pdfBase64 = responseData.d.GetPDF.BillingDocumentBinary;
        console.log("PDF binary data found in d.GetPDF.BillingDocumentBinary, length:", pdfBase64.length);
      }
      // Fallback to simpler structure
      else if (responseData?.d?.BillingDocumentBinary) {
        pdfBase64 = responseData.d.BillingDocumentBinary;
        console.log("PDF binary data found in d.BillingDocumentBinary, length:", pdfBase64.length);
      }
      
      if (pdfBase64) {
        return new Response(JSON.stringify({ 
          base64Data: pdfBase64
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } else {
        console.error("PDF binary data not found in response");
        console.log("Response structure:", JSON.stringify(responseData));
        return new Response(JSON.stringify({ 
          error: "PDF data not found in SAP response",
          responseStructure: JSON.stringify(responseData, null, 2)
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      console.error("Error calling SAP API:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to retrieve PDF from SAP", 
        message: error.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502, // Bad Gateway
      });
    }
  } catch (error) {
    console.error(`Error in edge function: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
