
import { supabaseAdmin } from '../../_shared/supabase-client.ts';
import { corsHeaders } from '../../_shared/cors.ts';

export const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader) {
    console.error('No authorization header present');
    return {
      error: {
        message: 'No authorization header present',
        status: 401
      },
      user: null
    };
  }

  // Use shared Supabase client
  const supabaseClient = supabaseAdmin;

  // Verify the user's JWT
  const { data: userData, error: authError } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  console.log('Auth verification result:', authError ? 'Error' : 'Success');
    
  if (authError || !userData.user) {
    console.error('Invalid authorization token:', authError);
    return {
      error: {
        message: `Invalid authorization token: ${authError?.message}`,
        status: 401
      },
      user: null
    };
  }

  console.log('Authenticated user:', userData.user.email);
  return { user: userData.user, error: null };
};
