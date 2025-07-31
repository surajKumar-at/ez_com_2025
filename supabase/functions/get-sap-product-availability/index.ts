
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { mockProductData } from "./utils/mock-data.ts";
import { checkUserAuthorization } from "./services/auth-service.ts";
import { getSapAvailability } from "./services/sap-service.ts";

serve(async (req) => {
  // Handle CORS preflight requests - this is crucial for browser operations
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, {
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    console.log(`Request method: ${req.method}, URL: ${req.url}`);
    
    // Log request headers (but omit authorization for security)
    const headers = Object.fromEntries(req.headers.entries());
    const safeHeaders = { ...headers };
    if (safeHeaders.authorization) safeHeaders.authorization = 'REDACTED';
    console.log('Request headers:', JSON.stringify(safeHeaders));
    
    // Parse request body
    const reqData = await req.json();
    console.log('Request payload:', JSON.stringify(reqData));
    
    const { productCode } = reqData;
    
    if (!productCode) {
      console.error('Missing product code in request');
      return new Response(
        JSON.stringify({ error: "Product code is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Checking availability for product code: ${productCode}`);
    
    // Ensure the product code is properly formatted for lookup
    const normalizedProductCode = productCode.trim();
    console.log(`Normalized product code: ${normalizedProductCode}`);

    // First get mock data since it's faster - try to match the exact format or use default
    const mockData = mockProductData[normalizedProductCode] || 
                     mockProductData.default;
    
    // For non-admin users or when using mock data is enabled, return mock data
    const useMockData = Deno.env.get("USE_MOCK_SAP_DATA") === "true";
    
    if (useMockData) {
      console.log("Using mock data for product code:", normalizedProductCode);
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add availableFrom and baseUnit to mock data for consistency
      const enhancedMockData = {
        ...mockData,
        productCode: normalizedProductCode,
        availableFrom: new Date().toLocaleDateString('en-US', {
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric'
        }),
        baseUnit: 'EA'
      };
      
      console.log("Returning mock data:", JSON.stringify(enhancedMockData).substring(0, 200));
      
      return new Response(
        JSON.stringify(enhancedMockData),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Try to get real SAP availability data
    try {
      console.log(`Calling getSapAvailability with product code: ${normalizedProductCode}`);
      const result = await getSapAvailability(normalizedProductCode);
      
      const responseData = {
        ...result,
        productCode: normalizedProductCode, // Include the product code in the response
      };
      
      console.log(`Successfully retrieved SAP availability data. Returning response with status 200.`);
      console.log(`Response data:`, JSON.stringify(responseData).substring(0, 200) + '...');
      
      return new Response(
        JSON.stringify(responseData),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error fetching SAP availability:", error);
      
      // Fall back to mock data on error
      console.log("Falling back to mock data after API error");
      
      // Add availableFrom and baseUnit to mock data for consistency
      const enhancedMockData = {
        ...mockData,
        productCode: normalizedProductCode,
        availableFrom: new Date().toLocaleDateString('en-US', {
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric'
        }),
        baseUnit: 'EA',
        note: "Using fallback data due to SAP API error",
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      };
      
      console.log("Returning fallback mock data:", JSON.stringify(enhancedMockData).substring(0, 200));
      
      return new Response(
        JSON.stringify(enhancedMockData),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Return 200 with fallback data instead of error
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    
    // Return a fallback response with mock data instead of an error
    const fallbackResponse = {
      availableQuantity: 25, 
      availableFrom: new Date().toLocaleDateString('en-US', {
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric'
      }),
      baseUnit: 'EA',
      success: true,
      note: "Using fallback data due to an error",
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    };
    
    console.log("Returning fallback response due to unexpected error:", 
                JSON.stringify(fallbackResponse).substring(0, 200));
    
    return new Response(
      JSON.stringify(fallbackResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
