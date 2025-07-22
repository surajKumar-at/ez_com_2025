import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { drizzle } from 'https://esm.sh/drizzle-orm@0.44.3/postgres-js';
import postgres from 'https://esm.sh/postgres@3.4.7';
import { pgTable, varchar } from 'https://esm.sh/drizzle-orm@0.44.3/pg-core';
import { eq, ne } from 'https://esm.sh/drizzle-orm@0.44.3';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Database schema
const ezcUserRoles = pgTable('ezc_user_roles', {
  eurRoleNr: varchar('eur_role_nr'),
  eurRoleType: varchar('eur_role_type'),
  eurLanguage: varchar('eur_language'),
  eurRoleDescription: varchar('eur_role_description'),
  eurDeletedFlag: varchar('eur_deleted_flag'),
  eurComponent: varchar('eur_component'),
  eurBusDomain: varchar('eur_bus_domain'),
});

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

// Transform database row to DTO
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

// Transform DTO to database row
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
    
    const databaseUrl = Deno.env.get('SUPABASE_DB_URL');
    if (!databaseUrl) {
      throw new Error('Missing database configuration');
    }

    // Create database connection
    const client = postgres(databaseUrl);
    const db = drizzle(client);

    const url = new URL(req.url);
    const method = req.method;

    let response: any;

    switch (method) {
      case 'GET': {
        console.log('Fetching user roles...');
        try {
          const roles = await db
            .select()
            .from(ezcUserRoles)
            .where(ne(ezcUserRoles.eurDeletedFlag, 'Y'));
          
          console.log('Roles fetched from DB:', roles);
          
          // Transform to DTOs
          const dtoRoles = roles.map(dbRowToDto);
          
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

          const [newRole] = await db
            .insert(ezcUserRoles)
            .values(dbData)
            .returning();

          // Transform back to DTO
          const dtoRole = dbRowToDto(newRole);

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

          await db
            .update(ezcUserRoles)
            .set(updateData)
            .where(eq(ezcUserRoles.eurRoleNr, roleNr));

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

          await db
            .update(ezcUserRoles)
            .set({ eur_deleted_flag: 'Y' })
            .where(eq(ezcUserRoles.eurRoleNr, roleNr));

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