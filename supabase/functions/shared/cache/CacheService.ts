
/**
 * Hybrid caching service using both in-memory and Deno KV storage
 * Provides automatic fallback: Memory Cache -> Deno KV -> Source Function
 */

export interface CacheConfig {
  memoryTtlMs: number;    // TTL for in-memory cache
  kvTtlMs: number;        // TTL for Deno KV cache
  namespace: string;      // Cache key namespace
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheMetrics {
  memoryHits: number;
  memoryMisses: number;
  kvHits: number;
  kvMisses: number;
  sourceHits: number;
}

export class CacheService {
  private memoryCache = new Map<string, CacheItem<any>>();
  private kv: Deno.Kv | null = null;
  private metrics: CacheMetrics = {
    memoryHits: 0,
    memoryMisses: 0,
    kvHits: 0,
    kvMisses: 0,
    sourceHits: 0
  };

  constructor() {
    this.initializeKv();
    // Clean up expired memory cache entries every 5 minutes
    setInterval(() => this.cleanupMemoryCache(), 5 * 60 * 1000);
  }

  private async initializeKv(): Promise<void> {
    try {
      this.kv = await Deno.openKv();
      console.log('Deno KV initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Deno KV:', error);
    }
  }

  private buildCacheKey(namespace: string, key: string): string {
    return `${namespace}:${key}`;
  }

  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key);
      }
    }
    console.log(`Memory cache cleanup completed. Current size: ${this.memoryCache.size}`);
  }

  /**
   * Get data from cache with automatic fallback to source function
   */
  async get<T>(
    key: string,
    config: CacheConfig,
    sourceFunction: () => Promise<T>
  ): Promise<T> {
    const cacheKey = this.buildCacheKey(config.namespace, key);
    const now = Date.now();

    // 1. Try memory cache first
    const memoryItem = this.memoryCache.get(cacheKey);
    if (memoryItem && !this.isExpired(memoryItem)) {
      this.metrics.memoryHits++;
      console.log(`Cache HIT (memory): ${cacheKey}`);
      return memoryItem.data;
    }
    this.metrics.memoryMisses++;

    // 2. Try Deno KV cache
    if (this.kv) {
      try {
        const kvResult = await this.kv.get<CacheItem<T>>([cacheKey]);
        if (kvResult.value && !this.isExpired(kvResult.value)) {
          this.metrics.kvHits++;
          console.log(`Cache HIT (KV): ${cacheKey}`);
          
          // Store in memory cache for faster subsequent access
          this.memoryCache.set(cacheKey, {
            data: kvResult.value.data,
            timestamp: now,
            ttl: config.memoryTtlMs
          });
          
          return kvResult.value.data;
        }
      } catch (error) {
        console.error(`KV cache error for ${cacheKey}:`, error);
      }
    }
    this.metrics.kvMisses++;

    // 3. Fallback to source function
    console.log(`Cache MISS: ${cacheKey} - fetching from source`);
    this.metrics.sourceHits++;
    
    try {
      const data = await sourceFunction();
      
      // Store in both caches
      await this.set(key, data, config);
      
      return data;
    } catch (error) {
      console.error(`Source function error for ${cacheKey}:`, error);
      throw error;
    }
  }

  /**
   * Set data in both memory and KV cache
   */
  async set<T>(key: string, data: T, config: CacheConfig): Promise<void> {
    const cacheKey = this.buildCacheKey(config.namespace, key);
    const now = Date.now();

    // Store in memory cache
    this.memoryCache.set(cacheKey, {
      data,
      timestamp: now,
      ttl: config.memoryTtlMs
    });

    // Store in KV cache
    if (this.kv) {
      try {
        const kvItem: CacheItem<T> = {
          data,
          timestamp: now,
          ttl: config.kvTtlMs
        };
        
        await this.kv.set([cacheKey], kvItem);
        console.log(`Data cached: ${cacheKey}`);
      } catch (error) {
        console.error(`Failed to cache in KV for ${cacheKey}:`, error);
      }
    }
  }

  /**
   * Invalidate cache for a specific key
   */
  async invalidate(key: string, namespace: string): Promise<void> {
    const cacheKey = this.buildCacheKey(namespace, key);
    
    // Remove from memory cache
    this.memoryCache.delete(cacheKey);
    
    // Remove from KV cache
    if (this.kv) {
      try {
        await this.kv.delete([cacheKey]);
        console.log(`Cache invalidated: ${cacheKey}`);
      } catch (error) {
        console.error(`Failed to invalidate KV cache for ${cacheKey}:`, error);
      }
    }
  }

  /**
   * Invalidate all cache entries for a namespace
   */
  async invalidateNamespace(namespace: string): Promise<void> {
    const prefix = `${namespace}:`;
    
    // Remove from memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }
    
    // Remove from KV cache
    if (this.kv) {
      try {
        // List all keys with the namespace prefix
        const iter = this.kv.list({ prefix: [namespace] });
        const deletePromises: Promise<void>[] = [];
        
        for await (const entry of iter) {
          deletePromises.push(this.kv.delete(entry.key));
        }
        
        await Promise.all(deletePromises);
        console.log(`Cache namespace invalidated: ${namespace}`);
      } catch (error) {
        console.error(`Failed to invalidate KV namespace ${namespace}:`, error);
      }
    }
  }

  /**
   * Get cache metrics for monitoring
   */
  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset cache metrics
   */
  resetMetrics(): void {
    this.metrics = {
      memoryHits: 0,
      memoryMisses: 0,
      kvHits: 0,
      kvMisses: 0,
      sourceHits: 0
    };
  }

  /**
   * Get cache status information
   */
  getStatus(): {
    memoryCacheSize: number;
    kvInitialized: boolean;
    metrics: CacheMetrics;
  } {
    return {
      memoryCacheSize: this.memoryCache.size,
      kvInitialized: this.kv !== null,
      metrics: this.getMetrics()
    };
  }
}

// Global cache service instance
export const cacheService = new CacheService();
