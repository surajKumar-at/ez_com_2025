
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Create a client with the user's token to verify they are logged in
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 2. Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized. Invalid token.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 3. Get request body
    const { firstName, lastName, defaultShippingAddress } = await req.json()
    if (!firstName || !lastName) {
      return new Response(JSON.stringify({ error: 'First name and last name are required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 4. Create admin client to bypass RLS, using the service role key from secrets
    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 5. Insert into `users` table
    const name = `${firstName} ${lastName}`.trim();
    const { data: userData, error: profileError } = await adminSupabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name,
        role: 'customer'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error inserting user profile:', profileError);
      return new Response(JSON.stringify({ error: 'Failed to create user profile.', details: profileError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // 6. If shipping address provided, create it
    let shippingAddressId = null;
    if (defaultShippingAddress && Object.keys(defaultShippingAddress).length > 0) {
      try {
        const { data: addressData, error: addressError } = await adminSupabase
          .from('addresses')
          .insert({
            user_id: user.id,
            name: defaultShippingAddress.name,
            street: defaultShippingAddress.street,
            city: defaultShippingAddress.city,
            state: defaultShippingAddress.state,
            zip: defaultShippingAddress.zip,
            country: defaultShippingAddress.country,
            is_default: defaultShippingAddress.isDefault
          })
          .select('id')
          .single();

        if (addressError) throw addressError;
        shippingAddressId = addressData.id;

      } catch (addressError) {
        console.error('Error creating shipping address in edge function:', addressError);
      }
    }

    // 7. Update user with address ID if created
    if (shippingAddressId) {
      const { error: updateError } = await adminSupabase
        .from('users')
        .update({ default_shipping_address_id: shippingAddressId })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating user with address ID in edge function:', updateError);
      }
    }

    return new Response(JSON.stringify({ success: true, user: userData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Error in complete-user-registration function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
