import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { drizzle } from 'https://esm.sh/drizzle-orm@0.44.3/postgres-js';
import postgres from 'https://esm.sh/postgres@3.4.7';
import { pgTable, varchar } from 'https://esm.sh/drizzle-orm@0.44.3/pg-core';
import { eq, and } from 'https://esm.sh/drizzle-orm@0.44.3';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Schema definition
const ezcCustomer = pgTable('ezc_customer', {
  ecNo: varchar('ec_no'),
  ecErpCustNo: varchar('ec_erp_cust_no'),
  ecPartnerFunction: varchar('ec_partner_function'),
});

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

    // Create database connection
    const databaseUrl = Deno.env.get('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured');
    }

    const client = postgres(databaseUrl);
    const db = drizzle(client);

    // Check if customer exists
    const existingCustomer = await db
      .select({ ecNo: ezcCustomer.ecNo })
      .from(ezcCustomer)
      .where(
        and(
          eq(ezcCustomer.ecErpCustNo, soldTo),
          eq(ezcCustomer.ecPartnerFunction, 'AG')
        )
      )
      .limit(1);

    const customerExists = existingCustomer.length > 0;

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