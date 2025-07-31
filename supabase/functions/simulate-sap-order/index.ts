
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { handleSimulationRequest } from "./handlers/simulationHandler.ts";

serve(async (req) => {
  console.log("SAP simulation function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    return await handleSimulationRequest(req);
  } catch (error) {
    console.error("Unexpected error in SAP simulation:", error);
    
    const errorResponse = {
      success: false,
      error: "Unexpected error during SAP order simulation",
      details: error instanceof Error ? error.message : String(error),
      messages: [
        {
          type: 'E',
          message: "System error occurred. Order can still be placed but will require manual synchronization."
        }
      ]
    };
    
    console.log("============= RETURNING ERROR RESPONSE =============");
    console.log(JSON.stringify(errorResponse, null, 2));
    console.log("===================================================");
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
