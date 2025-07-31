// cache_auth.ts
import { cache_store } from './cache_store.ts';
export class CacheAuth {
  // Check user authorizations (array stored as auth:${userId})
  async hasAuthorization(userId, authorizationKey) {
    const key = `auth:${userId}`;
    const authorizations = await cache_store.get(key);
    //console.log(authorizations);
    //console.log(key);
    if (Array.isArray(authorizations)) {
      return authorizations.includes(authorizationKey);
    }
    return false;
  }
  // Check user roles (array stored as roles:${userId})
  async hasRole(userId, role) {
    const key = `roles:${userId}`;
    const roles = await cache_store.get(key);
    if (Array.isArray(roles)) {
      return roles.includes(role);
    }
    return false;
  }
}
// Singleton for easy use elsewhere
export const cache_auth = new CacheAuth();
