// Follow Deno Deploy's ES modules support
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, createCorsResponse, createErrorResponse, createSuccessResponse } from './cors.ts';
import { SapQuoteDetailsClient } from './sap-client.ts';
import { QuoteDetailsRequest } from './types.ts';

// Main function to handle requests
serve(async (req: Request) => {
  const functionStart = performance.now();
  console.log("Edge function get-sap-quote-details called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return createCorsResponse();
  }

  try {
    // Extract the Authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error("No Authorization header found");
      return createErrorResponse("No Authorization header", 401);
    }

    console.log("Authorization header found:", authHeader ? "Yes" : "No");

    // Verify the request has a body
    let body;
    try {
      body = await req.json();
      console.log("Request body received:", JSON.stringify(body));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return createErrorResponse("Invalid request body", 400);
    }

    // Extract and validate parameters from the body
    const quoteNumber = body?.quoteNumber;
    const soldToId = body?.soldToId;
    const apiVersion = body?.apiVersion || 'S4';
    
    if (!quoteNumber) {
      console.error("No quoteNumber provided in request body");
      return createErrorResponse("quoteNumber is required", 400);
    }

    console.log(`Processing request for SAP Quote Number: ${quoteNumber}, Sold-To: ${soldToId}, API Version: ${apiVersion}`);

    const request: QuoteDetailsRequest = {
      quoteNumber,
      soldToId,
      apiVersion
    };

    try {
      // Create SAP client and fetch quote details
      const sapClient = new SapQuoteDetailsClient(authHeader);
      const sapData = await sapClient.fetchQuoteDetails(request);

      const functionEnd = performance.now();
      console.log(`Total function execution time: ${(functionEnd - functionStart).toFixed(2)}ms`);
      
      // Return the SAP API response
      return createSuccessResponse(sapData);

    } catch (error) {
      console.error("Error calling SAP API:", error);
      const functionEnd = performance.now();
      console.log(`Function failed after ${(functionEnd - functionStart).toFixed(2)}ms`);
      return createErrorResponse("Failed to call SAP API: " + error.message, 502);
    }

  } catch (error) {
    console.error(`Error in edge function: ${error.message}`);
    const functionEnd = performance.now();
    console.log(`Function failed after ${(functionEnd - functionStart).toFixed(2)}ms`);
    return createErrorResponse(error.message, 500);
  }
});