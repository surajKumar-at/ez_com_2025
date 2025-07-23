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
        JSON.stringify({ success: false, user: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        JSON.stringify({ success: false, user: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ User session found:', user.email)

    // Get user data from ezc_users
    const { data: userData, error: ezcError } = await supabase
      .from('ezc_users')
      .select('*')
      .eq('supabase_user_id', user.id)
      .eq('eu_deletion_flag', 'N')
      .single()

    if (ezcError || !userData) {
      console.log('❌ EZC user not found:', ezcError)
      return new Response(
        JSON.stringify({ success: false, user: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user permissions
    const { data: permissions, error: permError } = await supabase.rpc('get_user_permissions', { 
      user_id: userData.eu_id 
    })

    console.log('✅ User permissions loaded:', permissions?.length || 0)

    // Get session from Upstash if user is not admin
    let sessionData = {
      user: userData,
      permissions: permissions || []
    }

    if (userData.eu_type !== 1) {
      try {
        const sessionKey = `user_session:${userData.eu_id}`
        const upstashResponse = await fetch('https://evolved-cod-60397.upstash.io/command', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer AevtAAIjcDE0NTQ0NTVkYjI4MjE0ZjcyOTJhMTU1ZTUyODcxOTRmZHAxMA',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['GET', sessionKey])
        })

        const upstashData = await upstashResponse.json()
        if (upstashData.result) {
          const cachedSession = JSON.parse(upstashData.result)
          sessionData = { ...sessionData, ...cachedSession }
          console.log('✅ Session data loaded from Upstash')
        }
      } catch (upstashError) {
        console.log('⚠️ Error loading session from Upstash:', upstashError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: userData,
        session: sessionData,
        authUser: user
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Session check error:', error)
    return new Response(
      JSON.stringify({ success: false, user: null }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})