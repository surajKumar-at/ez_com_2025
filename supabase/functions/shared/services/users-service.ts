
import { ServiceHandler, createSuccessResponse, createErrorResponse } from '../db-base.ts';
import { cacheService } from '../cache/CacheService.ts';
import { USER_CACHE_CONFIG, createUserCacheKey } from '../cache/CacheConfig.ts';

export class UsersService implements ServiceHandler {
  async handle(supabase: any, method: string, path: string, req: Request, user: any): Promise<Response> {
    console.log(`UsersService: Handling ${method} ${path}`);
    console.log(`UsersService: User present:`, !!user);
    console.log(`UsersService: User ID:`, user?.id);

    if (method === 'GET' && path === '/users/me') {
      return this.getCurrentUser(supabase, user);
    }

    if (method === 'GET' && path === '/users/sold-to-parties') {
      return this.getSoldToParties(supabase, user);
    }

    if (method === 'PUT' && path === '/users/me') {
      const body = await req.json();
      return this.updateCurrentUser(supabase, user, body);
    }

    if (method === 'GET' && path === '/users/addresses') {
      return this.getUserAddresses(supabase, user);
    }

    if (method === 'POST' && path === '/users/addresses') {
      const body = await req.json();
      return this.createUserAddress(supabase, user, body);
    }

    console.log(`UsersService: No matching route for ${method} ${path}`);
    return createErrorResponse('Method not allowed', 405);
  }

  private async getCurrentUser(supabase: any, user: any): Promise<Response> {
    try {
      if (!user) {
        console.log('UsersService: No user provided for getCurrentUser');
        return createErrorResponse('User not authenticated', 401);
      }

      console.log('UsersService: Fetching user data for ID:', user.id);
      
      const cacheKey = createUserCacheKey(user.id, 'profile');
      
      const userData = await cacheService.get(
        cacheKey,
        USER_CACHE_CONFIG.PROFILE,
        async () => {
          console.log('Cache MISS - fetching user profile from database');
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching current user:', error);
            throw new Error(error.message);
          }

          return data;
        }
      );

      console.log('UsersService: Successfully fetched user data');
      return createSuccessResponse(userData);
    } catch (error) {
      console.error('Unexpected error in getCurrentUser:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getSoldToParties(supabase: any, user: any): Promise<Response> {
    try {
      if (!user) {
        console.log('UsersService: No authenticated user for sold-to parties request');
        return createErrorResponse('User not authenticated', 401);
      }

      console.log('UsersService: Fetching sold-to parties for user:', user.id);

      const cacheKey = createUserCacheKey(user.id, 'sold_to_parties');
      
      const soldToParties = await cacheService.get(
        cacheKey,
        USER_CACHE_CONFIG.SOLD_TO_PARTIES,
        async () => {
          console.log('Cache MISS - fetching sold-to parties from database');
          const { data, error } = await supabase
            .from('sold_to_parties')
            .select('*')
            .eq('user_id', user.id)
            .order('name');
          
          if (error) {
            console.error('UsersService: Error fetching sold-to parties:', error);
            throw new Error(`Database error: ${error.message}`);
          }

          return data || [];
        }
      );

      console.log('UsersService: Found sold-to parties:', soldToParties?.length || 0);
      return createSuccessResponse(soldToParties);
    } catch (error) {
      console.error('UsersService: Unexpected error in getSoldToParties:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async updateCurrentUser(supabase: any, user: any, updateData: any): Promise<Response> {
    try {
      if (!user) {
        return createErrorResponse('User not authenticated', 401);
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating current user:', error);
        return createErrorResponse(error.message);
      }

      // Invalidate user profile cache after update
      const cacheKey = createUserCacheKey(user.id, 'profile');
      await cacheService.invalidate(cacheKey, USER_CACHE_CONFIG.PROFILE.namespace);

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in updateCurrentUser:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getUserAddresses(supabase: any, user: any): Promise<Response> {
    try {
      if (!user) {
        return createErrorResponse('User not authenticated', 401);
      }

      const cacheKey = createUserCacheKey(user.id, 'addresses');
      
      const addresses = await cacheService.get(
        cacheKey,
        USER_CACHE_CONFIG.ADDRESSES,
        async () => {
          console.log('Cache MISS - fetching user addresses from database');
          const { data, error } = await supabase
            .from('sold_to_parties')
            .select(`
              id,
              name,
              addresses:address_id(*)
            `)
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error fetching user addresses:', error);
            throw new Error(error.message);
          }

          return data || [];
        }
      );

      return createSuccessResponse(addresses);
    } catch (error) {
      console.error('Unexpected error in getUserAddresses:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async createUserAddress(supabase: any, user: any, addressData: any): Promise<Response> {
    try {
      if (!user) {
        return createErrorResponse('User not authenticated', 401);
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert({
          ...addressData,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user address:', error);
        return createErrorResponse(error.message);
      }

      // Invalidate user addresses cache after creation
      const cacheKey = createUserCacheKey(user.id, 'addresses');
      await cacheService.invalidate(cacheKey, USER_CACHE_CONFIG.ADDRESSES.namespace);

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in createUserAddress:', error);
      return createErrorResponse('Internal server error');
    }
  }

  /**
   * Invalidate all user-specific cache data
   */
  async invalidateUserCache(userId: string): Promise<void> {
    const userNamespace = `user:${userId}`;
    await cacheService.invalidateNamespace(userNamespace);
    console.log(`All cache data invalidated for user: ${userId}`);
  }
}
