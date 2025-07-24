import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Request validation schema
const requestSchema = z.object({
  soldTo: z.string().min(1, 'Sold To is required'),
});

serve(async (req) => {
  console.log(`Check Customer Exists endpoint: ${req.method}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    const { soldTo } = requestSchema.parse(body);

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Check if customer exists
    const { data: existingCustomer, error: dbError } = await supabase
      .from('ezc_customer')
      .select('ec_no')
      .eq('ec_erp_cust_no', soldTo)
      .eq('ec_partner_function', 'AG')
      .maybeSingle();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to check existing customer');
    }

    const customerExists = !!existingCustomer;

    console.log(`Customer ${soldTo} exists: ${customerExists}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        exists: customerExists,
        soldTo 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in check customer exists function:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid request data',
          details: error.errors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});