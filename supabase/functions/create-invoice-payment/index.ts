
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { secureVerifyAuth } from "../_shared/secureAuth.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Secure authentication verification
    const { user, error: authError } = await secureVerifyAuth(req.headers.get('Authorization'));
    if (authError) {
      return new Response(JSON.stringify(authError), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: authError.status,
      });
    }

    const body = await req.json();
    const { invoiceId, amount, currency = 'USD', invoiceData } = body;

    // Validate required fields
    if (!invoiceId || !amount) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: invoiceId, amount',
        status: 400 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`Creating Stripe payment for invoice: ${invoiceId}, amount: ${amount}`);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Create payment intent for invoice
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        invoice_id: invoiceId,
        user_id: user.id,
        payment_type: 'invoice',
        invoice_data: invoiceData ? JSON.stringify(invoiceData) : null,
      },
      description: `Payment for SAP Invoice ${invoiceId}`,
    });

    // Record payment in database
    const { error: insertError } = await supabaseClient
      .from('invoice_payments')
      .insert({
        invoice_id: invoiceId,
        user_id: user.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: parseFloat(amount),
        currency: currency,
        payment_status: 'pending',
      });

    if (insertError) {
      console.error('Error recording invoice payment:', insertError);
      return new Response(JSON.stringify({
        error: 'Failed to record payment',
        status: 500
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Also record in stripe_payments table
    await supabaseClient
      .from('stripe_payments')
      .insert({
        stripe_payment_intent_id: paymentIntent.id,
        user_id: user.id,
        amount: parseFloat(amount),
        currency: currency,
        payment_status: 'pending',
        payment_type: 'invoice',
        reference_id: invoiceId,
        metadata: {
          invoice_data: invoiceData,
        },
      });

    return new Response(JSON.stringify({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      invoiceId: invoiceId
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      },
      status: 200,
    });

  } catch (error) {
    console.error('Invoice payment creation error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message,
      status: 500
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
