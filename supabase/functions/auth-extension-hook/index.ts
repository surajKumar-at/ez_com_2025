
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface AuthHookContext {
  operation: string;
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
  email?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

interface AuthHookResult {
  success: boolean;
  data?: any;
  error?: string;
  modified?: boolean;
  block?: boolean;
  requiresAdditionalStep?: boolean;
  additionalData?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Auth Extension Hook called');

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

    const body = await req.json();
    const { hookId, hookName, operation, context } = body;
    
    console.log('Processing auth hook:', { hookId, hookName, operation });

    // Execute the appropriate hook handler
    const result: AuthHookResult = await processAuthHook(hookId, operation, context);

    console.log('Auth hook result:', JSON.stringify(result, null, 2));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in auth extension hook:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Auth hook execution failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function processAuthHook(hookId: string, operation: string, context: AuthHookContext): Promise<AuthHookResult> {
  console.log(`Processing auth hook for operation: ${operation}`);

  switch (operation) {
    case 'pre-login':
      return await processPreLoginHook(context);
    
    case 'post-login':
      return await processPostLoginHook(context);
    
    case 'pre-logout':
      return await processPreLogoutHook(context);
    
    case 'post-logout':
      return await processPostLogoutHook(context);
    
    case 'pre-register':
      return await processPreRegisterHook(context);
    
    case 'post-register':
      return await processPostRegisterHook(context);
    
    case 'session-refresh':
      return await processSessionRefreshHook(context);
    
    default:
      console.log(`No specific handler for operation: ${operation}`);
      return { success: true };
  }
}

async function processPreLoginHook(context: AuthHookContext): Promise<AuthHookResult> {
  console.log('Processing pre-login hook');
  
  // Example: Check if login is allowed based on time
  const now = new Date();
  const hour = now.getHours();
  
  // Block login during maintenance hours (2 AM - 4 AM)
  if (hour >= 2 && hour < 4) {
    return {
      success: false,
      block: true,
      error: 'System maintenance in progress. Please try again after 4 AM.'
    };
  }

  // Example: Check for suspicious login patterns
  if (context.email && context.email.includes('+test')) {
    console.log('Flagging test account login');
    return {
      success: true,
      requiresAdditionalStep: true,
      additionalData: {
        requiresCaptcha: true,
        reason: 'Test account detected'
      }
    };
  }

  return { success: true };
}

async function processPostLoginHook(context: AuthHookContext): Promise<AuthHookResult> {
  console.log('Processing post-login hook');
  
  // Example: Log successful login
  console.log(`User ${context.user?.email} logged in successfully at ${context.timestamp}`);
  
  // Example: Check for new device
  if (context.metadata?.newDevice) {
    return {
      success: true,
      requiresAdditionalStep: true,
      additionalData: {
        showNewDeviceNotification: true,
        deviceVerificationRequired: true
      }
    };
  }

  // Example: Update last login timestamp
  return {
    success: true,
    modified: true,
    data: {
      lastLoginAt: context.timestamp,
      loginCount: (context.metadata?.loginCount || 0) + 1
    }
  };
}

async function processPreLogoutHook(context: AuthHookContext): Promise<AuthHookResult> {
  console.log('Processing pre-logout hook');
  
  // Example: Save user session data before logout
  if (context.user) {
    console.log(`Preparing logout for user: ${context.user.email}`);
    
    return {
      success: true,
      data: {
        sessionEnded: context.timestamp,
        gracefulLogout: true
      }
    };
  }

  return { success: true };
}

async function processPostLogoutHook(context: AuthHookContext): Promise<AuthHookResult> {
  console.log('Processing post-logout hook');
  
  // Example: Clean up user-specific cache or temporary data
  console.log(`User logged out at ${context.timestamp}`);
  
  return {
    success: true,
    data: {
      cleanupCompleted: true,
      logoutTimestamp: context.timestamp
    }
  };
}

async function processPreRegisterHook(context: AuthHookContext): Promise<AuthHookResult> {
  console.log('Processing pre-register hook');
  
  // Example: Validate email domain
  if (context.email) {
    const domain = context.email.split('@')[1];
    const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    
    if (blockedDomains.includes(domain)) {
      return {
        success: false,
        block: true,
        error: 'Registration not allowed from temporary email providers'
      };
    }

    // Example: Check for corporate email domains
    const corporateDomains = ['company.com', 'enterprise.org'];
    if (corporateDomains.includes(domain)) {
      return {
        success: true,
        requiresAdditionalStep: true,
        additionalData: {
          requiresManagerApproval: true,
          corporateAccount: true
        }
      };
    }
  }

  return { success: true };
}

async function processPostRegisterHook(context: AuthHookContext): Promise<AuthHookResult> {
  console.log('Processing post-register hook');
  
  // Example: Send welcome email or setup default preferences
  if (context.user) {
    console.log(`New user registered: ${context.user.email}`);
    
    return {
      success: true,
      data: {
        welcomeEmailSent: true,
        defaultPreferencesSet: true,
        registrationComplete: true
      }
    };
  }

  return { success: true };
}

async function processSessionRefreshHook(context: AuthHookContext): Promise<AuthHookResult> {
  console.log('Processing session refresh hook');
  
  // Example: Check if session should be refreshed based on security policies
  if (context.user) {
    const now = new Date();
    const sessionAge = context.metadata?.sessionAge || 0;
    
    // Force re-authentication after 8 hours for admin users
    if (context.user.role === 'admin' && sessionAge > 8 * 60 * 60 * 1000) {
      return {
        success: false,
        block: true,
        error: 'Admin session expired. Please log in again.'
      };
    }
  }

  return {
    success: true,
    data: {
      sessionRefreshed: true,
      refreshedAt: context.timestamp
    }
  };
}
