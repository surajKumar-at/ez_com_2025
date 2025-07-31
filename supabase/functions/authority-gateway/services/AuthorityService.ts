
export interface AuthorityContext {
  userRoles?: string[];
  soldToId?: string;
  shipToId?: string;
  brandId?: string;
  metadata?: Record<string, any>;
}

export interface AuthorityDecision {
  allowed: boolean;
  reason?: string;
  metadata?: Record<string, any>;
}

export class AuthorityService {
  makeDecision(
    userId: string,
    resource: string,
    operation: string,
    userRoles: string[] = [],
    context?: AuthorityContext
  ): AuthorityDecision {
    console.log(`Making authority decision for ${resource}:${operation} (user: ${userId.slice(0, 8)}...)`);
    
    const startTime = Date.now();
    
    // Enhanced authorization logic
    let allowed = false;
    let reason = 'Access denied';

    // Admin role gets access to everything
    if (userRoles.includes('admin')) {
      allowed = true;
      reason = 'Admin access granted';
    }
    // Content admin gets access to content operations including full product CRUD
    else if (userRoles.includes('content-admin')) {
      if (resource === 'products') {
        allowed = true;
        reason = 'Content admin product access granted';
      }
      else if (resource.includes('news') || resource.includes('content')) {
        allowed = true;
        reason = 'Content admin content access granted';
      }
    }
    // Customer role gets basic access
    else if (userRoles.includes('customer') || userRoles.length === 0) {
      // Allow basic read operations for customers
      if (operation === 'read' && (resource === 'products' || resource === 'news' || resource === 'orders')) {
        allowed = true;
        reason = 'Customer read access granted';
      }
      // Allow order creation
      else if (operation === 'create' && resource === 'orders') {
        allowed = true;
        reason = 'Customer order creation allowed';
      }
      // Allow SAP customer data access if they have soldToId
      else if (resource.startsWith('sap:') && context?.soldToId) {
        allowed = true;
        reason = 'SAP customer access granted';
      }
      // Allow cache test operations
      else if (resource === 'cache-test') {
        allowed = true;
        reason = 'Cache test allowed';
      }
      // Allow test operations
      else if (resource === 'test') {
        allowed = true;
        reason = 'Test access allowed';
      }
    }

    const executionTime = Date.now() - startTime;
    console.log(`Authority decision made in ${executionTime}ms: ${allowed ? 'ALLOWED' : 'DENIED'}`);

    return {
      allowed,
      reason,
      metadata: {
        resource,
        operation,
        userRoles,
        executionTime,
        timestamp: new Date().toISOString(),
        cached: false,
        context: context ? Object.keys(context) : []
      }
    };
  }
}
