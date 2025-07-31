
export interface EdgeAuthorityRequest {
  userId: string;
  userRoles: string[];
  resource: string;
  action: string;
  resourceId?: string;
  context?: any;
}

export interface EdgeAuthorityResult {
  allowed: boolean;
  reason: string;
}

export class EdgeAuthorityHelper {
  
  async checkAuthority(request: EdgeAuthorityRequest): Promise<EdgeAuthorityResult> {
    const { userId, userRoles, resource, action, resourceId, context } = request;
    
    console.log(`Edge authority check: ${resource}:${action} for user ${userId.substring(0, 8)}...`);
    console.log(`User roles: ${JSON.stringify(userRoles)}`);
    
    // Handle anonymous users (no userId or empty userId)
    if (!userId || userId === '') {
      console.log('Edge authority result: DENIED - Anonymous user attempting write operation');
      return {
        allowed: false,
        reason: 'Authentication required'
      };
    }
    
    // Admin users have full access to everything
    if (userRoles.includes('admin')) {
      console.log('Edge authority result: ALLOWED - Admin access granted');
      return {
        allowed: true,
        reason: 'Admin access granted'
      };
    }
    
    // Content admin users have access to content management
    if (userRoles.includes('content-admin')) {
      if (resource === 'products' && ['create', 'update', 'delete', 'read'].includes(action)) {
        console.log('Edge authority result: ALLOWED - Content admin access granted for products');
        return {
          allowed: true,
          reason: 'Content admin access granted'
        };
      }
      
      if (resource === 'news' && ['create', 'update', 'delete', 'read'].includes(action)) {
        console.log('Edge authority result: ALLOWED - Content admin access granted for news');
        return {
          allowed: true,
          reason: 'Content admin access granted'
        };
      }
    }
    
    // Regular customers have limited access
    if (userRoles.includes('customer')) {
      // Customers can read most resources
      if (action === 'read') {
        console.log('Edge authority result: ALLOWED - Customer read access granted');
        return {
          allowed: true,
          reason: 'Customer read access granted'
        };
      }
      
      // Customers can manage their own orders
      if (resource === 'orders' && ['create', 'read'].includes(action)) {
        console.log('Edge authority result: ALLOWED - Customer order access granted');
        return {
          allowed: true,
          reason: 'Customer order access granted'
        };
      }
    }
    
    // Default deny
    console.log('Edge authority result: DENIED - Access denied');
    return {
      allowed: false,
      reason: 'Access denied'
    };
  }
}
