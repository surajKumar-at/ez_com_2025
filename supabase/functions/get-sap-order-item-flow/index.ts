
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./_shared/cors.ts";
import { validateAuth } from "./services/authService.ts";
import { fetchSapCredentials, callSapApi } from "./services/sapApiService.ts";
import { handleError } from "./services/errorHandler.ts";

serve(async (req: Request) => {
  console.log("Edge function get-sap-order-item-flow called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Extract the Authorization header and validate
    const authHeader = req.headers.get('Authorization');
    const supabaseClient = await validateAuth(authHeader);
    
    // Parse request body
    const body = await req.json().catch((error) => {
      console.error("Error parsing request body:", error);
      throw new Error("Invalid request body");
    });
    
    // Extract and validate parameters
    const { salesOrderId, salesOrderItem } = body;
    if (!salesOrderId || !salesOrderItem) {
      console.error("Missing required parameters in request body");
      throw new Error("salesOrderId and salesOrderItem are required");
    }
    
    console.log(`Processing request for SAP order ${salesOrderId}, item ${salesOrderItem} document flow`);
    
    // Get SAP credentials
    const credentials = await fetchSapCredentials(supabaseClient);
    
    // Call SAP API (no CSRF token needed for GET requests)
    const sapResponse = await callSapApi(credentials, salesOrderId, salesOrderItem);
    
    // Handle SAP API response
    if (!sapResponse.ok) {
      const responseText = await sapResponse.text();
      console.error("SAP API returned an error:", responseText);
      return new Response(JSON.stringify({ 
        error: "Error from SAP API", 
        details: responseText,
        status: sapResponse.status,
        statusText: sapResponse.statusText
      }), {
        status: 200, // Return 200 with error details to prevent CORS issues
        headers: corsHeaders,
      });
    }
    
    // Parse and return the successful response
    const responseText = await sapResponse.text();
    console.log("SAP API response text length:", responseText.length);
    console.log("SAP API response preview:", responseText.substring(0, 200) + "...");
    
    // Enhanced logging for detailed analysis
    const sapData = JSON.parse(responseText);
    
    console.log("=== FULL SAP DOCUMENT FLOW RESPONSE START ===");
    console.log("Full response structure:", JSON.stringify(sapData, null, 2));
    console.log("=== FULL SAP DOCUMENT FLOW RESPONSE END ===");
    
    // Log specific details about the results
    if (sapData.d && sapData.d.results) {
      console.log(`Number of document flow items found: ${sapData.d.results.length}`);
      
      sapData.d.results.forEach((item, index) => {
        console.log(`=== Document Flow Item ${index + 1} ===`);
        console.log("SubsequentDocumentCategory:", item.SubsequentDocumentCategory);
        console.log("SubsequentDocument:", item.SubsequentDocument);
        console.log("SubsequentDocumentItem:", item.SubsequentDocumentItem);
        console.log("Full item data:", JSON.stringify(item, null, 2));
        console.log(`=== End Document Flow Item ${index + 1} ===`);
      });
      
      // Filter for delivery documents (category 'J')
      const deliveryDocs = sapData.d.results.filter(item => item.SubsequentDocumentCategory === 'J');
      console.log(`Found ${deliveryDocs.length} delivery documents (category 'J'):`);
      deliveryDocs.forEach((doc, index) => {
        console.log(`Delivery ${index + 1}: Document=${doc.SubsequentDocument}, Item=${doc.SubsequentDocumentItem}`);
      });
      
      // Filter for invoice documents (category 'M')
      const invoiceDocs = sapData.d.results.filter(item => item.SubsequentDocumentCategory === 'M');
      console.log(`Found ${invoiceDocs.length} invoice documents (category 'M'):`);
      invoiceDocs.forEach((doc, index) => {
        console.log(`Invoice ${index + 1}: Document=${doc.SubsequentDocument}, Item=${doc.SubsequentDocumentItem}`);
      });
      
      // Log all unique document categories found
      const uniqueCategories = [...new Set(sapData.d.results.map(item => item.SubsequentDocumentCategory))];
      console.log("All document categories found:", uniqueCategories);
    }
    
    return new Response(JSON.stringify(sapData), {
      headers: corsHeaders,
      status: 200,
    });
    
  } catch (error) {
    return handleError(error);
  }
});
