
export interface CacheEntry {
  decision: any;
  timestamp: number;
  ttl: number;
}

export class AuthorityCacheService {
  private kv: Deno.Kv | null = null;
  private fallbackCache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  async initialize(): Promise<void> {
    try {
      this.kv = await Deno.openKv();
      console.log('Deno KV initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize Deno KV, using fallback cache:', error.message);
      this.kv = null;
    }
  }

  generateCacheKey(userId: string, resource: string, operation: string, context?: Record<string, any>): string {
    const contextHash = context ? this.hashContext(context) : 'nocx';
    return `authority:${userId}:${resource}:${operation}:${contextHash}`;
  }

  private hashContext(context: Record<string, any>): string {
    const sorted = Object.keys(context).sort().map(key => `${key}:${JSON.stringify(context[key])}`).join('|');
    return btoa(sorted).slice(-8); // Use last 8 chars of base64 encoded sorted context
  }

  async get(cacheKey: string): Promise<any | null> {
    try {
      if (this.kv) {
        const entry = await this.kv.get([cacheKey]);
        if (entry.value) {
          const cacheEntry = entry.value as CacheEntry;
          if (Date.now() - cacheEntry.timestamp < cacheEntry.ttl) {
            console.log(`KV Cache HIT: ${cacheKey}`);
            return {
              ...cacheEntry.decision,
              metadata: { ...cacheEntry.decision.metadata, cached: true, source: 'kv' }
            };
          } else {
            // Expired entry, delete it
            await this.kv.delete([cacheKey]);
            console.log(`KV Cache EXPIRED: ${cacheKey}`);
          }
        }
      } else {
        // Fallback to in-memory cache
        const entry = this.fallbackCache.get(cacheKey);
        if (entry && (Date.now() - entry.timestamp) < entry.ttl) {
          console.log(`Memory Cache HIT: ${cacheKey}`);
          return {
            ...entry.decision,
            metadata: { ...entry.decision.metadata, cached: true, source: 'memory' }
          };
        } else if (entry) {
          this.fallbackCache.delete(cacheKey);
        }
      }
      
      console.log(`Cache MISS: ${cacheKey}`);
      return null;
    } catch (error) {
      console.error(`Cache get error for ${cacheKey}:`, error);
      return null;
    }
  }

  async set(cacheKey: string, decision: any, ttl?: number): Promise<void> {
    const effectiveTtl = ttl || this.DEFAULT_TTL;
    const cacheEntry: CacheEntry = {
      decision: { ...decision, metadata: { ...decision.metadata, cached: false } },
      timestamp: Date.now(),
      ttl: effectiveTtl
    };

    try {
      if (this.kv) {
        await this.kv.set([cacheKey], cacheEntry, { expireIn: effectiveTtl });
        console.log(`KV Cache SET: ${cacheKey} (TTL: ${effectiveTtl}ms)`);
      } else {
        this.fallbackCache.set(cacheKey, cacheEntry);
        console.log(`Memory Cache SET: ${cacheKey} (TTL: ${effectiveTtl}ms)`);
      }
    } catch (error) {
      console.error(`Cache set error for ${cacheKey}:`, error);
    }
  }

  async invalidateUser(userId: string): Promise<number> {
    let invalidatedCount = 0;

    try {
      if (this.kv) {
        // List all entries with the user prefix
        const prefix = `authority:${userId}:`;
        const iter = this.kv.list({ prefix: [prefix] });
        
        for await (const entry of iter) {
          await this.kv.delete(entry.key);
          invalidatedCount++;
        }
        console.log(`KV Cache invalidated ${invalidatedCount} entries for user: ${userId}`);
      } else {
        // Fallback to in-memory cache
        const prefix = `authority:${userId}:`;
        for (const [key] of this.fallbackCache) {
          if (key.startsWith(prefix)) {
            this.fallbackCache.delete(key);
            invalidatedCount++;
          }
        }
        console.log(`Memory Cache invalidated ${invalidatedCount} entries for user: ${userId}`);
      }
    } catch (error) {
      console.error(`Cache invalidation error for user ${userId}:`, error);
    }

    return invalidatedCount;
  }

  async clear(): Promise<void> {
    try {
      if (this.kv) {
        // Clear all authority cache entries
        const iter = this.kv.list({ prefix: ["authority:"] });
        for await (const entry of iter) {
          await this.kv.delete(entry.key);
        }
        console.log('KV Cache cleared all authority entries');
      } else {
        this.fallbackCache.clear();
        console.log('Memory Cache cleared all entries');
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async getStats(): Promise<{ size: number; type: string; storage: string }> {
    try {
      if (this.kv) {
        let size = 0;
        const iter = this.kv.list({ prefix: ["authority:"] });
        for await (const _entry of iter) {
          size++;
        }
        return {
          size,
          type: 'deno-kv',
          storage: 'persistent'
        };
      } else {
        return {
          size: this.fallbackCache.size,
          type: 'in-memory',
          storage: 'volatile'
        };
      }
    } catch (error) {
      console.error('Cache stats error:', error);
      return {
        size: 0,
        type: 'error',
        storage: 'unknown'
      };
    }
  }

  async cleanup(): Promise<number> {
    if (this.kv) {
      // Deno KV handles expiration automatically
      return 0;
    }

    // Manual cleanup for fallback cache
    let cleanedCount = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.fallbackCache) {
      if (now - entry.timestamp >= entry.ttl) {
        this.fallbackCache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired cache entries`);
    }
    
    return cleanedCount;
  }
}
