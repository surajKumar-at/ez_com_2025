
// Follow Deno Deploy's ES modules support
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./utils/cors.ts";

// Main function to handle requests
serve(async (req: Request) => {
  console.log("Edge function get-sap-document-print called");

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

    // Extract the parameters from the body
    const documentType = body?.documentType; // V2=Delivery, V3=Invoice, C=Credit Memo, O=Order
    const documentNumber = body?.documentNumber;
    const customerNumber = body?.customerNumber;
    
    // Validate required parameters
    if (!documentType) {
      console.error("Missing documentType in request body");
      return new Response(JSON.stringify({ error: "documentType is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!documentNumber) {
      console.error("Missing documentNumber in request body");
      return new Response(JSON.stringify({ error: "documentNumber is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!customerNumber) {
      console.error("Missing customerNumber in request body");
      return new Response(JSON.stringify({ error: "customerNumber is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing request for SAP Document: Type ${documentType}, Number ${documentNumber}, Customer ${customerNumber}`);

    try {
      // Fetch SAP credentials from the database
      console.log("Attempting to fetch SAP credentials from database...");
      
      const { data: credentialsData, error: credentialsError } = await supabaseClient
        .from('sap_credentials')
        .select('sap_user, sap_password, server, api_path')
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
      const server = credentialsData.server;
      
      // Pad document number and customer number with leading zeros as SAP expects
      // Document number usually needs 10 digits, customer number usually 10 digits
      const paddedDocumentNumber = documentNumber.padStart(10, '0');
      const paddedCustomerNumber = customerNumber.padStart(10, '0');
      
      // Build the URL based on document type
      // Determine API path based on document type
      // For example:
      // /ZWEBAPP/DISPLAY_OUTPUT - a common SAP function for retrieving documents
      const apiPath = '/sap/opu/odata/sap/ZWEBPDFDOCUMENTS_SRV/DocumentPDFSet';
      
      // Construct the SAP API URL from the server and API path
      const sapApiUrl = `${server}${apiPath}`;
      console.log("Using SAP API URL:", sapApiUrl);
      
      // Construct query parameters for the SAP API
      // This may vary based on the actual SAP API requirements
      const queryParams = new URLSearchParams({
        'sap-user': sapUsername,
        'sap-password': sapPassword,
        '$format': 'json',
        'DocNumber': paddedDocumentNumber,
        'DocType': documentType,
        'BpNumber': paddedCustomerNumber,
      });
      
      const url = `${sapApiUrl}?${queryParams.toString()}`;
      console.log("Calling SAP API URL (credentials omitted for security)");
      
      // Make the request to the SAP API
      const sapResponse = await fetch(url);
      
      // Log the status code from SAP
      console.log("SAP API response status:", sapResponse.status);
      
      // Check if the response was successful
      if (!sapResponse.ok) {
        const errorText = await sapResponse.text();
        console.error("SAP API returned an error:", errorText);
        return new Response(JSON.stringify({ 
          error: "Error from SAP API", 
          details: errorText,
          status: sapResponse.status
        }), {
          status: 502, // Bad Gateway
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Parse the response
      let sapData;
      try {
        sapData = await sapResponse.json();
        console.log("SAP API response received");
      } catch (error) {
        console.error("Error parsing SAP API response:", error);
        const responseText = await sapResponse.text();
        console.log("SAP API response text (partial):", responseText.substring(0, 1000));
        throw new Error("Invalid response from SAP API");
      }
      
      // Extract the document data from the SAP response
      // The exact structure depends on how your SAP API returns the document
      let base64Data = '';
      
      if (sapData && sapData.d && sapData.d.results && sapData.d.results.length > 0) {
        base64Data = sapData.d.results[0].Base64Data || '';
      } else if (sapData && sapData.d && sapData.d.Base64Data) {
        base64Data = sapData.d.Base64Data;
      } else {
        console.error("Document data not found in SAP response:", JSON.stringify(sapData).substring(0, 500));
        return new Response(JSON.stringify({ 
          error: "Document data not found in SAP response"
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (!base64Data) {
        console.error("Empty base64 data in SAP response");
        return new Response(JSON.stringify({ 
          error: "SAP returned empty document data" 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log("Successfully extracted document base64 data, length:", base64Data.length);
      
      // Return the document data
      return new Response(JSON.stringify({
        base64Data: base64Data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error("Error calling SAP API:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to retrieve document from SAP", 
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
