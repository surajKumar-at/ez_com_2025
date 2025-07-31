
import { authorityCacheService } from "../../shared/authority/AuthorityCacheService.ts";

export async function handleAuthorityCache(
  action: string,
  params: Record<string, any>
): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    switch (action) {
      case 'invalidate-user':
        if (!params.userId) {
          return { success: false, message: 'User ID required for user cache invalidation' };
        }
        await authorityCacheService.invalidateUserAuthority(params.userId);
        return { success: true, message: `Authority cache invalidated for user: ${params.userId}` };

      case 'invalidate-all':
        await authorityCacheService.invalidateAllAuthority();
        return { success: true, message: 'All authority caches invalidated' };

      case 'status':
        // Get authority cache statistics
        const status = {
          service: 'authority-cache',
          status: 'operational',
          timestamp: new Date().toISOString()
        };
        return { success: true, data: status };

      default:
        return { success: false, message: `Unknown authority cache action: ${action}` };
    }
  } catch (error) {
    console.error(`Authority cache handler error:`, error);
    return { success: false, message: error.message };
  }
}
