
// Follow Deno Deploy's ES modules support
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { handleOrderDetailsRequest } from "./handlers/orderDetailsHandler.ts";

// Main function to handle requests
serve(async (req: Request) => {
  console.log("Edge function get-sap-order-details-ecc called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    return await handleOrderDetailsRequest(req);
  } catch (error) {
    console.error(`Error in edge function: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
