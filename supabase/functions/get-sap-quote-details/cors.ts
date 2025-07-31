// CORS configuration for the SAP quote details function
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-environment, x-syskey',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
};

export function createCorsResponse(status: number = 204): Response {
  return new Response(null, {
    headers: corsHeaders,
    status,
  });
}

export function createErrorResponse(message: string, status: number = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: corsHeaders,
  });
}

export function createSuccessResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
    status: 200,
  });
}