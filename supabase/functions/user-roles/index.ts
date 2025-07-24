import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'https://esm.sh/zod@3.23.8';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// DTO Schemas for validation
const UserRoleDto = z.object({
  eurRoleNr: z.string(),
  eurRoleType: z.enum(['E', 'S', 'C']),
  eurRoleDescription: z.string(),
  eurBusDomain: z.string(),
  eurLanguage: z.string(),
  eurDeletedFlag: z.string(),
  eurComponent: z.string(),
});

const CreateUserRoleDto = z.object({
  eurRoleNr: z.string().min(1, 'Role is required'),
  eurRoleType: z.enum(['E', 'S', 'C'], {
    required_error: 'Role type is required'
  }),
  eurRoleDescription: z.string().min(1, 'Description is required'),
  eurBusDomain: z.string().default('Sales'),
});

const UpdateUserRoleDto = CreateUserRoleDto.partial().extend({
  eurRoleNr: z.string().min(1, 'Role is required'),
});

const ApiResponse = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

// Transform database row to DTO (hide column names)
function dbRowToDto(row: any): z.infer<typeof UserRoleDto> {
  return {
    eurRoleNr: row.eur_role_nr,
    eurRoleType: row.eur_role_type,
    eurRoleDescription: row.eur_role_description,
    eurBusDomain: row.eur_bus_domain,
    eurLanguage: row.eur_language,
    eurDeletedFlag: row.eur_deleted_flag,
    eurComponent: row.eur_component,
  };
}

// Transform DTO to database row (expose column names only internally)
function dtoToDbRow(dto: any) {
  return {
    eur_role_nr: dto.eurRoleNr,
    eur_role_type: dto.eurRoleType,
    eur_role_description: dto.eurRoleDescription,
    eur_bus_domain: dto.eurBusDomain,
    eur_language: dto.eurLanguage || 'EN',
    eur_deleted_flag: dto.eurDeletedFlag || '',
    eur_component: dto.eurComponent || 'ROLE',
  };
}

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

    // Setup Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const method = req.method;

    let response: any;

    switch (method) {
      case 'GET': {
        console.log('Fetching user roles...');
        try {
          const { data: roles, error } = await supabase
            .from('ezc_user_roles')
            .select('*')
            .neq('eur_deleted_flag', 'Y');
          
          if (error) {
            throw error;
          }
          
          console.log('Roles fetched from DB:', roles);
          
          // Transform to DTOs (hide database column names)
          const dtoRoles = roles?.map(dbRowToDto) || [];
          
          response = {
            success: true,
            data: dtoRoles,
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
        try {
          const body = await req.json();
          console.log('Creating role with data:', body);
          
          // Validate input using Zod
          const validatedData = CreateUserRoleDto.parse(body);
          
          // Transform to database format
          const dbData = dtoToDbRow({
            ...validatedData,
            eurLanguage: 'EN',
            eurDeletedFlag: '',
            eurComponent: 'ROLE'
          });

          const { data: insertedRole, error } = await supabase
            .from('ezc_user_roles')
            .insert(dbData)
            .select()
            .single();

          if (error) {
            throw error;
          }

          // Transform back to DTO
          const dtoRole = dbRowToDto(insertedRole);

          response = {
            success: true,
            data: dtoRole,
            message: 'User role created successfully'
          };
        } catch (error) {
          console.error('Create error:', error);
          if (error instanceof z.ZodError) {
            response = {
              success: false,
              error: 'Validation failed',
              details: error.errors
            };
          } else {
            response = {
              success: false,
              error: `Failed to create role: ${error.message}`
            };
          }
        }
        break;
      }

      case 'PUT': {
        try {
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

          // Validate input using Zod
          const validatedData = UpdateUserRoleDto.parse(body);
          
          // Transform to database format (only include provided fields)
          const updateData: any = {};
          if (validatedData.eurRoleType) updateData.eur_role_type = validatedData.eurRoleType;
          if (validatedData.eurRoleDescription) updateData.eur_role_description = validatedData.eurRoleDescription;
          if (validatedData.eurBusDomain) updateData.eur_bus_domain = validatedData.eurBusDomain;

          const { error } = await supabase
            .from('ezc_user_roles')
            .update(updateData)
            .eq('eur_role_nr', roleNr);

          if (error) {
            throw error;
          }

          response = {
            success: true,
            message: 'User role updated successfully'
          };
        } catch (error) {
          console.error('Update error:', error);
          if (error instanceof z.ZodError) {
            response = {
              success: false,
              error: 'Validation failed',
              details: error.errors
            };
          } else {
            response = {
              success: false,
              error: `Failed to update role: ${error.message}`
            };
          }
        }
        break;
      }

      case 'DELETE': {
        try {
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
            throw error;
          }

          response = {
            success: true,
            message: 'User role deleted successfully'
          };
        } catch (error) {
          console.error('Delete error:', error);
          response = {
            success: false,
            error: `Failed to delete role: ${error.message}`
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