
import { ServiceHandler, createSuccessResponse, createErrorResponse } from '../db-base.ts';

export class ConfigService implements ServiceHandler {
  async handle(supabase: any, method: string, path: string, req: Request, user: any): Promise<Response> {
    console.log(`ConfigService: Handling ${method} ${path}`);

    if (method === 'GET' && path === '/config/logging') {
      return this.getLoggingConfig(supabase, user);
    }

    if (method === 'GET' && path === '/config/system') {
      return this.getSystemConfig(supabase, user);
    }

    if (method === 'PUT' && path === '/config/system') {
      return this.updateSystemConfig(supabase, req, user);
    }

    return createErrorResponse('Method not allowed', 405);
  }

  private async getLoggingConfig(supabase: any, user: any): Promise<Response> {
    try {
      // Return default logging configuration
      const config = {
        globalLogLevel: 'info',
        clientLogLevel: 'debug',
        userAllowTrace: false
      };

      return createSuccessResponse(config);
    } catch (error) {
      console.error('Error fetching logging config:', error);
      return createErrorResponse('Failed to fetch logging configuration');
    }
  }

  private async getSystemConfig(supabase: any, user: any): Promise<Response> {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('config_key, config_value, config_type');
      
      if (error) {
        console.error('Error fetching system config:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getSystemConfig:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async updateSystemConfig(supabase: any, req: Request, user: any): Promise<Response> {
    try {
      const body = await req.json();
      
      // Update system configuration
      const { data, error } = await supabase
        .from('system_config')
        .upsert(body.config)
        .select();
      
      if (error) {
        console.error('Error updating system config:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in updateSystemConfig:', error);
      return createErrorResponse('Internal server error');
    }
  }
}
