
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface HookContext {
  operation: string;
  payload?: any;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  previousResult?: any;
}

interface HookResult {
  success: boolean;
  data?: any;
  error?: string;
  modified?: boolean;
  skipOriginal?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('SAP Extension Hook called');

    // Get authentication from headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body: HookContext = await req.json();
    console.log('Hook context received:', JSON.stringify(body, null, 2));

    // Example hook implementation - this would be customized per deployment
    const result: HookResult = await processHook(body);

    console.log('Hook result:', JSON.stringify(result, null, 2));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in SAP extension hook:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Hook execution failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function processHook(context: HookContext): Promise<HookResult> {
  console.log(`Processing hook for operation: ${context.operation}`);

  switch (context.operation) {
    case 'get-orders':
      return await processGetOrdersHook(context);
    
    case 'get-order-details':
      return await processGetOrderDetailsHook(context);
    
    case 'simulate-order':
      return await processSimulateOrderHook(context);
    
    case 'create-order':
      return await processCreateOrderHook(context);
    
    default:
      console.log(`No specific handler for operation: ${context.operation}`);
      return { success: true, data: context.payload };
  }
}

async function processGetOrdersHook(context: HookContext): Promise<HookResult> {
  console.log('Processing get-orders hook');
  
  // Example: Add custom filtering or modify request
  const payload = context.payload || {};
  
  // Add custom metadata
  payload.customMetadata = {
    processedBy: 'sap-extension-hook',
    timestamp: new Date().toISOString(),
    userId: context.userId
  };

  return {
    success: true,
    data: payload,
    modified: true
  };
}

async function processGetOrderDetailsHook(context: HookContext): Promise<HookResult> {
  console.log('Processing get-order-details hook');
  
  // Example: Add custom data enrichment
  const result = {
    success: true,
    data: context.payload,
    modified: false
  };

  // Add custom processing if needed
  if (context.previousResult) {
    console.log('Post-processing order details with custom logic');
    // Add custom fields or modify response
    result.modified = true;
  }

  return result;
}

async function processSimulateOrderHook(context: HookContext): Promise<HookResult> {
  console.log('Processing simulate-order hook');
  
  // Example: Add custom validation or preprocessing
  const payload = context.payload || {};
  
  // Custom validation logic
  if (!payload.items || payload.items.length === 0) {
    return {
      success: false,
      error: 'Order must contain at least one item'
    };
  }

  // Add custom processing metadata
  payload.hookProcessing = {
    validatedAt: new Date().toISOString(),
    validatedBy: 'extension-hook'
  };

  return {
    success: true,
    data: payload,
    modified: true
  };
}

async function processCreateOrderHook(context: HookContext): Promise<HookResult> {
  console.log('Processing create-order hook');
  
  // Example: Add custom order processing
  const payload = context.payload || {};
  
  // Add audit trail
  payload.auditTrail = {
    createdViaHook: true,
    hookTimestamp: new Date().toISOString(),
    hookUserId: context.userId
  };

  return {
    success: true,
    data: payload,
    modified: true
  };
}
