import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const url = new URL(req.url);
    const method = req.method;

    console.log(`[${method}] ${url.pathname}`);

    if (method === 'GET') {
      // Get all users from ezc_users
      const { data: users, error } = await supabase
        .from('ezc_users')
        .select(`
          eu_id,
          eu_email,
          eu_first_name,
          eu_last_name,
          eu_type,
          eu_business_partner,
          eu_deletion_flag,
          eu_created_date,
          supabase_user_id
        `)
        .eq('eu_deletion_flag', 'N');

      if (error) {
        console.error('Error fetching users:', error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get user roles for each user
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          const { data: roles } = await supabase
            .from('ezc_user_roles')
            .select('*')
            .eq('eur_deleted_flag', '');
          
          const { data: userAuth } = await supabase
            .from('ezc_user_auth')
            .select('*')
            .eq('eua_user_id', user.eu_id);

          return {
            ...user,
            roles: roles || [],
            permissions: userAuth || []
          };
        })
      );

      return new Response(
        JSON.stringify({ success: true, data: usersWithRoles }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'POST') {
      const requestData = await req.json();
      const { action } = requestData;

      if (action === 'migrate-existing-users') {
        console.log('Starting migration of existing EZC users to Supabase Auth...');

        // Get all users from ezc_users that don't have supabase_user_id
        const { data: ezcUsers, error: fetchError } = await supabase
          .from('ezc_users')
          .select('*')
          .eq('eu_deletion_flag', 'N')
          .is('supabase_user_id', null);

        if (fetchError) {
          console.error('Error fetching EZC users:', fetchError);
          return new Response(
            JSON.stringify({ success: false, error: fetchError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Found ${ezcUsers.length} users to migrate`);

        const migrationResults = [];
        
        for (const ezcUser of ezcUsers) {
          try {
            // Create user in Supabase Auth with default password "portal"
            const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
              email: ezcUser.eu_email,
              password: 'portal',
              email_confirm: true,
              user_metadata: {
                first_name: ezcUser.eu_first_name,
                last_name: ezcUser.eu_last_name,
                eu_id: ezcUser.eu_id,
                eu_type: ezcUser.eu_type
              }
            });

            if (createError) {
              console.error(`Error creating auth user for ${ezcUser.eu_email}:`, createError);
              migrationResults.push({
                eu_id: ezcUser.eu_id,
                email: ezcUser.eu_email,
                success: false,
                error: createError.message
              });
              continue;
            }

            // Update ezc_users with supabase_user_id
            const { error: updateError } = await supabase
              .from('ezc_users')
              .update({ supabase_user_id: authUser.user.id })
              .eq('eu_id', ezcUser.eu_id);

            if (updateError) {
              console.error(`Error updating ezc_users for ${ezcUser.eu_email}:`, updateError);
              migrationResults.push({
                eu_id: ezcUser.eu_id,
                email: ezcUser.eu_email,
                success: false,
                error: updateError.message
              });
              continue;
            }

            migrationResults.push({
              eu_id: ezcUser.eu_id,
              email: ezcUser.eu_email,
              success: true,
              supabase_user_id: authUser.user.id
            });

            console.log(`Successfully migrated user: ${ezcUser.eu_email}`);
          } catch (error) {
            console.error(`Unexpected error migrating ${ezcUser.eu_email}:`, error);
            migrationResults.push({
              eu_id: ezcUser.eu_id,
              email: ezcUser.eu_email,
              success: false,
              error: error.message
            });
          }
        }

        const successCount = migrationResults.filter(r => r.success).length;
        const failureCount = migrationResults.filter(r => !r.success).length;

        console.log(`Migration completed: ${successCount} successful, ${failureCount} failed`);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Migration completed: ${successCount} successful, ${failureCount} failed`,
            results: migrationResults
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'create-user') {
        const { 
          email, 
          password = 'portal', 
          firstName, 
          lastName, 
          userType,
          roles = [],
          businessPartner,
          sysKey = '999001',
          soldTo,
          authKeys = []
        } = requestData;

        console.log('Creating new user:', { email, firstName, lastName, userType });

        // Generate next user ID and business partner ID if needed
        const { data: userIdResult } = await supabase.rpc('generate_next_user_id');
        const newUserId = userIdResult;

        let newBusinessPartner = businessPartner;
        if (userType === 3 && !businessPartner) {
          const { data: bpResult } = await supabase.rpc('generate_next_business_partner_id');
          newBusinessPartner = bpResult;
        }

        // Create user in Supabase Auth
        const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            eu_id: newUserId,
            eu_type: userType
          }
        });

        if (createError) {
          console.error('Error creating auth user:', createError);
          return new Response(
            JSON.stringify({ success: false, error: createError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Insert into ezc_users
        const { error: userInsertError } = await supabase
          .from('ezc_users')
          .insert({
            eu_id: newUserId,
            eu_deletion_flag: 'N',
            eu_first_name: firstName,
            eu_last_name: lastName,
            eu_email: email,
            eu_created_date: new Date().toLocaleDateString('en-US'),
            eu_changed_date: new Date().toLocaleDateString('en-US'),
            eu_changed_by: 'SYSTEM',
            eu_valid_to_date: '01/31/99',
            eu_last_login_time: '00:00:00',
            eu_last_login_date: new Date().toLocaleDateString('en-US'),
            eu_password: 'X[d)H,P@X[F-O.O.f|j$2{K@', // Encrypted placeholder
            eu_type: userType,
            eug_id: 0,
            eu_business_partner: newBusinessPartner || '',
            eu_is_built_in_user: 'N',
            supabase_user_id: authUser.user.id
          });

        if (userInsertError) {
          console.error('Error inserting into ezc_users:', userInsertError);
          // Rollback: delete the auth user
          await supabase.auth.admin.deleteUser(authUser.user.id);
          return new Response(
            JSON.stringify({ success: false, error: userInsertError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // If customer type (3), create related records
        if (userType === 3) {
          // Insert into EZC_BUSS_PARTNER_AUTH
          await supabase
            .from('ezc_buss_partner_auth')
            .insert({
              ebpa_buss_partner: newBusinessPartner,
              ebpa_sys_no: 999,
              ebpa_auth_key: 'SALES_SYS_DEP',
              ebpa_auth_value: 'Sales System Dependent Role',
              ebpa_role_or_auth: ' '
            });

          // Insert into EZC_CUSTOMER
          const customerNo = `C${newBusinessPartner}`;
          await supabase
            .from('ezc_customer')
            .insert({
              ec_no: customerNo,
              ec_sys_key: sysKey,
              ec_partner_function: 'AG',
              ec_partner_no: `S${newBusinessPartner.slice(-5)}`,
              ec_erp_cust_no: `S${newBusinessPartner.slice(-5)}`,
              ec_business_partner: newBusinessPartner,
              ec_deletion_flag: 'N'
            });

          // Insert into EZC_CUSTOMER_ADDR
          await supabase
            .from('ezc_customer_addr')
            .insert({
              eca_no: customerNo,
              eca_lang: 'EN',
              eca_reference_no: 10,
              eca_name: `${firstName} ${lastName}`,
              eca_company_name: `${firstName} ${lastName} COMPANY`,
              eca_phone: '000000',
              eca_email: email,
              eca_web_addr: 'company.com',
              eca_addr_1: 'Address Line 1',
              eca_addr_2: 'null',
              eca_city: 'City',
              eca_state: 'State',
              eca_pin: '12345',
              eca_country: 'US',
              eca_ship_addr_1: '000000',
              eca_ship_addr_2: '000000',
              eca_ship_city: 'City',
              eca_ship_state: ' ',
              eca_ship_pin: ' ',
              eca_ship_country: ' ',
              eca_is_business_partner: 'N',
              eca_deletion_flag: ' ',
              eca_title: '',
              eca_pobox: '',
              eca_pobox_city: 'City',
              eca_district: '',
              eca_transort_zone: '0000000001',
              eca_jurisdiction_code: 'USST123450000',
              eca_incoterms: '1',
              eca_payment_terms: '123',
              eca_block_code: 'A',
              eca_account_group: 'Y001',
              eca_ext1: 'PR',
              eca_ship_cond: '',
              eca_street2: 'null'
            });

          // Insert into EZC_WF_WORKGROUP_USERS
          await supabase
            .from('ezc_wf_workgroup_users')
            .insert({
              ewwu_group: 'CUSTGRP',
              ewwu_user: newUserId,
              ewwu_syskey: sysKey,
              ewwu_sold_to: soldTo || `S${newBusinessPartner.slice(-5)}`,
              ewwu_effective_from: new Date('2000-01-01'),
              ewwu_effective_to: new Date('2999-01-01')
            });
        }

        // Insert user defaults
        if (userType === 3) {
          await supabase
            .from('ezc_user_defaults')
            .insert({
              eud_user_id: newUserId,
              eud_sys_key: ' ',
              eud_key: 'USERCATALOG',
              eud_value: '14960',
              eud_default_flag: 'N'
            });
        }

        // Insert user roles and auth
        for (const roleNr of roles) {
          await supabase
            .from('ezc_user_auth')
            .insert({
              eua_user_id: newUserId,
              eua_sys_no: 999,
              eua_auth_key: 'SALES_SYS_DEP',
              eua_auth_value: 'Sales System Dependent Role',
              eua_role_or_auth: 'R'
            });
        }

        // Insert additional auth keys
        for (const authKey of authKeys) {
          await supabase
            .from('ezc_user_auth')
            .insert({
              eua_user_id: newUserId,
              eua_sys_no: 999,
              eua_auth_key: authKey.key,
              eua_auth_value: authKey.value,
              eua_role_or_auth: 'A'
            });
        }

        console.log(`Successfully created user: ${email} with ID: ${newUserId}`);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'User created successfully',
            data: {
              eu_id: newUserId,
              email,
              supabase_user_id: authUser.user.id,
              business_partner: newBusinessPartner
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'block-user' || action === 'unblock-user') {
        const { userId } = requestData;
        const block = action === 'block-user';

        // Update ezc_users deletion flag
        const { error: updateError } = await supabase
          .from('ezc_users')
          .update({ eu_deletion_flag: block ? 'Y' : 'N' })
          .eq('eu_id', userId);

        if (updateError) {
          console.error(`Error ${action} user:`, updateError);
          return new Response(
            JSON.stringify({ success: false, error: updateError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `User ${block ? 'blocked' : 'unblocked'} successfully`
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'delete-user') {
        const { userId } = requestData;

        // Get the user to find supabase_user_id
        const { data: user, error: fetchError } = await supabase
          .from('ezc_users')
          .select('supabase_user_id')
          .eq('eu_id', userId)
          .single();

        if (fetchError) {
          console.error('Error fetching user:', fetchError);
          return new Response(
            JSON.stringify({ success: false, error: fetchError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Delete from auth.users (this will cascade to profiles)
        if (user.supabase_user_id) {
          const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.supabase_user_id);
          if (authDeleteError) {
            console.error('Error deleting auth user:', authDeleteError);
          }
        }

        // Set deletion flag to Y instead of hard delete to maintain referential integrity
        const { error: deleteError } = await supabase
          .from('ezc_users')
          .update({ eu_deletion_flag: 'Y' })
          .eq('eu_id', userId);

        if (deleteError) {
          console.error('Error deleting user:', deleteError);
          return new Response(
            JSON.stringify({ success: false, error: deleteError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'User deleted successfully'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});