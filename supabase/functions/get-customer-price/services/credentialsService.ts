
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { cacheService } from '../../shared/cache/CacheService.ts';
import { SITE_CACHE_CONFIG, createSiteCacheKey } from '../../shared/cache/CacheConfig.ts';

export const getSapCredentials = async (supabaseClient: any, brandId?: number) => {
  console.log('Fetching SAP credentials with caching');
  
  // Create cache key based on brandId
  const cacheKey = createSiteCacheKey('sap_credentials', brandId?.toString());
  
  try {
    // Use cache service with fallback to database
    const credentials = await cacheService.get(
      cacheKey,
      SITE_CACHE_CONFIG.SAP_CREDENTIALS,
      async () => {
        console.log('Cache MISS - fetching SAP credentials from database');
        
        let query = supabaseClient
          .from('sap_credentials')
          .select('*');
        
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
        
        const { data: sapCredentials, error: credError } = await query;

        if (credError) {
          console.error('Error fetching SAP credentials:', credError);
          throw new Error(`Failed to retrieve SAP credentials: ${credError.message}`);
        }
        
        if (!sapCredentials) {
          console.error('No SAP credentials found in database');
          throw new Error('No SAP credentials found');
        }
        
        console.log('Successfully retrieved SAP credentials from database');
        return sapCredentials;
      }
    );
    
    return { credentials, error: null };
  } catch (error) {
    console.error('Error in getSapCredentials:', error);
    return {
      error: {
        message: error.message || 'Failed to retrieve SAP credentials',
        status: 500
      },
      credentials: null
    };
  }
};

/**
 * Invalidate SAP credentials cache
 */
export const invalidateSapCredentialsCache = async (brandId?: number) => {
  const cacheKey = createSiteCacheKey('sap_credentials', brandId?.toString());
  await cacheService.invalidate(cacheKey, SITE_CACHE_CONFIG.SAP_CREDENTIALS.namespace);
  console.log('SAP credentials cache invalidated');
};
