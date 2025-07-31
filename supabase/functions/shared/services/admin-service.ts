
import { ServiceHandler, createSuccessResponse, createErrorResponse } from '../db-base.ts';

export class AdminService implements ServiceHandler {
  async handle(supabase: any, method: string, path: string, req: Request, user: any): Promise<Response> {
    console.log(`AdminService: Handling ${method} ${path}`);

    // Check admin permissions
    const hasAdminRole = await this.checkAdminRole(supabase, user.id);
    if (!hasAdminRole) {
      return createErrorResponse('Unauthorized: Admin access required', 403);
    }

    // GET /admin/users - Get all users
    if (method === 'GET' && path === '/admin/users') {
      return this.getAllUsers(supabase);
    }

    // PUT /admin/users/:id/role - Update user role
    if (method === 'PUT' && path.match(/^\/admin\/users\/[^\/]+\/role$/)) {
      const userId = path.split('/')[3];
      const body = await req.json();
      return this.updateUserRole(supabase, userId, body);
    }

    // GET /admin/products - Get all products for admin
    if (method === 'GET' && path === '/admin/products') {
      return this.getAllProductsAdmin(supabase);
    }

    // PUT /admin/products/:id - Update product
    if (method === 'PUT' && path.startsWith('/admin/products/')) {
      const productId = parseInt(path.split('/')[3]);
      const body = await req.json();
      return this.updateProduct(supabase, productId, body);
    }

    // POST /admin/products - Create product
    if (method === 'POST' && path === '/admin/products') {
      const body = await req.json();
      return this.createProduct(supabase, body);
    }

    // DELETE /admin/products/:id - Delete product
    if (method === 'DELETE' && path.startsWith('/admin/products/')) {
      const productId = parseInt(path.split('/')[3]);
      return this.deleteProduct(supabase, productId);
    }

    return createErrorResponse('Method not allowed', 405);
  }

  private async checkAdminRole(supabase: any, userId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .in('role', ['admin', 'content-admin']);
      
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }

  private async getAllUsers(supabase: any): Promise<Response> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_roles(role),
          sold_to_parties(*),
          user_catalogs(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all users:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getAllUsers:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async updateUserRole(supabase: any, userId: string, roleData: any): Promise<Response> {
    try {
      // Delete existing roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Insert new role
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: roleData.role
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user role:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in updateUserRole:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getAllProductsAdmin(supabase: any): Promise<Response> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_features(feature),
          product_specifications(key, value),
          product_images(image_url, order),
          related_products!related_products_product_id_fkey(related_product_id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all products for admin:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getAllProductsAdmin:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async updateProduct(supabase: any, productId: number, productData: any): Promise<Response> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in updateProduct:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async createProduct(supabase: any, productData: any): Promise<Response> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in createProduct:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async deleteProduct(supabase: any, productId: number): Promise<Response> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        console.error('Error deleting product:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse({ deleted: true });
    } catch (error) {
      console.error('Unexpected error in deleteProduct:', error);
      return createErrorResponse('Internal server error');
    }
  }
}
