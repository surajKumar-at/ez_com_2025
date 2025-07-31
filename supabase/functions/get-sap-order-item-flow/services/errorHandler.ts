
import { corsHeaders } from "../_shared/cors.ts";

export const handleError = (error: any) => {
  console.error(`Error in edge function: ${error.message}`);
  return new Response(JSON.stringify({ error: error.message }), {
    status: 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
};
