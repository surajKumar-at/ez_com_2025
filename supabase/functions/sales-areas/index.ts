import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Schema for sales area data
const salesAreaSchema = z.object({
  systemNo: z.number(),
  code: z.string().min(1),
  language: z.string().min(1),
  description: z.string().min(1),
  synchronizable: z.string(),
});

const updateSalesAreaSchema = salesAreaSchema.extend({
  eskd_sys_no: z.number(),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization header missing' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'GET') {
      // Fetch sales areas
      const { data, error } = await supabase
        .from('ezc_system_key_desc')
        .select('eskd_sys_no, eskd_sys_key, eskd_sys_key_desc, eskd_sync_flag')
        .eq('eskd_supp_cust_flag', 'C')
        .eq('eskd_lang', 'EN')
        .order('eskd_sys_key');

      if (error) {
        console.error('Error fetching sales areas:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch sales areas' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data, error: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (req.method === 'POST') {
      // Create new sales area
      const body = await req.json();
      const validatedData = salesAreaSchema.parse(body);

      const { data, error } = await supabase
        .from('ezc_system_key_desc')
        .insert({
          eskd_sys_no: validatedData.systemNo,
          eskd_sys_key: validatedData.code,
          eskd_sys_key_desc: validatedData.description,
          eskd_lang: validatedData.language,
          eskd_sync_flag: validatedData.synchronizable,
          eskd_supp_cust_flag: 'C'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating sales area:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create sales area' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data, error: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (req.method === 'PUT') {
      // Update sales area
      const body = await req.json();
      const validatedData = updateSalesAreaSchema.parse(body);

      const { data, error } = await supabase
        .from('ezc_system_key_desc')
        .update({
          eskd_sys_no: validatedData.systemNo,
          eskd_sys_key: validatedData.code,
          eskd_sys_key_desc: validatedData.description,
          eskd_lang: validatedData.language,
          eskd_sync_flag: validatedData.synchronizable,
        })
        .eq('eskd_sys_no', validatedData.eskd_sys_no)
        .eq('eskd_sys_key', validatedData.code)
        .select()
        .single();

      if (error) {
        console.error('Error updating sales area:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update sales area' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data, error: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});