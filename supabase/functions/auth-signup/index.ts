import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, firstName, lastName, userType } = await req.json()

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user already exists in EZC_USERS
    const { data: existingUser } = await supabase
      .from('ezc_users')
      .select('eu_id')
      .eq('eu_email', email)
      .single()

    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: 'User already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create user in Supabase Auth (without email verification)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        user_type: userType
      }
    })

    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ success: false, message: authError?.message || 'Failed to create auth user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create user in EZC_USERS table
    const currentDate = new Date().toISOString().split('T')[0]
    const currentTime = new Date().toTimeString().split(' ')[0]
    
    const { error: ezcError } = await supabase
      .from('ezc_users')
      .insert({
        eu_id: authData.user.id,
        eu_email: email,
        eu_first_name: firstName,
        eu_last_name: lastName,
        eu_type: userType,
        eu_created_date: currentDate,
        eu_changed_date: currentDate,
        eu_changed_by: 'SYSTEM',
        eu_deletion_flag: 'N',
        eu_is_built_in_user: 'N'
      })

    if (ezcError) {
      // Rollback: delete auth user if EZC user creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to create EZC user record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})