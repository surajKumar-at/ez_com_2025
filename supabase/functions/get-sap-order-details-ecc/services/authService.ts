
import { createAuthenticatedClient } from "../../_shared/supabase-client.ts";

/**
 * Verifies the authentication header and creates an authenticated Supabase client
 * @param authHeader The Authorization header from the request
 * @returns Authenticated Supabase client or null if authentication fails
 */
export const createAuthenticatedClientWithLogging = (authHeader: string | null) => {
  if (!authHeader) {
    console.error("No Authorization header found");
    return null;
  }

  console.log("Authorization header found:", authHeader ? "Yes" : "No");
  
  return createAuthenticatedClient(authHeader);
};

// Export for backwards compatibility
export { createAuthenticatedClient };

/**
 * Retrieves the SAP sold-to ID associated with the given sold-to ID
 * @param supabaseClient The authenticated Supabase client
 * @param soldToId The sold-to ID to look up
 * @returns The SAP sold-to ID or the original sold-to ID if not found
 */
export const getSapSoldToId = async (supabaseClient: any, soldToId: string) => {
  let sapSoldToId = soldToId;
  
  try {
    // Try to fetch the sap_sold_to_id from the sold_to_parties table
    const { data: soldToData, error: soldToError } = await supabaseClient
      .from('sold_to_parties')
      .select('sap_sold_to_id')
      .eq('id', soldToId)
      .single();
    
    if (soldToError) {
      console.error("Error fetching sap_sold_to_id:", soldToError);
    } else if (soldToData && soldToData.sap_sold_to_id) {
      console.log(`Found sap_sold_to_id: ${soldToData.sap_sold_to_id} for sold_to_id: ${soldToId}`);
      sapSoldToId = soldToData.sap_sold_to_id;
    } else {
      console.log(`No sap_sold_to_id found for sold_to_id: ${soldToId}, using sold_to_id as fallback`);
    }
  } catch (error) {
    console.error("Error in sap_sold_to_id lookup:", error);
  }
  
  return sapSoldToId;
};
