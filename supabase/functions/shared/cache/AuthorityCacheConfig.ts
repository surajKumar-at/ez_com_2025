
import { CacheConfig } from './CacheService.ts';

/**
 * Authority-specific cache configurations
 */
export const AUTHORITY_CACHE_CONFIG: Record<string, CacheConfig> = {
  // Basic authority decisions - frequently accessed, short TTL for security
  AUTHORITY_DECISIONS: {
    memoryTtlMs: 5 * 60 * 1000,      // 5 minutes in memory
    kvTtlMs: 15 * 60 * 1000,         // 15 minutes in KV
    namespace: 'authority'
  },
  
  // Authority rules - less frequently changed, longer TTL
  AUTHORITY_RULES: {
    memoryTtlMs: 30 * 60 * 1000,     // 30 minutes in memory
    kvTtlMs: 2 * 60 * 60 * 1000,     // 2 hours in KV
    namespace: 'authority'
  },
  
  // SAP-specific authority - business critical, shorter TTL
  SAP_AUTHORITY: {
    memoryTtlMs: 3 * 60 * 1000,      // 3 minutes in memory
    kvTtlMs: 10 * 60 * 1000,         // 10 minutes in KV
    namespace: 'authority'
  },
  
  // User role caching - changes infrequently
  USER_ROLES: {
    memoryTtlMs: 15 * 60 * 1000,     // 15 minutes in memory
    kvTtlMs: 60 * 60 * 1000,         // 1 hour in KV
    namespace: 'authority'
  }
};

/**
 * Helper function to create authority cache keys
 */
export function createAuthorityCacheKey(
  userId: string,
  resource: string,
  operation: string,
  contextHash?: string
): string {
  const baseKey = `${userId}:${resource}:${operation}`;
  return contextHash ? `${baseKey}:${contextHash}` : baseKey;
}

/**
 * Helper function to create SAP authority cache keys
 */
export function createSapAuthorityCacheKey(
  userId: string,
  sapResource: string,
  soldToId?: string,
  shipToId?: string
): string {
  let key = `sap:${userId}:${sapResource}`;
  if (soldToId) key += `:soldto:${soldToId}`;
  if (shipToId) key += `:shipto:${shipToId}`;
  return key;
}

/**
 * Helper function to hash context objects for consistent cache keys
 */
export function hashContext(context: Record<string, any>): string {
  const normalized = JSON.stringify(context, Object.keys(context).sort());
  // Simple hash function for cache keys
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
