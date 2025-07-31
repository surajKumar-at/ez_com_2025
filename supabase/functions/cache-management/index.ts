
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cacheService } from "../shared/cache/CacheService.ts";
import { handleAuthorityCache } from "./handlers/authorityHandler.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log(`Cache management request: ${req.method} ${req.url}`);
    
    // Extract Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user is authenticated and has admin role
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user has admin role
    const { data: userRoles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const hasAdminRole = userRoles?.some(r => r.role === 'admin' || r.role === 'content-admin');
    if (!hasAdminRole) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const action = pathParts[pathParts.length - 1];
    const cacheType = pathParts[pathParts.length - 2];

    switch (req.method) {
      case 'GET':
        if (action === 'status') {
          const status = cacheService.getStatus();
          return new Response(JSON.stringify(status), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'POST':
        if (cacheType === 'authority') {
          const body = await req.json();
          const result = await handleAuthorityCache(action, body);
          
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      case 'DELETE':
        if (action === 'invalidate') {
          const body = await req.json();
          const { key, namespace, userId, cacheType: targetCacheType } = body;

          if (targetCacheType === 'authority') {
            const result = await handleAuthorityCache('invalidate-user', { userId });
            return new Response(JSON.stringify(result), {
              status: result.success ? 200 : 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          if (userId) {
            // Invalidate all user-specific cache
            const userNamespace = `user:${userId}`;
            await cacheService.invalidateNamespace(userNamespace);
            console.log(`Cache invalidated for user: ${userId}`);
          } else if (namespace) {
            // Invalidate entire namespace
            await cacheService.invalidateNamespace(namespace);
            console.log(`Cache namespace invalidated: ${namespace}`);
          } else if (key && namespace) {
            // Invalidate specific key
            await cacheService.invalidate(key, namespace);
            console.log(`Cache key invalidated: ${namespace}:${key}`);
          } else {
            return new Response(JSON.stringify({ error: 'Missing key, namespace, or userId' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        if (action === 'reset-metrics') {
          cacheService.resetMetrics();
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Cache management error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
