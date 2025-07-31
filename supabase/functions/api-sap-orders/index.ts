
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { ApiResponse } from "../_shared/types.ts";
import { verifyUserSoldToAccess } from "../_shared/userSoldToVerification.ts";

// Set up CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key, x-environment, x-syskey, x-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
};

/**
 * Handle API requests for SAP Orders
 */
serve(async (req: Request) => {
  console.log("API Edge function api-sap-orders called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Extract authentication information
    const authHeader = req.headers.get('Authorization');
    const apiKeyHeader = req.headers.get('x-api-key');
    
    console.log("Auth header present:", !!authHeader);
    console.log("API key header present:", !!apiKeyHeader);
    
    // Validate either an API key or JWT token is provided
    if (!authHeader && !apiKeyHeader) {
      console.log("No authentication provided, returning 401");
      return new Response(JSON.stringify({
        success: false,
        error: {
          message: "Authentication required",
          code: "auth_required"
        }
      } as ApiResponse<any>), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    console.log("Supabase URL:", supabaseUrl);
    console.log("Service key available:", !!supabaseServiceKey);
    console.log("Anon key available:", !!supabaseAnonKey);

    // Create an authenticated Supabase client for user requests
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );

    // If using API key, validate it
    let hasValidPermissions = false;
    let verificationResult = null;
    
    if (apiKeyHeader && !authHeader) {
      console.log("Processing API key authentication...");
      
      // Parse the request URL to get soldToId for verification
      const url = new URL(req.url);
      const soldToId = url.searchParams.get('soldToId');
      
      if (!soldToId) {
        console.error("Missing soldToId parameter for API key access");
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: "soldToId is required when using API key authentication",
            code: "missing_parameter"
          }
        } as ApiResponse<any>), {
          status: 400,
          headers: corsHeaders,
        });
      }
      
      // Verify that the API key has permission to access this soldToId
      verificationResult = await verifyUserSoldToAccess(
        apiKeyHeader,
        soldToId,
        supabaseUrl,
        supabaseServiceKey
      );
      
      if (!verificationResult.verified) {
        console.error("API key verification failed:", verificationResult.error);
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: verificationResult.error,
            code: "verification_failed"
          }
        } as ApiResponse<any>), {
          status: verificationResult.status || 401,
          headers: corsHeaders,
        });
      }
      
      console.log("API key verification successful");
      hasValidPermissions = true;
    }

    // Only proceed if authentication is valid
    if (!authHeader && !hasValidPermissions) {
      console.log("Authentication failed, returning 401");
      return new Response(JSON.stringify({
        success: false,
        error: {
          message: "Authentication failed",
          code: "auth_failed"
        }
      } as ApiResponse<any>), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // Parse the request URL and query parameters
    const url = new URL(req.url);
    const apiVersion = url.searchParams.get('version') || 'v1';
    const preferredSapApi = (url.searchParams.get('sapApi') || 'S4') as 'S4' | 'ECC';
    
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET': {
        // Extract query parameters
        const soldToId = url.searchParams.get('soldToId');
        const orderNumber = url.searchParams.get('orderNumber');
        const skip = parseInt(url.searchParams.get('skip') || '0', 10);
        const top = parseInt(url.searchParams.get('top') || '50', 10);
        const status = url.searchParams.get('status') || 'ALL';
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');
        
        if (!soldToId && !orderNumber) {
          return new Response(JSON.stringify({
            success: false,
            error: {
              message: "Either soldToId or orderNumber is required",
              code: "missing_parameter"
            }
          } as ApiResponse<any>), {
            status: 400,
            headers: corsHeaders,
          });
        }
        
        // If orderNumber is provided, fetch single order details
        if (orderNumber) {
          return await handleGetOrderDetails(supabaseClient, orderNumber, soldToId, preferredSapApi, corsHeaders);
        }
        
        // Otherwise, fetch order list
        // Create payload for the get-sap-orders edge function
        const payload = {
          sapSoldToId: soldToId,
          skip,
          top,
          statusFilter: status !== 'ALL' ? status : undefined,
          dateFilter: (startDate || endDate) ? {
            startDate: startDate ? new Date(startDate).toISOString() : undefined,
            endDate: endDate ? new Date(endDate).toISOString() : undefined
          } : undefined
        };
        
        // Call the existing edge function
        const { data, error } = await supabaseClient.functions.invoke('get-sap-orders', {
          body: payload,
        });
        
        if (error) {
          return new Response(JSON.stringify({
            success: false,
            error: {
              message: error.message || "Error fetching SAP orders",
              code: "sap_api_error"
            }
          } as ApiResponse<any>), {
            status: 502,
            headers: corsHeaders,
          });
        }
        
        // Format the response according to our API standard
        const apiResponse: ApiResponse<any> = {
          success: true,
          data: data.d && data.d.results ? data.d.results : [],
          meta: {
            pagination: {
              page: Math.floor(skip / top) + 1,
              pageSize: top,
              totalItems: data.totalCount || 0,
              totalPages: Math.ceil((data.totalCount || 0) / top)
            },
            version: apiVersion,
            apiSource: preferredSapApi
          }
        };
        
        return new Response(JSON.stringify(apiResponse), {
          headers: corsHeaders,
          status: 200,
        });
      }
      
      default:
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: `HTTP method ${req.method} not supported`,
            code: "method_not_supported"
          }
        } as ApiResponse<any>), {
          status: 405,
          headers: corsHeaders,
        });
    }
  } catch (error) {
    console.error(`Error in api-sap-orders edge function: ${error.message}`);
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: "Internal server error",
        code: "internal_error",
        details: error.message
      }
    } as ApiResponse<any>), {
      headers: corsHeaders,
      status: 500,
    });
  }
});

