import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { method } = req;
    const url = new URL(req.url);
    const key = url.searchParams.get('key');

    switch (method) {
      case 'GET':
        if (key) {
          // Get single site default
          const { data, error } = await supabaseClient
            .from('ezc_defaults_desc')
            .select('*')
            .eq('eudd_key', key)
            .eq('eudd_lang', 'EN')
            .eq('eudd_sys_key', 'NOT')
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ success: false, error: error.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
          }

          return new Response(
            JSON.stringify({ success: true, data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Get all site defaults
          const { data, error } = await supabaseClient
            .from('ezc_defaults_desc')
            .select('*')
            .not('eudd_default_type', 'in', '(3,5,6)')
            .eq('eudd_lang', 'EN')
            .eq('eudd_sys_key', 'NOT')
            .order('eudd_key');

          if (error) {
            return new Response(
              JSON.stringify({ success: false, error: error.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            );
          }

          return new Response(
            JSON.stringify({ success: true, data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'POST':
        const createData = await req.json();
        const { data: newData, error: createError } = await supabaseClient
          .from('ezc_defaults_desc')
          .insert(createData)
          .select()
          .single();

        if (createError) {
          return new Response(
            JSON.stringify({ success: false, error: createError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: newData, message: 'Site default created successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'PUT':
        if (!key) {
          return new Response(
            JSON.stringify({ success: false, error: 'Key parameter is required for update' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        const updateData = await req.json();
        const { data: updatedData, error: updateError } = await supabaseClient
          .from('ezc_defaults_desc')
          .update(updateData)
          .eq('eudd_key', key)
          .eq('eudd_lang', 'EN')
          .eq('eudd_sys_key', 'NOT')
          .select()
          .single();

        if (updateError) {
          return new Response(
            JSON.stringify({ success: false, error: updateError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data: updatedData, message: 'Site default updated successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'DELETE':
        if (!key) {
          return new Response(
            JSON.stringify({ success: false, error: 'Key parameter is required for delete' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        const { error: deleteError } = await supabaseClient
          .from('ezc_defaults_desc')
          .delete()
          .eq('eudd_key', key)
          .eq('eudd_lang', 'EN')
          .eq('eudd_sys_key', 'NOT');

        if (deleteError) {
          return new Response(
            JSON.stringify({ success: false, error: deleteError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Site default deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Method not allowed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});