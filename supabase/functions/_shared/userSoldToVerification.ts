
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Verifies that a user has access to a specific soldToId
 * 
 * @param apiKey - The API key used for authentication
 * @param soldToId - The soldToId to check access for
 * @param supabaseUrl - The Supabase project URL
 * @param supabaseServiceKey - The Supabase service role key
 * @returns Object containing verification result and details
 */
export async function verifyUserSoldToAccess(
  apiKey: string,
  soldToId: string,
  supabaseUrl: string,
  supabaseServiceKey: string
) {
  try {
    console.log(`Verifying access for soldToId: ${soldToId} with API key: ${apiKey.substring(0, 10)}...`);
    
    if (!apiKey || !soldToId) {
      console.log('Missing required parameters for verification');
      return { 
        verified: false, 
        error: 'Missing required parameters for verification',
        status: 400 
      };
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user_id associated with the API key
    const { data: apiKeyData, error: apiKeyError } = await supabaseAdmin
      .from('api_keys')
      .select('user_id, active')
      .eq('key', apiKey)
      .single();

    if (apiKeyError || !apiKeyData) {
      console.error('API key validation failed:', apiKeyError?.message || 'No data returned');
      return { 
        verified: false, 
        error: 'Invalid API key',
        status: 401 
      };
    }

    if (!apiKeyData.active) {
      console.log('API key is inactive');
      return { 
        verified: false, 
        error: 'API key is inactive',
        status: 401 
      };
    }

    const userId = apiKeyData.user_id;
    console.log(`Found user ID: ${userId} for API key`);

    // Check if the user has access to the provided soldToId
    const { data: soldToData, error: soldToError } = await supabaseAdmin
      .from('sold_to_parties')
      .select('id')
      .eq('user_id', userId)
      .eq('sap_sold_to_id', soldToId)
      .maybeSingle();

    if (soldToError) {
      console.error('Error checking user-soldTo association:', soldToError.message);
      return { 
        verified: false, 
        error: 'Error verifying access permissions',
        status: 500 
      };
    }

    if (!soldToData) {
      console.log(`User ${userId} does not have access to soldToId ${soldToId}`);
      return { 
        verified: false, 
        error: 'You do not have access to this sold-to party',
        status: 403 
      };
    }

    console.log(`Verification successful: User ${userId} has access to soldToId ${soldToId}`);
    return { 
      verified: true, 
      userId, 
      soldToId 
    };
  } catch (error) {
    console.error('Unexpected error during user-soldTo verification:', error);
    return { 
      verified: false, 
      error: 'Internal server error during verification',
      status: 500 
    };
  }
}
