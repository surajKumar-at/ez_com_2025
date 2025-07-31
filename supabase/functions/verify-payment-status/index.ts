
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
    const { sessionId, paymentIntentId, orderId } = body;

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    let paymentStatus = 'pending';
    let paymentMethodId = null;
    let paymentIntentIdFromSession = null;

    if (sessionId) {
      console.log('Verifying checkout session:', sessionId);
      
      // Verify checkout session for order payments
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === 'paid') {
        paymentStatus = 'completed';
        paymentMethodId = session.payment_method;
        paymentIntentIdFromSession = session.payment_intent;

        // Update payment record
        const { error: updatePaymentError } = await supabaseClient
          .from('payments')
          .update({
            payment_status: 'completed',
            provider_auth_code: paymentMethodId,
            processed_at: new Date().toISOString(),
            provider_metadata: {
              stripe_session_id: sessionId,
              stripe_payment_intent_id: paymentIntentIdFromSession,
              stripe_payment_method_id: paymentMethodId
            }
          })
          .eq('provider_payment_id', sessionId)
          .eq('user_id', user.id);

        if (updatePaymentError) {
          console.error('Error updating payment record:', updatePaymentError);
        } else {
          console.log('Payment record updated successfully for session:', sessionId);
        }

        // Update order payment status
        if (orderId) {
          const { error: updateOrderError } = await supabaseClient
            .from('orders')
            .update({
              status: 'paid'
            })
            .eq('id', orderId)
            .eq('user_id', user.id);

          if (updateOrderError) {
            console.error('Error updating order status:', updateOrderError);
          }
        }
      }
    } else if (paymentIntentId) {
      console.log('Verifying payment intent:', paymentIntentId);
      
      // Verify payment intent for direct payments
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        paymentStatus = 'completed';
        paymentMethodId = paymentIntent.payment_method;

        // Update payment record by payment intent ID
        const { error: updatePaymentError } = await supabaseClient
          .from('payments')
          .update({
            payment_status: 'completed',
            provider_auth_code: paymentMethodId,
            processed_at: new Date().toISOString(),
            provider_metadata: {
              stripe_payment_intent_id: paymentIntentId,
              stripe_payment_method_id: paymentMethodId
            }
          })
          .eq('provider_payment_id', paymentIntentId)
          .eq('user_id', user.id);

        if (updatePaymentError) {
          console.error('Error updating payment record:', updatePaymentError);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      paymentStatus,
      paymentMethodId,
      verified: paymentStatus === 'completed',
      sessionId,
      paymentIntentId: paymentIntentIdFromSession || paymentIntentId
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      },
      status: 200,
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    
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
