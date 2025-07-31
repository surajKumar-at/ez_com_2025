
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const secureVerifyAuth = async (authHeader: string | null) => {
  if (!authHeader) {
    return {
      user: null,
      error: {
        message: 'No authorization header present',
        status: 401
      }
    };
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (error || !data.user) {
      return {
        user: null,
        error: {
          message: 'Invalid authorization token',
          status: 401
        }
      };
    }

    return { user: data.user, error: null };
  } catch (error) {
    return {
      user: null,
      error: {
        message: 'Error verifying authentication',
        status: 401
      }
    };
  }
};

export const validateAndSanitizeInput = (input: string, maxLength: number): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input.trim().slice(0, maxLength);
};
