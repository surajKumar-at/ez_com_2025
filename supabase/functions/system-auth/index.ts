import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1] || pathSegments[pathSegments.length - 2];

    console.log('System Auth endpoint:', endpoint, 'Method:', req.method);

    switch (endpoint) {
      case 'systems':
        if (req.method === 'GET') {
          // Get systems from ezc_system_desc
          const { data: systems, error } = await supabase
            .from('ezc_system_desc')
            .select('esd_sys_no, esd_sys_desc, esd_sys_type, esd_lang')
            .order('esd_sys_desc');

          if (error) {
            console.error('Error fetching systems:', error);
            return new Response(
              JSON.stringify({
                success: false,
                data: null,
                error: error.message
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              data: systems || [],
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
          const { data: authDescriptions, error } = await supabase
            .from('ezc_auth_desc')
            .select('euad_auth_key, euad_auth_desc, euad_lang, euad_is_sys_auth, euad_deletion_flag')
            .eq('euad_lang', 'EN')
            .eq('euad_is_sys_auth', 'Y')
            .eq('euad_deletion_flag', 'N')
            .order('euad_auth_desc');

          if (error) {
            console.error('Error fetching auth descriptions:', error);
            return new Response(
              JSON.stringify({
                success: false,
                data: null,
                error: error.message
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              data: authDescriptions || [],
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

          // Get system's current authorizations using raw SQL via RPC
          try {
            const { data: systemAuths, error } = await supabase
              .rpc('execute_query', {
                query: `
                  SELECT A.esa_sys_no, A.esa_auth_key, B.euad_auth_desc
                  FROM ezc_system_auth A, ezc_auth_desc B 
                  WHERE A.esa_sys_no = ${parseInt(systemId)}
                    AND A.esa_auth_key = B.euad_auth_key 
                    AND B.euad_lang = 'EN'
                `
              });

            if (error) {
              // Fallback query if RPC doesn't exist - simplified approach
              const { data: systemAuthData, error: fallbackError } = await supabase
                .from('ezc_system_auth')
                .select('esa_sys_no, esa_auth_key')
                .eq('esa_sys_no', parseInt(systemId));

              if (fallbackError) {
                console.error('Error fetching system authorizations:', fallbackError);
                return new Response(
                  JSON.stringify({
                    success: false,
                    error: fallbackError.message,
                    data: null
                  }),
                  {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500
                  }
                );
              }

              // Get auth descriptions for the found auth keys
              const authKeys = systemAuthData?.map(sa => sa.esa_auth_key) || [];
              let authDescriptions = [];
              
              if (authKeys.length > 0) {
                const { data: authDescData } = await supabase
                  .from('ezc_auth_desc')
                  .select('euad_auth_key, euad_auth_desc')
                  .in('euad_auth_key', authKeys)
                  .eq('euad_lang', 'EN');
                
                authDescriptions = authDescData || [];
              }

              // Combine the data
              const result = systemAuthData?.map(sa => ({
                esa_sys_no: sa.esa_sys_no,
                esa_auth_key: sa.esa_auth_key,
                euad_auth_desc: authDescriptions.find(ad => ad.euad_auth_key === sa.esa_auth_key)?.euad_auth_desc || ''
              })) || [];

              return new Response(
                JSON.stringify({
                  success: true,
                  data: result,
                  error: null
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                  status: 200
                }
              );
            }

            return new Response(
              JSON.stringify({
                success: true,
                data: systemAuths || [],
                error: null
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
              }
            );
          } catch (queryError) {
            console.error('Error executing system auth query:', queryError);
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Failed to fetch system authorizations',
                data: null
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            );
          }
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

          try {
            // Delete existing authorizations for the system
            const { error: deleteError } = await supabase
              .from('ezc_system_auth')
              .delete()
              .eq('esa_sys_no', systemId);

            if (deleteError) {
              console.error('Error deleting existing authorizations:', deleteError);
              return new Response(
                JSON.stringify({
                  success: false,
                  error: 'Failed to update authorizations',
                  data: null
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                  status: 500
                }
              );
            }

            // Insert new authorizations
            if (authKeys && authKeys.length > 0) {
              const authInserts = authKeys.map(authKey => ({
                esa_sys_no: systemId,
                esa_auth_key: authKey
              }));

              const { error: insertError } = await supabase
                .from('ezc_system_auth')
                .insert(authInserts);

              if (insertError) {
                console.error('Error inserting new authorizations:', insertError);
                return new Response(
                  JSON.stringify({
                    success: false,
                    error: 'Failed to insert new authorizations',
                    data: null
                  }),
                  {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500
                  }
                );
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
          } catch (updateError) {
            console.error('Error updating system authorizations:', updateError);
            return new Response(
              JSON.stringify({
                success: false,
                error: 'Failed to update system authorizations',
                data: null
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
              }
            );
          }
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