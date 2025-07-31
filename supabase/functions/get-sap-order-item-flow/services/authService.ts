
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export const validateAuth = async (authHeader: string | null) => {
  if (!authHeader) {
    throw new Error("No Authorization header");
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: authHeader },
      },
    }
  );

  return supabaseClient;
};
