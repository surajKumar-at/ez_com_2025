import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

console.log('Systems edge function starting...')

// DTO schemas
const createSystemSchema = z.object({
  systemType: z.string().min(1, 'System type is required'),
  language: z.string().min(1, 'Language is required'),
  systemId: z.string().min(1, 'System ID is required'),
  description: z.string().min(1, 'Description is required')
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  const url = new URL(req.url)
  console.log(`Processing request: ${req.method} ${url.pathname}`)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Authentication check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authorization header missing',
          data: null 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      console.log('Authentication failed:', authError?.message)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized',
          data: null 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'GET') {
      console.log('Fetching systems...')

      // First try to get systems from ezc_system_desc table
      const { data: systemsData, error: systemsError } = await supabaseClient
        .from('ezc_system_desc')
        .select('*')
        .eq('esd_lang', 'EN')
        .order('esd_sys_no')

      console.log('Systems query result:', { systemsData, systemsError })

      if (systemsError) {
        console.error('Database error:', systemsError)
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Database error: ${systemsError.message}`,
            data: null 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log('Systems fetched from DB:', systemsData)

      return new Response(
        JSON.stringify({ 
          success: true, 
          error: null,
          data: systemsData || []
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'POST') {
      console.log('Creating new system...')
      const body = await req.json()
      console.log('Request body:', body)

      const validationResult = createSystemSchema.safeParse(body)
      if (!validationResult.success) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Validation error: ${validationResult.error.issues.map(i => i.message).join(', ')}`,
            data: null 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const validatedData = validationResult.data

      // Insert new system
      const { data, error } = await supabaseClient
        .from('ezc_system_desc')
        .insert({
          esd_sys_type: validatedData.systemType,
          esd_lang: validatedData.language,
          esd_description: validatedData.description,
          esd_sys_no: parseInt(validatedData.systemId)
        })
        .select()

      if (error) {
        console.error('Insert error:', error)
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to create system: ${error.message}`,
            data: null 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log('System created:', data)

      return new Response(
        JSON.stringify({ 
          success: true, 
          error: null,
          data: data?.[0] || null
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'DELETE') {
      console.log('Deleting systems...')
      const ids = url.searchParams.get('ids')?.split(',').map(Number) || []
      console.log('IDs to delete:', ids)

      if (ids.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'No IDs provided',
            data: null 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const { error } = await supabaseClient
        .from('ezc_system_desc')
        .delete()
        .in('esd_sys_no', ids)

      if (error) {
        console.error('Delete error:', error)
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to delete systems: ${error.message}`,
            data: null 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`Deleted ${ids.length} systems`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          error: null,
          data: { deletedCount: ids.length }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Method not allowed',
        data: null 
      }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in systems function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Server error: ${error.message}`,
        data: null 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})