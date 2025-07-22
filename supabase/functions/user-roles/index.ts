import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { drizzle } from 'https://esm.sh/drizzle-orm@0.29.3/postgres-js';
import postgres from 'https://esm.sh/postgres@3.4.3';
import { pgTable, varchar } from 'https://esm.sh/drizzle-orm@0.29.3/pg-core';
import { eq } from 'https://esm.sh/drizzle-orm@0.29.3';
import { z } from 'https://esm.sh/zod@3.22.4';

// Define schema directly in the edge function
const ezcUserRoles = pgTable('ezc_user_roles', {
  eurRoleNr: varchar('eur_role_nr'),
  eurRoleType: varchar('eur_role_type'),
  eurLanguage: varchar('eur_language'),
  eurRoleDescription: varchar('eur_role_description'),
  eurDeletedFlag: varchar('eur_deleted_flag'),
  eurComponent: varchar('eur_component'),
  eurBusDomain: varchar('eur_bus_domain'),
});

// Define DTOs directly in the edge function
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

// Database client function
function createDbClient(databaseUrl: string) {
  const client = postgres(databaseUrl);
  return drizzle(client);
}

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
    
    const databaseUrl = Deno.env.get('SUPABASE_DB_URL');
    if (!databaseUrl) {
      console.error('SUPABASE_DB_URL environment variable not found');
      throw new Error('Database URL not found');
    }

    console.log('Database URL found, creating connection...');
    const db = createDbClient(databaseUrl);
    const url = new URL(req.url);
    const method = req.method;

    let response: any;

    switch (method) {
      case 'GET': {
        console.log('Fetching user roles...');
        try {
          // Get all user roles - simplified query first
          const roles = await db.select().from(ezcUserRoles);
          console.log('Raw roles from DB:', roles);
          
          // Filter out deleted roles
          const activeRoles = roles.filter(role => role.eurDeletedFlag !== 'Y');
          console.log('Active roles:', activeRoles);
          
          response = {
            success: true,
            data: activeRoles,
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
        const validation = CreateUserRoleDto.safeParse(body);
        
        if (!validation.success) {
          response = {
            success: false,
            error: validation.error.errors.map(e => e.message).join(', ')
          };
          break;
        }

        const newRole = {
          ...validation.data,
          eurLanguage: 'EN',
          eurDeletedFlag: '',
          eurComponent: 'ROLE'
        };

        await db.insert(ezcUserRoles).values(newRole);
        
        response = {
          success: true,
          data: newRole,
          message: 'User role created successfully'
        };
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
        const validation = UpdateUserRoleDto.safeParse(body);
        
        if (!validation.success) {
          response = {
            success: false,
            error: validation.error.errors.map(e => e.message).join(', ')
          };
          break;
        }

        await db.update(ezcUserRoles)
          .set(validation.data)
          .where(eq(ezcUserRoles.eurRoleNr, roleNr));
        
        response = {
          success: true,
          message: 'User role updated successfully'
        };
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

        await db.update(ezcUserRoles)
          .set({ eurDeletedFlag: 'Y' })
          .where(eq(ezcUserRoles.eurRoleNr, roleNr));
        
        response = {
          success: true,
          message: 'User role deleted successfully'
        };
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