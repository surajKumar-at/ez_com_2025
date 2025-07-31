
import { cacheService } from '../cache/CacheService.ts';
import { 
  AUTHORITY_CACHE_CONFIG, 
  createAuthorityCacheKey, 
  createSapAuthorityCacheKey,
  hashContext 
} from '../cache/AuthorityCacheConfig.ts';

export interface AuthorityDecision {
  allowed: boolean;
  reason?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface AuthorityContext {
  userId: string;
  resource: string;
  operation: string;
  userRoles?: string[];
  soldToId?: string;
  shipToId?: string;
  brandId?: string;
  metadata?: Record<string, any>;
}

export interface BatchAuthorityCheck {
  context: AuthorityContext;
  cacheKey: string;
}

export class AuthorityCacheService {
  /**
   * Check authority with caching
   */
  async checkAuthority(context: AuthorityContext): Promise<AuthorityDecision> {
    const contextHash = hashContext({
      userRoles: context.userRoles,
      soldToId: context.soldToId,
      shipToId: context.shipToId,
      brandId: context.brandId,
      metadata: context.metadata
    });
    
    const cacheKey = createAuthorityCacheKey(
      context.userId,
      context.resource,
      context.operation,
      contextHash
    );

    return await cacheService.get(
      cacheKey,
      AUTHORITY_CACHE_CONFIG.AUTHORITY_DECISIONS,
      () => this.executeAuthorityCheck(context)
    );
  }

  /**
   * Batch authority checks for performance
   */
  async checkBatchAuthority(contexts: AuthorityContext[]): Promise<Map<string, AuthorityDecision>> {
    const results = new Map<string, AuthorityDecision>();
    const uncachedChecks: BatchAuthorityCheck[] = [];

    // First, try to get cached results
    for (const context of contexts) {
      const contextHash = hashContext({
        userRoles: context.userRoles,
        soldToId: context.soldToId,
        shipToId: context.shipToId,
        brandId: context.brandId,
        metadata: context.metadata
      });
      
      const cacheKey = createAuthorityCacheKey(
        context.userId,
        context.resource,
        context.operation,
        contextHash
      );

      try {
        const cached = await cacheService.get(
          cacheKey,
          AUTHORITY_CACHE_CONFIG.AUTHORITY_DECISIONS,
          () => Promise.resolve(null) // Don't execute, just check cache
        );
        
        if (cached) {
          results.set(cacheKey, cached);
        } else {
          uncachedChecks.push({ context, cacheKey });
        }
      } catch {
        uncachedChecks.push({ context, cacheKey });
      }
    }

    // Execute uncached checks in parallel
    const uncachedResults = await Promise.all(
      uncachedChecks.map(async ({ context, cacheKey }) => {
        const decision = await this.executeAuthorityCheck(context);
        // Cache the result
        await cacheService.set(cacheKey, decision, AUTHORITY_CACHE_CONFIG.AUTHORITY_DECISIONS);
        return { cacheKey, decision };
      })
    );

    // Merge uncached results
    uncachedResults.forEach(({ cacheKey, decision }) => {
      results.set(cacheKey, decision);
    });

    return results;
  }

  /**
   * SAP-specific authority check with caching
   */
  async checkSapAuthority(
    userId: string,
    sapResource: string,
    operation: string,
    soldToId?: string,
    shipToId?: string,
    metadata?: Record<string, any>
  ): Promise<AuthorityDecision> {
    const cacheKey = createSapAuthorityCacheKey(userId, sapResource, soldToId, shipToId);
    
    return await cacheService.get(
      cacheKey,
      AUTHORITY_CACHE_CONFIG.SAP_AUTHORITY,
      () => this.executeSapAuthorityCheck(userId, sapResource, operation, soldToId, shipToId, metadata)
    );
  }

