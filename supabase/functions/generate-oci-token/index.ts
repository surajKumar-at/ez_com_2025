
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateTokenRequest {
  userId: string;
  email: string;
  role: string;
  soldToParties?: string[];
  preferredTerms?: {
    paymentTerms?: string;
    shippingTerms?: string;
    currency?: string;
    priceList?: string;
  };
  brandId?: string;
  expiresInMinutes?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: GenerateTokenRequest = await req.json();
    
    console.log('🔐 Generating OCI token for user:', requestData.email);

    // Create Supabase client for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', requestData.userId)
      .eq('email', requestData.email)
      .single();

    if (userError || !user) {
      console.error('❌ User validation failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid user' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    // Get user's sold-to parties if not provided
    let soldToParties = requestData.soldToParties || [];
    if (!soldToParties.length) {
      const { data: userSoldToParties, error: soldToError } = await supabase
        .from('sold_to_parties')
        .select('id')
        .eq('user_id', requestData.userId);

      if (!soldToError && userSoldToParties) {
        soldToParties = userSoldToParties.map(stp => stp.id);
      }
    }

    // Create token payload
    const now = Math.floor(Date.now() / 1000);
    const expirationMinutes = requestData.expiresInMinutes || 60; // Default 1 hour
    const tokenPayload = {
      userId: requestData.userId,
      email: requestData.email,
      role: requestData.role,
      soldToParties,
      preferredTerms: requestData.preferredTerms || {},
      brandId: requestData.brandId,
      iat: now,
      exp: now + (expirationMinutes * 60)
    };

    // Generate token (simplified - use proper JWT in production)
    const payloadJson = JSON.stringify(tokenPayload);
    
    // Generate signature (simplified - use proper HMAC in production)
    const signature = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(payloadJson + Deno.env.get('OCI_TOKEN_SECRET'))
    );
    
    const sigHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const token = btoa(payloadJson + '.' + sigHex.substring(0, 32));

    console.log('✅ OCI token generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        token,
        expiresAt: tokenPayload.exp * 1000,
        payload: tokenPayload
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Error in generate-oci-token:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
