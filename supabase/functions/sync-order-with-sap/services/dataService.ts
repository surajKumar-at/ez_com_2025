
import { supabase } from '../utils/supabase.ts';
import { cacheService } from '../../shared/cache/CacheService.ts';
import { SITE_CACHE_CONFIG, createSiteCacheKey } from '../../shared/cache/CacheConfig.ts';

export async function fetchOrderDetails(orderId: string) {
  console.log('Fetching order details from Supabase:', orderId);
  
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      id, 
      po_number,
      sold_to_id,
      ship_to_id,
      sold_to_parties(name, sap_sold_to_id),
      ship_to_parties(name),
      order_items(product_id, name, quantity, price, products(sap_product_code))
    `)
    .eq('id', orderId)
    .single();
  
  if (orderError) {
    console.error('Error fetching order:', JSON.stringify(orderError, null, 2));
    throw new Error('Error fetching order details');
  }
  
  // Process the order items to include the SAP product code
  if (order && order.order_items) {
    order.order_items = order.order_items.map((item: any) => {
      return {
        ...item,
        product_sap_code: item.products?.sap_product_code || 'FG226'
      };
    });
  }
  
  console.log('Order data retrieved:', JSON.stringify(order, null, 2));
  return order;
}

export async function fetchSapCredentials() {
  console.log('Fetching SAP credentials with caching');
  
  const cacheKey = createSiteCacheKey('sap_credentials');
  
  try {
    const sapCreds = await cacheService.get(
      cacheKey,
      SITE_CACHE_CONFIG.SAP_CREDENTIALS,
      async () => {
        console.log('Cache MISS - fetching SAP credentials from database');
        
        const { data: sapCreds, error: sapCredsError } = await supabase
          .from('sap_credentials')
          .select('*')
          .limit(1)
          .single();
        
        if (sapCredsError) {
          console.error('Error fetching SAP credentials:', JSON.stringify(sapCredsError, null, 2));
          throw new Error('SAP credentials not found');
        }
        
        console.log('SAP credentials retrieved successfully from database');
        return sapCreds;
      }
    );
    
    return sapCreds;
  } catch (error) {
    console.error('Error in fetchSapCredentials:', error);
    throw error;
  }
}

/**
 * Invalidate SAP credentials cache
 */
export async function invalidateSapCredentialsCache() {
  const cacheKey = createSiteCacheKey('sap_credentials');
  await cacheService.invalidate(cacheKey, SITE_CACHE_CONFIG.SAP_CREDENTIALS.namespace);
  console.log('SAP credentials cache invalidated');
}
