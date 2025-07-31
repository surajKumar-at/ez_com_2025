
// Follow Deno Deploy's ES modules support
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, handleCorsPreflightRequest, createErrorResponse, createSuccessResponse } from "./corsUtils.ts";
import { validateAuthHeader, createSupabaseClient, fetchSapCredentials } from "./authUtils.ts";
import { validateSapCredentials, constructSapApiUrl, fetchCsrfToken, parseCookies, buildSapRequestHeaders } from "./sapApiUtils.ts";
import { processSapResponse } from "./responseProcessor.ts";

// Main function to handle requests
serve(async (req: Request) => {
  const functionStart = performance.now();
  console.log("Edge function get-sap-order-details called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    // Extract and validate the Authorization header
    const authHeader = req.headers.get('Authorization');
    const authError = validateAuthHeader(authHeader);
    if (authError) {
      return createErrorResponse(authError, 401);
    }

    console.log("Authorization header found:", authHeader ? "Yes" : "No");
    
    // Create an authenticated Supabase client
    const supabaseClient = createSupabaseClient(authHeader!);

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
      console.log("Request body received:", JSON.stringify(body));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return createErrorResponse("Invalid request body", 400);
    }

    // Extract and validate salesOrderId
    const salesOrderId = body?.salesOrderId;
    if (!salesOrderId) {
      console.error("No salesOrderId provided in request body");
      return createErrorResponse("salesOrderId is required", 400);
    }

    console.log(`Processing request for SAP Sales Order ID: ${salesOrderId}`);

    try {
      // Fetch SAP credentials from the database
      const credentialsStart = performance.now();
      const credentialsData = await fetchSapCredentials(supabaseClient);
      const credentialsEnd = performance.now();
      console.log(`SAP credentials fetch took ${(credentialsEnd - credentialsStart).toFixed(2)}ms`);
      
      // Validate SAP credentials
      const credentialsError = validateSapCredentials(credentialsData);
      if (credentialsError) {
        return createErrorResponse(credentialsError, 500);
      }

      // Extract credentials and connection details
      const { sap_user: sapUsername, sap_password: sapPassword, server } = credentialsData;
      
      // Construct the SAP API URL with both partner and text expansion
      const sapApiUrl = constructSapApiUrl(server, salesOrderId);
      console.log("Using SAP API URL:", sapApiUrl);
      
      // Get CSRF token and cookies
      const { csrfToken, cookiesHeader } = await fetchCsrfToken(server, sapUsername, sapPassword);
      const cookieHeader = parseCookies(cookiesHeader);
      
      // Build final URL and headers
      const finalUrl = `${sapApiUrl}&$format=json`;
      console.log("Calling SAP API URL (credentials omitted for security):", 
        finalUrl.replace(/sap-password=([^&]*)/, 'sap-password=*****'));

      const headers = buildSapRequestHeaders(sapUsername, sapPassword, csrfToken, cookieHeader);
      
      // Make the request to the SAP API with timing
      const sapCallStart = performance.now();
      const sapResponse = await fetch(finalUrl, { headers });
      const sapCallEnd = performance.now();
      console.log(`SAP order details API call took ${(sapCallEnd - sapCallStart).toFixed(2)}ms`);

      // Process the SAP response
      const parseStart = performance.now();
      const sapData = await processSapResponse(sapResponse);
      const parseEnd = performance.now();
      console.log(`SAP response processing took ${(parseEnd - parseStart).toFixed(2)}ms`);

      const functionEnd = performance.now();
      console.log(`Total function execution time: ${(functionEnd - functionStart).toFixed(2)}ms`);

      // Return the SAP API response
      return createSuccessResponse(sapData);

    } catch (error) {
      console.error("Error calling SAP API:", error);
      const functionEnd = performance.now();
      console.log(`Function failed after ${(functionEnd - functionStart).toFixed(2)}ms`);
      return createErrorResponse(`Failed to call SAP API: ${error.message}`, 502);
    }

  } catch (error) {
    console.error(`Error in edge function: ${error.message}`);
    const functionEnd = performance.now();
    console.log(`Function failed after ${(functionEnd - functionStart).toFixed(2)}ms`);
    return createErrorResponse(error.message, 500);
  }
});
