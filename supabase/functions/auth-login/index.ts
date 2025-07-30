import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { email, password, loginType } = await req.json();
    // Create Supabase client
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // First authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    console.log(authData);
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
    // Get user data from EZC_USERS table
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
    // Check login type restrictions
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
    // Update last login time
    await supabase.from('ezc_users').update({
      eu_last_login_date: new Date().toISOString().split('T')[0],
      eu_last_login_time: new Date().toTimeString().split(' ')[0]
    }).eq('eu_id', ezcUser.eu_id);
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
      authData: authData
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
