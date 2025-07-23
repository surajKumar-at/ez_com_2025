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
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, message: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract JWT token from header
    const jwt = authHeader.replace('Bearer ', '')
    
    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt)
    
    if (userError || !user) {
      console.log('❌ Error getting user:', userError)
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    console.log('✅ User found:', user.email)

    // Get ezc_users data to find eu_id for session cleanup
    const { data: userData, error: ezcError } = await supabase
      .from('ezc_users')
      .select('eu_id')
      .eq('supabase_user_id', user.id)
      .single()

    if (userData) {
      // Clear session from Upstash
      const sessionKey = `user_session:${userData.eu_id}`
      console.log('🗑️ Clearing session:', sessionKey)
      
      try {
        await fetch('https://evolved-cod-60397.upstash.io/command', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer AevtAAIjcDE0NTQ0NTVkYjI4MjE0ZjcyOTJhMTU1ZTUyODcxOTRmZHAxMA',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['DEL', sessionKey])
        })
        console.log('✅ Session cleared from Upstash')
      } catch (upstashError) {
        console.log('⚠️ Error clearing Upstash session:', upstashError)
      }
    }

    // Sign out the user
    const { error: signOutError } = await supabase.auth.signOut(jwt)
    
    if (signOutError) {
      console.log('❌ Error signing out:', signOutError)
      return new Response(
        JSON.stringify({ success: false, message: 'Logout failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('✅ User logged out successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Logged out successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Logout error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})