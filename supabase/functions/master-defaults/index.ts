import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const masterDefaultSchema = z.object({
  eudd_key: z.string().min(1),
  eudd_defaults_desc: z.string().min(1),
  eudd_sys_key: z.string().default('999002'),
  eudd_lang: z.string().default('EN'),
  eudd_default_type: z.string().min(1),
  eudd_is_master: z.string().optional(),
});

const updateMasterDefaultSchema = masterDefaultSchema.partial().extend({
  eudd_key: z.string().min(1),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const sysKey = url.searchParams.get('sys_key') || '999002';

    if (req.method === 'GET') {
      console.log('Fetching master defaults for sys_key:', sysKey);
      
      const { data, error } = await supabase
        .from('ezc_defaults_desc')
        .select('*')
        .eq('eudd_sys_key', sysKey)
        .eq('eudd_lang', 'EN');

      if (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      console.log('Creating master default:', body);
      
      const validatedData = masterDefaultSchema.parse(body);
      
      const { data, error } = await supabase
        .from('ezc_defaults_desc')
        .insert([validatedData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, data, message: 'Master default created successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'PUT') {
      const body = await req.json();
      console.log('Updating master default:', body);
      
      const validatedData = updateMasterDefaultSchema.parse(body);
      const { eudd_key, ...updateData } = validatedData;
      
      const { data, error } = await supabase
        .from('ezc_defaults_desc')
        .update(updateData)
        .eq('eudd_key', eudd_key)
        .eq('eudd_sys_key', sysKey)
        .eq('eudd_lang', 'EN')
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, data, message: 'Master default updated successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'DELETE') {
      const body = await req.json();
      const { eudd_key } = body;
      console.log('Deleting master default:', eudd_key);
      
      const { error } = await supabase
        .from('ezc_defaults_desc')
        .delete()
        .eq('eudd_key', eudd_key)
        .eq('eudd_sys_key', sysKey)
        .eq('eudd_lang', 'EN');

      if (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'Master default deleted successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});