/**
 * Handle GET request for order details
 */
async function handleGetOrderDetails(
  supabaseClient: any, 
  orderNumber: string, 
  soldToId: string | null, 
  preferredSapApi: 'S4' | 'ECC',
  corsHeaders: Record<string, string>
) {
  try {
    let data, error;
    
    // Try S4 API first (or ECC if preferred)
    if (preferredSapApi === 'S4') {
      ({ data, error } = await supabaseClient.functions.invoke('get-sap-order-details', {
        body: { salesOrderId: orderNumber },
      }));
      
      // If S4 fails and we don't have soldToId, we can't fall back to ECC
      if (error && !soldToId) {
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: "Sold-to party ID is required for ECC API fallback",
            code: "missing_parameter"
          }
        } as ApiResponse<any>), {
          status: 400,
          headers: corsHeaders,
        });
      }
      
      // If S4 fails and we have soldToId, try ECC API
      if (error && soldToId) {
        ({ data, error } = await supabaseClient.functions.invoke('get-sap-order-details-ecc', {
          body: { salesOrderId: orderNumber, soldToId },
        }));
        
        // If ECC also fails, return error
        if (error) {
          return new Response(JSON.stringify({
            success: false,
            error: {
              message: "Failed to fetch order details from both S4 and ECC APIs",
              code: "sap_api_error",
              details: error.message
            }
          } as ApiResponse<any>), {
            status: 502,
            headers: corsHeaders,
          });
        }
        
        // Successfully got data from ECC API
        const apiResponse: ApiResponse<any> = {
          success: true,
          data: data,
          meta: {
            version: "v1",
            apiSource: "ECC"
          }
        };
        
        return new Response(JSON.stringify(apiResponse), {
          headers: corsHeaders,
          status: 200,
        });
      }
      
      // Successfully got data from S4 API
      const apiResponse: ApiResponse<any> = {
        success: true,
        data: data,
        meta: {
          version: "v1",
          apiSource: "S4"
        }
      };
      
      return new Response(JSON.stringify(apiResponse), {
        headers: corsHeaders,
        status: 200,
      });
    } else {
      // Preferred API is ECC
      if (!soldToId) {
        return new Response(JSON.stringify({
          success: false,
          error: {
            message: "Sold-to party ID is required for ECC API",
            code: "missing_parameter"
          }
        } as ApiResponse<any>), {
          status: 400,
          headers: corsHeaders,
        });
      }
      
      ({ data, error } = await supabaseClient.functions.invoke('get-sap-order-details-ecc', {
        body: { salesOrderId: orderNumber, soldToId },
      }));
      
      if (error) {
        // Try S4 API as fallback
        ({ data, error } = await supabaseClient.functions.invoke('get-sap-order-details', {
          body: { salesOrderId: orderNumber },
        }));
        
        if (error) {
          return new Response(JSON.stringify({
            success: false,
            error: {
              message: "Failed to fetch order details from both ECC and S4 APIs",
              code: "sap_api_error",
              details: error.message
            }
          } as ApiResponse<any>), {
            status: 502,
            headers: corsHeaders,
          });
        }
        
        // Successfully got data from S4 API
        const apiResponse: ApiResponse<any> = {
          success: true,
          data: data,
          meta: {
            version: "v1",
            apiSource: "S4"
          }
        };
        
        return new Response(JSON.stringify(apiResponse), {
          headers: corsHeaders,
          status: 200,
        });
      }
      
      // Successfully got data from ECC API
      const apiResponse: ApiResponse<any> = {
        success: true,
        data: data,
        meta: {
          version: "v1",
          apiSource: "ECC"
        }
      };
      
      return new Response(JSON.stringify(apiResponse), {
        headers: corsHeaders,
        status: 200,
      });
    }
  } catch (error) {
    console.error(`Error fetching order details: ${error.message}`);
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: "Error fetching order details",
        code: "internal_error",
        details: error.message
      }
    } as ApiResponse<any>), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
