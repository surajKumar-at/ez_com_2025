
import { corsHeaders } from '../_shared/cors.ts';
import { handleSyncOrder } from './handlers/syncOrderHandler.ts';

// Main entry point for the function
Deno.serve(async (req) => {
  console.log('Request received in sync-order-with-sap function')
  console.log('Request method:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Responding to OPTIONS request with CORS headers')
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    return await handleSyncOrder(req);
  } catch (error) {
    console.error('Unexpected error syncing order with SAP:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Unexpected error syncing order with SAP',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
});
