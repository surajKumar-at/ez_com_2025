import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { createDbClient } from '../../../src/lib/db/client.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1] || pathSegments[pathSegments.length - 2];

    console.log('System Auth endpoint:', endpoint, 'Method:', req.method);

    const db = createDbClient(Deno.env.get('DATABASE_URL')!);

    switch (endpoint) {
      case 'systems':
        if (req.method === 'GET') {
          // Get systems from ezc_system_desc
          const systems = await db.execute(`
            SELECT esd_sys_no, esd_sys_desc, esd_sys_type, esd_lang 
            FROM ezc_system_desc 
            ORDER BY esd_sys_desc
          `);

          return new Response(
            JSON.stringify({
              success: true,
              data: systems.rows,
              error: null
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }
        break;

      case 'auth-descriptions':
        if (req.method === 'GET') {
          // Get authorization descriptions
          const authDescriptions = await db.execute(`
            SELECT euad_auth_key, euad_auth_desc, euad_lang, euad_is_sys_auth, euad_deletion_flag
            FROM ezc_auth_desc 
            WHERE euad_lang = 'EN' 
              AND euad_is_sys_auth = 'Y' 
              AND euad_deletion_flag = 'N'
            ORDER BY euad_auth_desc
          `);

          return new Response(
            JSON.stringify({
              success: true,
              data: authDescriptions.rows,
              error: null
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }
        break;

      case 'system-authorizations':
        if (req.method === 'GET') {
          const systemId = pathSegments[pathSegments.length - 1];
          
          if (!systemId || systemId === 'system-authorizations') {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'System ID is required',
                data: null
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
              }
            );
          }

          // Get system's current authorizations
          const systemAuths = await db.execute(`
            SELECT A.esa_sys_no, A.esa_auth_key, B.euad_auth_desc
            FROM ezc_system_auth A, ezc_auth_desc B 
            WHERE A.esa_sys_no = $1 
              AND A.esa_auth_key = B.euad_auth_key 
              AND B.euad_lang = 'EN'
          `, [parseInt(systemId)]);

          return new Response(
            JSON.stringify({
              success: true,
              data: systemAuths.rows,
              error: null
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }
        break;

      case 'update':
        if (req.method === 'POST') {
          const { systemId, authKeys } = await req.json();

          if (!systemId) {
            return new Response(
              JSON.stringify({
                success: false,
                error: 'System ID is required',
                data: null
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
              }
            );
          }

          // Delete existing authorizations for the system
          await db.execute(`
            DELETE FROM ezc_system_auth WHERE esa_sys_no = $1
          `, [systemId]);

          // Insert new authorizations
          if (authKeys && authKeys.length > 0) {
            for (const authKey of authKeys) {
              await db.execute(`
                INSERT INTO ezc_system_auth (esa_sys_no, esa_auth_key) 
                VALUES ($1, $2)
              `, [systemId, authKey]);
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              data: null,
              error: null
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }
        break;

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Endpoint not found',
            data: null
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404
          }
        );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Method not allowed',
        data: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    );

  } catch (error) {
    console.error('System Auth error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        data: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});