import { Redis } from 'https://deno.land/x/upstash_redis@v1.19.3/mod.ts';
// Wrap Upstash in a class for easy use:
export class UpstashService {
  redis;
  constructor(){
    this.redis = new Redis({
      url: Deno.env.get('UPSTASH_REDIS_REST_URL'),
      token: Deno.env.get('UPSTASH_REDIS_REST_TOKEN')
    });
  }
  async set(key, value) {
    // Automatically JSON stringify values
    await this.redis.set(key, JSON.stringify(value));
  }
  async get(key) {
    const raw = await this.redis.get(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch  {
        return raw;
      }
    }
    return null;
  }
  async clearAll() {
    return await this.redis.flushdb();
  }
}
export const cache_store = new UpstashService();