  /**
   * Get user roles with caching
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const cacheKey = `user_roles:${userId}`;
    
    return await cacheService.get(
      cacheKey,
      AUTHORITY_CACHE_CONFIG.USER_ROLES,
      () => this.fetchUserRoles(userId)
    );
  }

  /**
   * Invalidate authority cache for a user
   */
  async invalidateUserAuthority(userId: string): Promise<void> {
    await cacheService.invalidateNamespace(`authority:${userId}`);
    console.log(`Authority cache invalidated for user: ${userId}`);
  }

  /**
   * Invalidate all authority caches
   */
  async invalidateAllAuthority(): Promise<void> {
    await cacheService.invalidateNamespace('authority');
    console.log('All authority caches invalidated');
  }

  // Private methods for actual authority checks
  private async executeAuthorityCheck(context: AuthorityContext): Promise<AuthorityDecision> {
    const startTime = Date.now();
    
    try {
      // Get user roles if not provided
      const userRoles = context.userRoles || await this.getUserRoles(context.userId);
      
      // Execute the actual authority logic
      const decision = await this.performAuthorityLogic({
        ...context,
        userRoles
      });

      const executionTime = Date.now() - startTime;
      console.log(`Authority check executed in ${executionTime}ms for ${context.resource}:${context.operation}`);

      return {
        ...decision,
        timestamp: Date.now(),
        metadata: {
          ...decision.metadata,
          executionTime,
          cached: false
        }
      };
    } catch (error) {
      console.error('Authority check failed:', error);
      return {
        allowed: false,
        reason: 'Authority check failed',
        timestamp: Date.now(),
        metadata: { error: error.message }
      };
    }
  }

  private async executeSapAuthorityCheck(
    userId: string,
    sapResource: string,
    operation: string,
    soldToId?: string,
    shipToId?: string,
    metadata?: Record<string, any>
  ): Promise<AuthorityDecision> {
    const startTime = Date.now();
    
    try {
      // SAP-specific authority logic
      const userRoles = await this.getUserRoles(userId);
      const decision = await this.performSapAuthorityLogic(
        userId,
        sapResource,
        operation,
        userRoles,
        soldToId,
        shipToId,
        metadata
      );

      const executionTime = Date.now() - startTime;
      console.log(`SAP authority check executed in ${executionTime}ms for ${sapResource}:${operation}`);

      return {
        ...decision,
        timestamp: Date.now(),
        metadata: {
          ...decision.metadata,
          executionTime,
          cached: false,
          sapResource,
          soldToId,
          shipToId
        }
      };
    } catch (error) {
      console.error('SAP authority check failed:', error);
      return {
        allowed: false,
        reason: 'SAP authority check failed',
        timestamp: Date.now(),
        metadata: { error: error.message }
      };
    }
  }

  private async fetchUserRoles(userId: string): Promise<string[]> {
    // This would integrate with your existing user role fetching logic
    // For now, return empty array - implement based on your user role system
    console.log(`Fetching roles for user: ${userId}`);
    return [];
  }

  private async performAuthorityLogic(context: AuthorityContext): Promise<Omit<AuthorityDecision, 'timestamp'>> {
    // Implement your core authority logic here
    // This should integrate with your existing AuthorityService
    console.log(`Performing authority check for ${context.resource}:${context.operation}`);
    
    // Placeholder logic - replace with your actual implementation
    return {
      allowed: true,
      reason: 'Authority check passed'
    };
  }

  private async performSapAuthorityLogic(
    userId: string,
    sapResource: string,
    operation: string,
    userRoles: string[],
    soldToId?: string,
    shipToId?: string,
    metadata?: Record<string, any>
  ): Promise<Omit<AuthorityDecision, 'timestamp'>> {
    // Implement your SAP-specific authority logic here
    console.log(`Performing SAP authority check for ${sapResource}:${operation}`);
    
    // Placeholder logic - replace with your actual SAP authority implementation
    return {
      allowed: true,
      reason: 'SAP authority check passed'
    };
  }
}

// Global authority cache service instance
export const authorityCacheService = new AuthorityCacheService();
