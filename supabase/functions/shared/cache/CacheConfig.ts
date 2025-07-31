
import { CacheConfig } from './CacheService.ts';

/**
 * Cache configuration for different data types
 */

// Site-wide cache configurations
export const SITE_CACHE_CONFIG: Record<string, CacheConfig> = {
  SAP_CREDENTIALS: {
    memoryTtlMs: 30 * 60 * 1000,    // 30 minutes in memory
    kvTtlMs: 4 * 60 * 60 * 1000,    // 4 hours in KV
    namespace: 'site'
  },
  
  SYSTEM_CONFIG: {
    memoryTtlMs: 15 * 60 * 1000,    // 15 minutes in memory
    kvTtlMs: 2 * 60 * 60 * 1000,    // 2 hours in KV
    namespace: 'site'
  }
};

// User-specific cache configurations
export const USER_CACHE_CONFIG: Record<string, CacheConfig> = {
  SOLD_TO_PARTIES: {
    memoryTtlMs: 15 * 60 * 1000,    // 15 minutes in memory
    kvTtlMs: 60 * 60 * 1000,        // 1 hour in KV
    namespace: 'user'
  },
  
  PROFILE: {
    memoryTtlMs: 10 * 60 * 1000,    // 10 minutes in memory
    kvTtlMs: 30 * 60 * 1000,        // 30 minutes in KV
    namespace: 'user'
  },
  
  ADDRESSES: {
    memoryTtlMs: 15 * 60 * 1000,    // 15 minutes in memory
    kvTtlMs: 60 * 60 * 1000,        // 1 hour in KV
    namespace: 'user'
  },
  
  SHIP_TO_PARTIES: {
    memoryTtlMs: 15 * 60 * 1000,    // 15 minutes in memory
    kvTtlMs: 60 * 60 * 1000,        // 1 hour in KV
    namespace: 'user'
  }
};

/**
 * Helper function to create user-specific cache keys
 */
export function createUserCacheKey(userId: string, dataType: string, additionalKey?: string): string {
  const baseKey = `${userId}:${dataType}`;
  return additionalKey ? `${baseKey}:${additionalKey}` : baseKey;
}

/**
 * Helper function to create site-wide cache keys
 */
export function createSiteCacheKey(dataType: string, additionalKey?: string): string {
  return additionalKey ? `${dataType}:${additionalKey}` : dataType;
}
