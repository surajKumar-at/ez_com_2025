
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AuthorityCacheService } from './services/AuthorityCacheService.ts';
import { AuthorityService } from './services/AuthorityService.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuthorityRequest {
  userId?: string;
  resource: string;
  operation: string;
  context?: Record<string, any>;
}

interface BatchAuthorityRequest {
  checks: AuthorityRequest[];
}

// Initialize services
const cacheService = new AuthorityCacheService();
const authorityService = new AuthorityService();

serve(async (req: Request) => {
  console.log("=== Authority Gateway Phase 2 Called ===");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Initialize cache service on first request
    await cacheService.initialize();

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('authorization');
    let userId: string | undefined;
    let userRoles: string[] = [];

    if (authHeader) {
      const { data: { user }, error } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      
      if (!error && user) {
        userId = user.id;
        // Get user role from user metadata or default to customer
        const role = user.user_metadata?.role || 'customer';
        userRoles = [role];
        console.log(`Authenticated user: ${user.email} (roles: ${userRoles.join(', ')})`);
      }
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (req.method === 'POST') {
      if (path === 'batch') {
        return await handleBatchAuthorityCheck(req, userId, userRoles);
      } else {
        return await handleSingleAuthorityCheck(req, userId, userRoles);
      }
    } else if (req.method === 'GET' && path === 'status') {
      return await handleStatusCheck();
    } else if (req.method === 'DELETE' && path === 'invalidate') {
      return await handleCacheInvalidation(req, userId);
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error) {
    console.error(`Error in authority gateway: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function handleSingleAuthorityCheck(req: Request, userId?: string, userRoles: string[] = []): Promise<Response> {
  try {
    let requestData: AuthorityRequest;
    
    // Handle empty request body
    const body = await req.text();
    if (!body || body.trim() === '') {
      requestData = {
        resource: 'test',
        operation: 'read',
        context: {}
      };
    } else {
      try {
        requestData = JSON.parse(body);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
    }
    
    const effectiveUserId = requestData.userId || userId || 'anonymous';
    const effectiveUserRoles = requestData.context?.userRoles || userRoles;
    
    const cacheKey = cacheService.generateCacheKey(
      effectiveUserId,
      requestData.resource,
      requestData.operation,
      requestData.context
    );

    // Check cache first
    let decision = await cacheService.get(cacheKey);
    
    if (!decision) {
      // Make fresh decision
      decision = authorityService.makeDecision(
        effectiveUserId,
        requestData.resource,
        requestData.operation,
        effectiveUserRoles,
        requestData.context
      );
      
      // Cache the decision
      await cacheService.set(cacheKey, decision);
    }

    return new Response(JSON.stringify({
      success: true,
      decision
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Single authority check error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
}

async function handleBatchAuthorityCheck(req: Request, userId?: string, userRoles: string[] = []): Promise<Response> {
  try {
    const requestData: BatchAuthorityRequest = await req.json();
    
    const decisions = new Map<string, any>();

    for (const [index, check] of requestData.checks.entries()) {
      const effectiveUserId = check.userId || userId || 'anonymous';
      const effectiveUserRoles = check.context?.userRoles || userRoles;
      
      const cacheKey = cacheService.generateCacheKey(
        effectiveUserId,
        check.resource,
        check.operation,
        check.context
      );

      // Check cache first
      let decision = await cacheService.get(cacheKey);
      
      if (!decision) {
        // Make fresh decision
        decision = authorityService.makeDecision(
          effectiveUserId,
          check.resource,
          check.operation,
          effectiveUserRoles,
          check.context
        );
        
        // Cache the decision
        await cacheService.set(cacheKey, decision);
      }

      decisions.set(`check_${index}`, decision);
    }

    // Convert Map to object for JSON response
    const decisionsObj = Object.fromEntries(decisions);

    return new Response(JSON.stringify({
      success: true,
      decisions: decisionsObj
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Batch authority check error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
}

async function handleStatusCheck(): Promise<Response> {
  try {
    const cacheStats = await cacheService.getStats();
    
    const status = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      phase: 'Phase 2 - Deno KV Integration',
      cache: cacheStats,
      features: [
        'Deno KV persistent caching',
        'Fallback in-memory cache',
        'Enhanced authority logic',
        'Performance monitoring',
        'Automatic cache expiration'
      ]
    };

    return new Response(JSON.stringify(status), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Status check error:', error);
    return new Response(JSON.stringify({
      status: 'error',
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

async function handleCacheInvalidation(req: Request, userId?: string): Promise<Response> {
  try {
    const body = await req.text();
    let requestData = {};
    
    if (body && body.trim() !== '') {
      try {
        requestData = JSON.parse(body);
      } catch (parseError) {
        console.error('Cache invalidation JSON parse error:', parseError);
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
    }
    
    const { targetUserId, invalidateAll } = requestData as any;
    
    if (invalidateAll) {
      await cacheService.clear();
      console.log('All authority cache cleared');
    } else if (targetUserId || userId) {
      const userIdToInvalidate = targetUserId || userId;
      const invalidatedCount = await cacheService.invalidateUser(userIdToInvalidate);
      console.log(`Authority cache cleared for user: ${userIdToInvalidate} (${invalidatedCount} entries)`);
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'No user specified for cache invalidation'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Authority cache invalidated'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cache invalidation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
