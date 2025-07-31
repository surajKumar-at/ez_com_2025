
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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

  // Create Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  console.log('Supabase URL available:', supabaseUrl ? 'Yes' : 'No');
  console.log('Supabase Key available:', supabaseKey ? 'Yes' : 'No');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment');
    return {
      error: {
        message: 'Server configuration error',
        status: 500
      },
      user: null
    };
  }
  
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

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
