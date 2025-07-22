import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createDbClient } from '../../../src/lib/db/client.ts';
import { ezcUserRoles } from '../../../src/lib/db/schema.ts';
import { CreateUserRoleDto, UpdateUserRoleDto, ApiResponse } from '../../../src/lib/dto/userRole.dto.ts';
import { eq } from 'https://esm.sh/drizzle-orm@0.44.3';

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
    const databaseUrl = Deno.env.get('SUPABASE_DB_URL');
    if (!databaseUrl) {
      throw new Error('Database URL not found');
    }

    const db = createDbClient(databaseUrl);
    const url = new URL(req.url);
    const method = req.method;

    let response: ApiResponse;

    switch (method) {
      case 'GET': {
        // Get all user roles
        const roles = await db.select().from(ezcUserRoles)
          .where(eq(ezcUserRoles.eurDeletedFlag, ''));
        
        response = {
          success: true,
          data: roles,
          message: 'User roles retrieved successfully'
        };
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
    console.error('Error:', error);
    
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});