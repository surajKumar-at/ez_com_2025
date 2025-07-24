import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { drizzle } from 'https://esm.sh/drizzle-orm/postgres-js'
import postgres from 'https://esm.sh/postgres'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { eq } from 'https://esm.sh/drizzle-orm'

// Table schemas
const ezcSystemDesc = {
  esdSysNo: 'esd_sys_no',
  esdSysType: 'esd_sys_type', 
  esdLang: 'esd_lang',
  esdDescription: 'esd_description',
};

const ezcSystemTypes = {
  estSysType: 'est_sys_type',
  estLang: 'est_lang', 
  estDescription: 'est_description',
};

// DTO schemas
const systemSchema = z.object({
  esd_sys_no: z.number(),
  esd_sys_type: z.string(),
  esd_lang: z.string(),
  esd_description: z.string(),
  est_sys_type: z.string(),
  est_lang: z.string(),
  est_description: z.string()
})

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user } = await supabaseClient.auth.getUser(token)

    if (!user) {
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

    const client = postgres(Deno.env.get('SUPABASE_DB_URL')!)
    const db = drizzle(client)

    const url = new URL(req.url)
    const pathname = url.pathname

    // Handle system types endpoint
    if (pathname.endsWith('/system-types')) {
      if (req.method === 'GET') {
        console.log('Fetching system types...')
        
        const { data, error } = await supabaseClient
          .from('ezc_system_types')
          .select('est_sys_type, est_lang, est_description')
          .eq('est_lang', 'EN')
          .order('est_description')

        if (error) {
          console.error('Error fetching system types:', error)
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Failed to fetch system types',
              data: null 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('System types fetched successfully:', data?.length || 0, 'records')

        return new Response(
          JSON.stringify({ 
            success: true, 
            error: null,
            data: data || []
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
    }

    if (req.method === 'GET') {
      // Get systems with system types
      const { data, error } = await supabaseClient
        .rpc('execute_query', {
          query: `
            select A.esd_sys_no, A.esd_sys_type, A.esd_lang, A.esd_description,
                   B.est_sys_type, B.est_lang, B.est_description as est_description
            from EZC_SYSTEM_DESC A, EZC_SYSTEM_TYPES B 
            where A.ESD_SYS_TYPE = B.EST_SYS_TYPE 
            and A.ESD_LANG = B.EST_LANG 
            and A.ESD_LANG = 'EN' 
            order by esd_sys_no
          `
        })

      if (error) {
        // Fallback to direct query if RPC doesn't exist
        const { data: systemsData, error: systemsError } = await supabaseClient
          .from('ezc_system_desc')
          .select(`
            esd_sys_no,
            esd_sys_type,
            esd_lang,
            esd_description
          `)
          .eq('esd_lang', 'EN')
          .order('esd_sys_no')

        if (systemsError) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Failed to fetch systems',
              data: null 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

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

      return new Response(
        JSON.stringify({ 
          success: true, 
          error: null,
          data: data || []
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const validatedData = createSystemSchema.parse(body)

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
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to create system',
            data: null 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          error: null,
          data: data[0]
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url)
      const ids = url.searchParams.get('ids')?.split(',').map(Number) || []

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
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to delete systems',
            data: null 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

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
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error',
        data: null 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})