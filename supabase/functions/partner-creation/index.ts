import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const partnerCreationSchema = z.object({
  ebpc_company_name: z.string().min(1),
  ebpc_description: z.string().optional(),
  ebpc_catalog_no: z.string().min(1),
  ebpc_unlimited_users: z.boolean().default(false),
  ebpc_number_of_users: z.number().int().min(1).optional(),
  ebpc_intranet_business_partner: z.boolean().default(false),
  ebpc_is_serves_partner: z.boolean().optional(),
});

const updatePartnerCreationSchema = partnerCreationSchema.partial().extend({
  ebpc_id: z.number().int().positive(),
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

    if (req.method === 'GET') {
      const path = url.pathname;
      
      // GET /partner-creation/catalogs - Get catalog options
      if (path.endsWith('/catalogs')) {
        console.log('Fetching catalog options');
        
        const { data, error } = await supabase
          .from('ezc_catalog_group')
          .select('ecg_catalog_no, ecg_sys_key, ecg_product_group')
          .eq('ecg_index_indicator', 'Y')
          .order('ecg_catalog_no');

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
      
      // GET /partner-creation - Get all partner creations
      console.log('Fetching partner creations');
      
      const { data, error } = await supabase
        .from('ezc_business_partner_creation')
        .select('*')
        .order('ebpc_created_at', { ascending: false });

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
      console.log('Creating partner creation:', body);
      
      const validatedData = partnerCreationSchema.parse(body);
      
      // Add created_by field
      const dataToInsert = {
        ...validatedData,
        ebpc_created_by: user.email || user.id
      };
      
      const { data, error } = await supabase
        .from('ezc_business_partner_creation')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, data, message: 'Partner creation submitted successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'PUT') {
      const body = await req.json();
      console.log('Updating partner creation:', body);
      
      const validatedData = updatePartnerCreationSchema.parse(body);
      const { ebpc_id, ...updateData } = validatedData;
      
      const { data, error } = await supabase
        .from('ezc_business_partner_creation')
        .update(updateData)
        .eq('ebpc_id', ebpc_id)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, data, message: 'Partner creation updated successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'DELETE') {
      const body = await req.json();
      const { ebpc_id } = body;
      console.log('Deleting partner creation:', ebpc_id);
      
      const { error } = await supabase
        .from('ezc_business_partner_creation')
        .delete()
        .eq('ebpc_id', ebpc_id);

      if (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'Partner creation deleted successfully' }), {
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