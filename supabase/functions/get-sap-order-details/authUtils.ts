
import { createAuthenticatedClient } from "../_shared/supabase-client.ts";

export function validateAuthHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    console.error("No Authorization header found");
    return "No Authorization header";
  }
  return null;
}

export function createSupabaseClient(authHeader: string) {
  return createAuthenticatedClient(authHeader);
}

export async function fetchSapCredentials(supabaseClient: any) {
  console.log("Attempting to fetch SAP credentials from database...");
  
  const { data: credentialsData, error: credentialsError } = await supabaseClient
    .from('sap_credentials')
    .select('sap_user, sap_password, server, api_path')
    .limit(1)
    .single();

  if (credentialsError) {
    console.error("Error fetching SAP credentials:", credentialsError);
    throw new Error(`Failed to retrieve SAP credentials: ${credentialsError.message}`);
  }

  if (!credentialsData) {
    console.error("No SAP credentials found in the database");
    throw new Error("SAP credentials not found");
  }

  console.log("SAP credentials retrieved successfully");
  return credentialsData;
}
