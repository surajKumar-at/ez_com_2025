import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Processing request:', req.method, req.url);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Import Supabase client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.3');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const method = req.method;

    let response: any;

    switch (method) {
      case 'GET': {
        console.log('Fetching user roles...');
        try {
          // Query the EZC_USER_ROLES table directly using Supabase client
          const { data: roles, error } = await supabase
            .from('ezc_user_roles')
            .select('*')
            .neq('eur_deleted_flag', 'Y');
          
          if (error) {
            console.error('Supabase query error:', error);
            throw error;
          }

          console.log('Roles fetched:', roles);
          
          response = {
            success: true,
            data: roles || [],
            message: 'User roles retrieved successfully'
          };
        } catch (dbError) {
          console.error('Database error:', dbError);
          response = {
            success: false,
            error: `Database error: ${dbError.message}`
          };
        }
        break;
      }

      case 'POST': {
        // Create new user role
        const body = await req.json();
        console.log('Creating role with data:', body);
        
        // Basic validation
        if (!body.eurRoleNr || !body.eurRoleType || !body.eurRoleDescription) {
          response = {
            success: false,
            error: 'Missing required fields: eurRoleNr, eurRoleType, eurRoleDescription'
          };
          break;
        }

        const newRole = {
          eur_role_nr: body.eurRoleNr,
          eur_role_type: body.eurRoleType,
          eur_role_description: body.eurRoleDescription,
          eur_bus_domain: body.eurBusDomain || 'Sales',
          eur_language: 'EN',
          eur_deleted_flag: '',
          eur_component: 'ROLE'
        };

        const { data, error } = await supabase
          .from('ezc_user_roles')
          .insert([newRole])
          .select();

        if (error) {
          console.error('Insert error:', error);
          response = {
            success: false,
            error: `Failed to create role: ${error.message}`
          };
        } else {
          response = {
            success: true,
            data: data[0],
            message: 'User role created successfully'
          };
        }
        break;
      }

      case 'PUT': {
        // Update user role
        const roleNr = url.searchParams.get('roleNr');
        if (!roleNr) {
          response = {
            success: false,
            error: 'Role number is required'
          };
          break;
        }

        const body = await req.json();
        console.log('Updating role:', roleNr, 'with data:', body);

        const updateData: any = {};
        if (body.eurRoleType) updateData.eur_role_type = body.eurRoleType;
        if (body.eurRoleDescription) updateData.eur_role_description = body.eurRoleDescription;
        if (body.eurBusDomain) updateData.eur_bus_domain = body.eurBusDomain;

        const { error } = await supabase
          .from('ezc_user_roles')
          .update(updateData)
          .eq('eur_role_nr', roleNr);

        if (error) {
          console.error('Update error:', error);
          response = {
            success: false,
            error: `Failed to update role: ${error.message}`
          };
        } else {
          response = {
            success: true,
            message: 'User role updated successfully'
          };
        }
        break;
      }

      case 'DELETE': {
        // Soft delete user role
        const roleNr = url.searchParams.get('roleNr');
        if (!roleNr) {
          response = {
            success: false,
            error: 'Role number is required'
          };
          break;
        }

        console.log('Deleting role:', roleNr);

        const { error } = await supabase
          .from('ezc_user_roles')
          .update({ eur_deleted_flag: 'Y' })
          .eq('eur_role_nr', roleNr);

        if (error) {
          console.error('Delete error:', error);
          response = {
            success: false,
            error: `Failed to delete role: ${error.message}`
          };
        } else {
          response = {
            success: true,
            message: 'User role deleted successfully'
          };
        }
        break;
      }

      default:
        response = {
          success: false,
          error: 'Method not allowed'
        };
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: response.success ? 200 : 400,
    });

  } catch (error) {
    console.error('Edge function error:', error);
    console.error('Error stack:', error.stack);
    
    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      details: error instanceof Error ? error.stack : 'Unknown error'
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});