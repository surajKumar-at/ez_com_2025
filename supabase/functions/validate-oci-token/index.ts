
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OciUserToken {
  userId: string;
  email: string;
  role: string;
  soldToParties: string[];
  preferredTerms: {
    paymentTerms?: string;
    shippingTerms?: string;
    currency?: string;
    priceList?: string;
  };
  brandId?: string;
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    console.log('🔐 Validating OCI token...');

    // Create Supabase client for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Decode and validate the token
    // In a real implementation, you would use a proper JWT library
    // For now, we'll implement a simple base64 decode with validation
    let tokenData: OciUserToken;
    
    try {
      // Simple token format: base64(JSON + signature)
      // In production, use proper JWT with RSA/HMAC signing
      const decoded = atob(token);
      const [payload, signature] = decoded.split('.');
      
      // Validate signature (simplified - use proper HMAC in production)
      const expectedSignature = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(payload + Deno.env.get('OCI_TOKEN_SECRET'))
      );
      
      const expectedSigHex = Array.from(new Uint8Array(expectedSignature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      if (signature !== expectedSigHex.substring(0, 32)) {
        throw new Error('Invalid token signature');
      }
      
      tokenData = JSON.parse(payload);
      
    } catch (error) {
      console.error('❌ Token decode error:', error);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid token format' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    // Validate token expiration
    if (tokenData.exp * 1000 < Date.now()) {
      console.error('❌ Token expired');
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Token expired' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    // Validate user exists and is active
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', tokenData.userId)
      .eq('email', tokenData.email)
      .single();

    if (userError || !user) {
      console.error('❌ User validation failed:', userError);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid user' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    // Validate sold-to parties if specified
    if (tokenData.soldToParties && tokenData.soldToParties.length > 0) {
      const { data: soldToParties, error: soldToError } = await supabase
        .from('sold_to_parties')
        .select('id')
        .eq('user_id', tokenData.userId)
        .in('id', tokenData.soldToParties);

      if (soldToError || !soldToParties || soldToParties.length !== tokenData.soldToParties.length) {
        console.error('❌ Sold-to parties validation failed:', soldToError);
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'Invalid sold-to parties' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401
          }
        );
      }
    }

    console.log('✅ Token validated successfully for user:', tokenData.email);

    return new Response(
      JSON.stringify({
        valid: true,
        payload: tokenData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Error in validate-oci-token:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
