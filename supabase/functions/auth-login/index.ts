// index.ts (Supabase Edge Function, Deno)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabase-client.ts';
// Import your upstash utility
import { cache_store } from '../_shared/cache_store.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { email, password, loginType } = await req.json();
    // Use shared Supabase client
    const supabase = supabaseAdmin;
    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (authError || !authData.user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid credentials'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 401
      });
    }
    // Fetch user from EZC_USERS
    const { data: ezcUser, error: ezcError } = await supabase.from('ezc_users').select('*').eq('eu_email', email).single();
    if (ezcError || !ezcUser) {
      return new Response(JSON.stringify({
        success: false,
        message: 'User not found in EZC system'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 404
      });
    }
    // Check for admin login
    if (loginType === 'admin' && ezcUser.eu_type !== 1) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Admin access required'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 403
      });
    }
    // Update last login datetime
    await supabase.from('ezc_users').update({
      eu_last_login_date: new Date().toISOString().split('T')[0],
      eu_last_login_time: new Date().toTimeString().split(' ')[0]
    }).eq('eu_id', ezcUser.eu_id);
    // Fetch and store user roles in Upstash Redis
    const { data: userRoleRows, error: userRoleError } = await supabase.from('ezc_user_auth').select('eua_auth_key').eq('eua_user_id', ezcUser.eu_id).eq('eua_role_or_auth', 'R');
    if (userRoleError) {
      console.error('User auth error:', userRoleError);
    }
    // Fetch and store user auths in Upstash Redis
    const { data: userAuthRows, error: userAuthError } = await supabase.from('ezc_user_auth').select('eua_auth_key').eq('eua_user_id', ezcUser.eu_id).eq('eua_role_or_auth', 'A');
    if (userAuthError) {
      console.error('User auth error:', userAuthError);
    }
    const roleKeys = userRoleRows?.map((r)=>r.eua_auth_key) || [];
    const userRoleKey = `role:${ezcUser.eu_id}`;
    await cache_store.set(userRoleKey, roleKeys);
    const value = await cache_store.get(userRoleKey);
    console.log(value);
    const roleAuths = {};
    if (userRoleRows && userRoleRows.length > 0) {
      for (const userRole of userRoleRows){
        const roleKey = userRole.eua_auth_key;
        const { data: roleAuthRows, error: roleAuthError } = await supabase.from('ezc_role_auth').select('era_auth_key').eq('era_role_nr', roleKey);
        if (roleAuthError) {
          console.error(`Error fetching authorizations for role ${roleKey}:`, roleAuthError);
          roleAuths[roleKey] = [];
        } else {
          roleAuths[roleKey] = roleAuthRows || [];
        }
      }
    }
    const directAuthKeys = userAuthRows?.map((r)=>r.eua_auth_key) || [];
    // Extract all role-based auth keys
    const roleBasedAuthKeys = Object.values(roleAuths).flat().map((r)=>r.era_auth_key);
    // Combine and deduplicate all auth keys
    const allAuthorizations = Array.from(new Set([
      ...directAuthKeys,
      ...roleBasedAuthKeys
    ]));
    const userAuthKey = `auth:${ezcUser.eu_id}`;
    await cache_store.set(userAuthKey, {
      allAuthorizations
    });
    const value1 = await cache_store.get(userAuthKey);
    console.log(value1);
    return new Response(JSON.stringify({
      success: true,
      user: {
        eu_id: ezcUser.eu_id,
        eu_email: ezcUser.eu_email,
        eu_first_name: ezcUser.eu_first_name,
        eu_last_name: ezcUser.eu_last_name,
        eu_type: ezcUser.eu_type,
        supabase_user_id: authData.user.id
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at,
        expires_in: authData.session?.expires_in,
        token_type: authData.session?.token_type
      },
      authorizations: userAuthRows,
      authData
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal server error'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
