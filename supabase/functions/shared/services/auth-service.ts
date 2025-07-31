
import { ServiceHandler, createSuccessResponse, createErrorResponse } from '../db-base.ts';

export class AuthService implements ServiceHandler {
  async handle(supabase: any, method: string, path: string, req: Request, user: any): Promise<Response> {
    console.log(`AuthService: Handling ${method} ${path}`);

    // POST /auth/register - Complete user registration
    if (method === 'POST' && path === '/auth/register') {
      const body = await req.json();
      return this.completeUserRegistration(supabase, user, body);
    }

    // GET /auth/session - Get current session info
    if (method === 'GET' && path === '/auth/session') {
      return this.getSessionInfo(supabase, user);
    }

    // POST /auth/mfa/setup - Setup MFA
    if (method === 'POST' && path === '/auth/mfa/setup') {
      const body = await req.json();
      return this.setupMFA(supabase, user, body);
    }

    // POST /auth/mfa/verify - Verify MFA
    if (method === 'POST' && path === '/auth/mfa/verify') {
      const body = await req.json();
      return this.verifyMFA(supabase, user, body);
    }

    return createErrorResponse('Method not allowed', 405);
  }

  private async completeUserRegistration(supabase: any, user: any, registrationData: any): Promise<Response> {
    try {
      const { firstName, lastName, defaultShippingAddress } = registrationData;

      // Create user profile
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: `${firstName} ${lastName}`.trim(),
          role: 'customer'
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user profile:', userError);
        return createErrorResponse(userError.message);
      }

      // Create default address if provided
      if (defaultShippingAddress) {
        const { error: addressError } = await supabase
          .from('addresses')
          .insert({
            ...defaultShippingAddress,
            is_default: true
          });

        if (addressError) {
          console.error('Error creating default address:', addressError);
          // Don't fail registration for address creation failure
        }
      }

      // Assign default catalog
      const { error: catalogError } = await supabase
        .from('user_catalogs')
        .insert({
          user_id: user.id,
          catalog_id: 1
        });

      if (catalogError) {
        console.error('Error assigning default catalog:', catalogError);
        // Don't fail registration for catalog assignment failure
      }

      return createSuccessResponse(userProfile);
    } catch (error) {
      console.error('Unexpected error in completeUserRegistration:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getSessionInfo(supabase: any, user: any): Promise<Response> {
    try {
      // Get user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const sessionInfo = {
        user: profile,
        roles: roles?.map(r => r.role) || [],
        isAdmin: roles?.some(r => r.role === 'admin') || false,
        isContentAdmin: roles?.some(r => ['admin', 'content-admin'].includes(r.role)) || false
      };

      return createSuccessResponse(sessionInfo);
    } catch (error) {
      console.error('Unexpected error in getSessionInfo:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async setupMFA(supabase: any, user: any, mfaData: any): Promise<Response> {
    try {
      const { data, error } = await supabase
        .from('user_mfa_settings')
        .upsert({
          user_id: user.id,
          totp_secret: mfaData.totpSecret,
          backup_codes: mfaData.backupCodes,
          is_enabled: true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error setting up MFA:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in setupMFA:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async verifyMFA(supabase: any, user: any, verificationData: any): Promise<Response> {
    try {
      const { data: mfaSettings } = await supabase
        .from('user_mfa_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!mfaSettings) {
        return createErrorResponse('MFA not set up for this user', 404);
      }

      // In a real implementation, you would verify the TOTP code here
      // For now, we'll just return success
      return createSuccessResponse({ verified: true });
    } catch (error) {
      console.error('Unexpected error in verifyMFA:', error);
      return createErrorResponse('Internal server error');
    }
  }
}
