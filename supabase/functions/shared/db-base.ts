
export interface ServiceHandler {
  handle(supabase: any, method: string, path: string, req: Request, user: any): Promise<Response>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify({ data, success: true }),
    { 
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200
    }
  );
}

export function createErrorResponse(error: string, status: number = 400): Response {
  return new Response(
    JSON.stringify({ error, success: false }),
    { 
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status
    }
  );
}
