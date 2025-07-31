
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
    console.log('🔄 Starting checkout session creation');

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
    console.log('📋 Full request body:', JSON.stringify(body, null, 2));
    
    const { orderId, cart, soldTo, shipTo, sapPricing } = body;

    // Validate required fields
    if (!orderId || !cart || !soldTo || !shipTo) {
      console.error('❌ Missing required fields:', { orderId: !!orderId, cart: !!cart, soldTo: !!soldTo, shipTo: !!shipTo });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: orderId, cart, soldTo, shipTo',
        status: 400 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Validate cart has items
    if (!cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
      console.error('❌ Cart is empty or invalid:', cart);
      return new Response(JSON.stringify({ 
        error: 'Cart is empty or invalid',
        status: 400 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`✅ Creating Stripe checkout session for order: ${orderId}`);
    console.log(`📦 Cart has ${cart.items.length} items`);

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

    // Calculate line items from cart with better error handling
    console.log('💰 Processing cart items:', cart.items?.length || 0);
    const lineItems = cart.items.map((item: any, index: number) => {
      console.log(`📦 Processing item ${index}:`, JSON.stringify(item, null, 2));
      
      const sapItem = sapPricing?.items?.find((si: any) => si.material === item.sapProductCode);
      let unitPrice = 0;
      
      if (sapItem && sapItem.netValue && sapItem.quantity) {
        unitPrice = sapItem.netValue / sapItem.quantity;
        console.log(`💰 Using SAP pricing for item ${index}: ${unitPrice}`);
      } else if (item.price && item.price > 0) {
        unitPrice = item.price;
        console.log(`💰 Using item price for item ${index}: ${unitPrice}`);
      } else if (item.visiblePrice && item.visiblePrice > 0) {
        unitPrice = item.visiblePrice;
        console.log(`💰 Using visible price for item ${index}: ${unitPrice}`);
      } else {
        // Fallback to a minimum price to prevent $0 items
        unitPrice = 1.00;
        console.log(`⚠️ No price found for item ${index}, using fallback: ${unitPrice}`);
      }
      
      // Ensure price is at least $0.50 (Stripe minimum)
      if (unitPrice < 0.50) {
        unitPrice = 0.50;
        console.log(`⚠️ Price too low for item ${index}, adjusted to: ${unitPrice}`);
      }
      
      const quantity = item.quantity || 1;
      const productName = item.name || item.productName || `Product ${item.productId || 'Unknown'}`;
      
      console.log(`📦 Final item ${index}: ${productName} - Price: $${unitPrice} x ${quantity}`);
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            metadata: {
              product_id: item.productId?.toString() || '',
              sap_product_code: item.sapProductCode || '',
            },
          },
          unit_amount: Math.round(unitPrice * 100), // Convert to cents
        },
        quantity: quantity,
      };
    });

    console.log(`✅ Created ${lineItems.length} line items`);
    
    // Validate that we have line items
    if (lineItems.length === 0) {
      console.error('❌ No valid line items created');
      return new Response(JSON.stringify({ 
        error: 'No valid products in cart',
        status: 400 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Calculate total amount for logging
    const totalAmount = lineItems.reduce((sum: number, item: any) => {
      return sum + (item.price_data.unit_amount * item.quantity);
    }, 0);

    console.log(`💰 Total amount: $${totalAmount / 100}`);
    console.log(`📋 Line items to send to Stripe:`, JSON.stringify(lineItems, null, 2));

    // Create order metadata for Stripe
    const orderMetadata = {
      order_id: orderId,
      user_id: user.id,
      sold_to_id: soldTo.id,
      ship_to_id: shipTo.id,
      cart_items: JSON.stringify(cart.items),
      sap_pricing: sapPricing ? JSON.stringify(sapPricing) : null,
    };

    // Create Stripe checkout session
    console.log('🔄 Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order/${orderId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout?payment=cancelled`,
      metadata: orderMetadata,
      customer_email: user.email,
      billing_address_collection: 'required',
    });

    console.log('✅ Stripe session created:', session.id);

    // Create payment record in database using service role
    console.log('🔄 Creating payment record...');
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        payment_type: 'checkout',
        payment_provider: 'stripe',
        reference_id: orderId,
        amount: totalAmount / 100, // Convert back to dollars
        currency: 'USD',
        provider_payment_id: session.id,
        payment_status: 'pending',
        user_id: user.id,
        provider_metadata: {
          stripe_session_id: session.id,
          stripe_payment_intent_id: null, // Will be updated after payment
          order_metadata: orderMetadata
        }
      })
      .select()
      .single();

    if (paymentError) {
      console.error('⚠️ Error creating payment record:', paymentError);
      // Don't fail the checkout creation, but log the error
    } else {
      console.log('✅ Payment record created:', paymentRecord?.id);
    }

    // Update order with Stripe session ID using service role
    console.log('🔄 Updating order with Stripe session...');
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        stripe_session_id: session.id,
        payment_type: 'credit_card',
        order_metadata: orderMetadata,
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('❌ Error updating order with Stripe session:', updateError);
      return new Response(JSON.stringify({
        error: 'Failed to update order with payment session',
        status: 500
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log('✅ Order updated successfully');

    return new Response(JSON.stringify({
      sessionId: session.id,
      sessionUrl: session.url,
      orderId: orderId,
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
    console.error('💥 Stripe checkout session creation error:', error);
    
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
