import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Create a shared Supabase client for edge functions
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Service role client for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Anonymous client for public operations
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Create authenticated client with user token
export const createAuthenticatedClient = (authHeader: string | null) => {
  if (!authHeader) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
  });
};

// Validate auth header and return authenticated client
export const validateAuth = async (authHeader: string | null) => {
  if (!authHeader) {
    throw new Error("No Authorization header");
  }

  const client = createAuthenticatedClient(authHeader);
  if (!client) {
    throw new Error("Failed to create authenticated client");
  }

  return client;
};