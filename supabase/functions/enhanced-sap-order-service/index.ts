
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { edgeAuthorityHelper, getUserRolesForEdge } from '../shared/authority/EdgeAuthorityHelper.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  console.log("=== Enhanced SAP Order Service with Authority Layer ===");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: 'No authorization header' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { data: { user }, error } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (error || !user) {
      return new Response(JSON.stringify({ 
        error: 'Invalid authorization token' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get user roles using the edge helper
    const userRoles = await getUserRolesForEdge(user.id);
    
    // Parse request
    const { soldToId, action = 'read', orderNumber } = await req.json();

    // **SINGLE POINT OF AUTHORITY CONTROL**
    // Check if user has authority to access SAP orders for this sold-to party
    const authorityDecision = await edgeAuthorityHelper.checkSapAuthority(
      user.id,
      userRoles,
      'orders',
      action,
      soldToId
    );

    if (!authorityDecision.allowed) {
      console.log(`Authority DENIED: ${authorityDecision.reason}`);
      return new Response(JSON.stringify({
        error: 'Access denied',
        reason: authorityDecision.reason,
        metadata: authorityDecision.metadata
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    console.log(`Authority GRANTED: ${authorityDecision.reason}`);

    // Now proceed with the actual SAP operation
    // This is where you would call your existing SAP service
    const sapResult = {
      success: true,
      message: 'SAP order service would be called here',
      orderNumber,
      soldToId,
      authorityInfo: {
        checked: true,
        reason: authorityDecision.reason,
        cached: authorityDecision.metadata?.cached || false
      }
    };

    return new Response(JSON.stringify(sapResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Enhanced SAP order service error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
