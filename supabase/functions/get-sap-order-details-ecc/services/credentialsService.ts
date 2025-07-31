
import { cacheService } from '../../shared/cache/CacheService.ts';
import { SITE_CACHE_CONFIG, createSiteCacheKey } from '../../shared/cache/CacheConfig.ts';

/**
 * Fetches SAP credentials from the database with caching
 * @param supabaseClient The authenticated Supabase client
 * @param brandId Optional brand ID to fetch specific credentials
 * @returns SAP credentials or null if not found
 */
export const fetchSapCredentials = async (supabaseClient: any, brandId?: number) => {
  console.log("Attempting to fetch SAP credentials with caching...");
  
  // Create cache key based on brandId
  const cacheKey = createSiteCacheKey('sap_credentials_ecc', brandId?.toString());
  
  try {
    const credentials = await cacheService.get(
      cacheKey,
      SITE_CACHE_CONFIG.SAP_CREDENTIALS,
      async () => {
        console.log('Cache MISS - fetching SAP credentials from database');
        
        let query = supabaseClient
          .from('sap_credentials')
          .select('sap_user, sap_password, server');
        
        // If brandId is provided, filter by the SAP connection associated with the brand
        if (brandId) {
          console.log(`Filtering SAP credentials for brand ID: ${brandId}`);
          // First get the brand to find its sap_connection_id
          const { data: brandData, error: brandError } = await supabaseClient
            .from('brands')
            .select('sap_connection_id')
            .eq('id', brandId)
            .single();
            
          if (!brandError && brandData && brandData.sap_connection_id) {
            console.log(`Using brand-specific SAP connection: ${brandData.sap_connection_id}`);
            query = query.eq('id', brandData.sap_connection_id);
          } else {
            console.log(`No specific SAP connection for brand ID ${brandId}, using default`);
          }
        }
        
        // Get first record or default
        query = query.limit(1).single();
        
        const { data: credentialsData, error: credentialsError } = await query;

        if (credentialsError) {
          console.error("Error fetching SAP credentials:", credentialsError);
          throw new Error("Failed to fetch SAP credentials");
        }

        if (!credentialsData) {
          console.error("No SAP credentials found in the database");
          throw new Error("No SAP credentials found");
        }

        console.log("SAP credentials retrieved successfully from database");
        return credentialsData;
      }
    );
    
    // Extract and validate credentials
    const sapUsername = credentials.sap_user;
    const sapPassword = credentials.sap_password;
    const server = "https://newdemo.answerthinkdemo.com"; // Use the specified server for ECC
    
    if (!sapUsername || !sapPassword || !server) {
      console.error("SAP credentials or connection details incomplete:", { 
        hasUsername: !!sapUsername, 
        hasPassword: !!sapPassword,
        hasServer: !!server,
      });
      return null;
    }
    
    return { sapUsername, sapPassword, server };
  } catch (error) {
    console.error("Error in fetchSapCredentials:", error);
    return null;
  }
};

/**
 * Invalidate SAP credentials cache for ECC
 */
export const invalidateSapCredentialsCache = async (brandId?: number) => {
  const cacheKey = createSiteCacheKey('sap_credentials_ecc', brandId?.toString());
  await cacheService.invalidate(cacheKey, SITE_CACHE_CONFIG.SAP_CREDENTIALS.namespace);
  console.log('SAP ECC credentials cache invalidated');
};
