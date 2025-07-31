
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
    console.log('🔄 Starting payment intent creation');

    // Secure authentication verification
    const { user, error: authError } = await secureVerifyAuth(req.headers.get('Authorization'));
    if (authError) {
      console.error('❌ Auth error:', authError);
      return new Response(JSON.stringify(authError), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: authError.status,
      });
    }

    console.log('✅ User authenticated:', user.id);

    const body = await req.json();
    console.log('📋 Request body keys:', Object.keys(body));
    
    const { amount, currency = 'usd', orderId, cart, soldTo, shipTo, sapPricing } = body;

    // Validate required fields
    if (!amount || !orderId) {
      console.error('❌ Missing required fields:', { amount: !!amount, orderId: !!orderId });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: amount, orderId',
        status: 400 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`✅ Creating Stripe payment intent for order: ${orderId}`);
    console.log(`💰 Amount: ${amount} cents (${currency})`);

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.error('❌ STRIPE_SECRET_KEY not configured');
      return new Response(JSON.stringify({ 
        error: 'Payment system not configured',
        status: 500 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Create Supabase client with service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if customer exists
    let customerId = null;
    if (user.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log('✅ Found existing Stripe customer:', customerId);
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: soldTo?.name || user.email,
          metadata: {
            user_id: user.id,
            order_id: orderId
          }
        });
        customerId = customer.id;
        console.log('✅ Created new Stripe customer:', customerId);
      }
    }

    // Create payment intent
    console.log('🔄 Creating Stripe payment intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount should already be in cents
      currency: currency.toLowerCase(),
      customer: customerId,
      metadata: {
        order_id: orderId,
        user_id: user.id,
        sold_to_id: soldTo?.id || '',
        ship_to_id: shipTo?.id || '',
      },
      description: `Payment for Order ${orderId}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('✅ Stripe payment intent created:', paymentIntent.id);

    // Create payment record in database using service role - FIX: Use 'checkout' instead of 'inline'
    console.log('🔄 Creating payment record...');
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        payment_type: 'checkout', // Changed from 'inline' to 'checkout'
        payment_provider: 'stripe',
        reference_id: orderId,
        amount: amount / 100, // Convert back to dollars
        currency: currency.toUpperCase(),
        provider_payment_id: paymentIntent.id,
        payment_status: 'pending',
        user_id: user.id,
        provider_metadata: {
          stripe_payment_intent_id: paymentIntent.id,
          stripe_customer_id: customerId,
          order_metadata: {
            order_id: orderId,
            cart,
            soldTo,
            shipTo,
            sapPricing
          }
        }
      })
      .select()
      .single();

    if (paymentError) {
      console.error('⚠️ Error creating payment record:', paymentError);
      // Don't fail the payment intent creation, but log the error
    } else {
      console.log('✅ Payment record created:', paymentRecord?.id);
    }

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentId: paymentRecord?.id
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      },
      status: 200,
    });

  } catch (error) {
    console.error('💥 Stripe payment intent creation error:', error);
    
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
