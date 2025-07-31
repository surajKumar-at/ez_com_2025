import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { cache_auth } from '../_shared/cache_auth.ts';
// Table structure reference (for clarity)
const ezcSystemDesc = {
  esd_sys_no: 'esd_sys_no',
  esd_sys_type: 'esd_sys_type',
  esd_lang: 'esd_lang',
  esd_sys_desc: 'esd_sys_desc'
};
const ezcSystemTypes = {
  est_sys_type: 'est_sys_type',
  est_lang: 'est_lang',
  est_desc: 'est_desc'
};
// Validation schema
const createSystemSchema = z.object({
  systemType: z.coerce.number().int(),
  language: z.string().min(1, 'Language is required'),
  systemId: z.string().min(1, 'System ID is required'),
  description: z.string().min(1, 'Description is required')
});
// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};
// DTO converter
function dbRowToDto(row) {
  return {
    systemType: row.esd_sys_type,
    language: row.esd_lang,
    systemId: row.esd_sys_no?.toString(),
    description: row.esd_sys_desc
  };
}
// Main server handler
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: user } = await supabase.auth.getUser(token);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized',
        data: null
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    console.log(user);
    console.log(user.user.id);
    if (await cache_auth.hasAuthorization(user.user.id, "ADD_AUTH_DESC")) {
      console.log("AUTHENTICATION PRESENT");
    } else {
      console.log("AUTHENTICATION NOT PRESENT");
    }
    const url = new URL(req.url);
    switch(req.method){
      case 'GET':
        {
          // Prefer SQL RPC if available
          const { data, error } = await supabase.rpc('execute_query', {
            query: `
            SELECT A.esd_sys_no, A.esd_sys_type, A.esd_lang, A.esd_sys_desc,
                   B.est_sys_type, B.est_lang, B.est_desc
            FROM ezc_system_desc A
            JOIN ezc_system_types B 
              ON A.esd_sys_type = B.est_sys_type 
             AND A.esd_lang = B.est_lang
            WHERE A.esd_lang = 'EN'
            ORDER BY A.esd_sys_no;
          `
          });
          if (!error) {
            return new Response(JSON.stringify({
              success: true,
              data: data || [],
              error: null
            }), {
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            });
          }
          // Fallback to standard query if RPC fails
          const { data: fallbackData, error: fallbackError } = await supabase.from('ezc_system_desc').select('esd_sys_no, esd_sys_type, esd_lang, esd_sys_desc').eq('esd_lang', 'EN').order('esd_sys_no');
          if (fallbackError) {
            console.error('Fallback error:', fallbackError);
            return new Response(JSON.stringify({
              success: false,
              error: 'Failed to fetch systems',
              data: null
            }), {
              status: 500,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            });
          }
          return new Response(JSON.stringify({
            success: true,
            data: fallbackData || [],
            error: null
          }), {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        }
      case 'POST':
        {
          const body = await req.json();
          const result = createSystemSchema.safeParse(body);
          if (!result.success) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Validation failed',
              details: result.error.errors
            }), {
              status: 400,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            });
          }
          const data = result.data;
          const { data: inserted, error } = await supabase.from('ezc_system_desc').insert({
            esd_sys_type: data.systemType,
            esd_lang: data.language,
            esd_sys_no: parseInt(data.systemId),
            esd_sys_desc: data.description
          }).select().single();
          if (error) {
            console.error('Insert error:', error);
            return new Response(JSON.stringify({
              success: false,
              error: 'Failed to create system',
              data: null
            }), {
              status: 500,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            });
          }
          return new Response(JSON.stringify({
            success: true,
            data: dbRowToDto(inserted),
            message: 'System created successfully'
          }), {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        }
      case 'DELETE':
        {
          const ids = url.searchParams.get('ids')?.split(',').map((id)=>parseInt(id)).filter((id)=>!isNaN(id)) ?? [];
          if (ids.length === 0) {
            return new Response(JSON.stringify({
              success: false,
              error: 'No valid IDs provided'
            }), {
              status: 400,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            });
          }
          const { error } = await supabase.from('ezc_system_desc').delete().in('esd_sys_no', ids);
          if (error) {
            return new Response(JSON.stringify({
              success: false,
              error: 'Failed to delete systems'
            }), {
              status: 500,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            });
          }
          return new Response(JSON.stringify({
            success: true,
            message: `Deleted ${ids.length} system(s)`
          }), {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          });
        }
      default:
        return new Response(JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }), {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown server error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
