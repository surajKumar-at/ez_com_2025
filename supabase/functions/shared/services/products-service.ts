import { ServiceHandler, createSuccessResponse, createErrorResponse } from '../db-base.ts';
import { EdgeAuthorityHelper } from '../authority/EdgeAuthorityHelper.ts';
import { EdgeInputValidator } from '../security/edgeInputValidation.ts';

export class ProductsService implements ServiceHandler {
  private authorityHelper: EdgeAuthorityHelper;

  constructor() {
    this.authorityHelper = new EdgeAuthorityHelper();
  }

  async handle(supabase: any, method: string, path: string, req: Request, user: any): Promise<Response> {
    console.log(`ProductsService: Handling ${method} ${path}`);
    console.log(`ProductsService: Request URL: ${req.url}`);
    console.log(`User authenticated: ${!!user}, User ID: ${user?.id || 'anonymous'}`);

    // Get user roles for authority checks - handle anonymous users
    const userRoles = user ? await this.getUserRoles(supabase, user.id) : [];
    console.log(`User roles: ${JSON.stringify(userRoles)}`);
    
    if (method === 'GET' && path === '/products') {
      // Parse query parameters from the request URL
      const url = new URL(req.url);
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');
      
      console.log(`ProductsService: Query params - category: ${category}, search: ${search}`);
      
      // Validate query parameters for security
      if (category) {
        const sanitizedCategory = EdgeInputValidator.sanitizeString(category);
        if (!EdgeInputValidator.validateCategory(sanitizedCategory) || EdgeInputValidator.hasSQLInjection(sanitizedCategory)) {
          console.warn('ProductsService: Invalid category parameter:', category);
          return createErrorResponse('Invalid category parameter', 400);
        }
        return this.getProductsByCategory(supabase, sanitizedCategory, user, userRoles);
      } 
      
      if (search) {
        const sanitizedSearch = EdgeInputValidator.sanitizeString(search);
        if (!EdgeInputValidator.validateSearchQuery(sanitizedSearch) || EdgeInputValidator.hasSQLInjection(sanitizedSearch)) {
          console.warn('ProductsService: Invalid search parameter:', search);
          return createErrorResponse('Invalid search parameter', 400);
        }
        return this.searchProducts(supabase, sanitizedSearch, user, userRoles);
      }
      
      return this.getAllProducts(supabase, user, userRoles);
    }

    if (method === 'GET' && path.startsWith('/products/')) {
      const productId = parseInt(path.split('/')[2]);
      if (isNaN(productId)) {
        return createErrorResponse('Invalid product ID', 400);
      }
      return this.getProductById(supabase, productId, user, userRoles);
    }

    // Write operations require authentication
    if (!user) {
      return createErrorResponse('Authentication required for write operations', 401);
    }

    if (method === 'POST' && path === '/products') {
      return this.createProduct(supabase, req, user, userRoles);
    }

    if (method === 'PUT' && path.startsWith('/products/')) {
      const productId = parseInt(path.split('/')[2]);
      if (isNaN(productId)) {
        return createErrorResponse('Invalid product ID', 400);
      }
      return this.updateProduct(supabase, req, user, userRoles, productId);
    }

    if (method === 'DELETE' && path.startsWith('/products/')) {
      const productId = parseInt(path.split('/')[2]);
      if (isNaN(productId)) {
        return createErrorResponse('Invalid product ID', 400);
      }
      return this.deleteProduct(supabase, user, userRoles, productId);
    }

    return createErrorResponse('Method not allowed', 405);
  }

  private async getUserRoles(supabase: any, userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data?.map((r: any) => r.role) || [];
    } catch (error) {
      console.error('Failed to get user roles:', error);
      return [];
    }
  }

  private filterProductData(product: any, user: any, userRoles: string[]): any {
    // If user is not authenticated, hide sensitive data
    if (!user) {
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.short_description,
        price: product.price,
        category: product.category,
        features: product.product_features?.map((f: any) => f.feature) || [],
        specifications: product.product_specifications?.reduce((acc: Record<string, string>, spec: any) => {
          acc[spec.key] = spec.value;
          return acc;
        }, {}) || {},
        images: product.product_images?.sort((a: any, b: any) => a.order - b.order).map((img: any) => img.image_url) || [],
        relatedProducts: product.related_products?.map((r: any) => r.related_product_id) || [],
        inStock: product.in_stock,
        web_status: product.web_status,
        brand_id: product.brand_id
        // Hide SAP fields and other sensitive data for anonymous users
      };
    }

    // For authenticated users, check if they have content-admin or admin roles
    const isAdmin = userRoles.includes('admin') || userRoles.includes('content-admin');

    if (isAdmin) {
      // Content admins get full access to all data including SAP fields
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.short_description,
        price: product.price,
        category: product.category,
        features: product.product_features?.map((f: any) => f.feature) || [],
        specifications: product.product_specifications?.reduce((acc: Record<string, string>, spec: any) => {
          acc[spec.key] = spec.value;
          return acc;
        }, {}) || {},
        images: product.product_images?.sort((a: any, b: any) => a.order - b.order).map((img: any) => img.image_url) || [],
        relatedProducts: product.related_products?.map((r: any) => r.related_product_id) || [],
        inStock: product.in_stock,
        sap_product_code: product.sap_product_code,
        web_status: product.web_status,
        sap_status_date: product.sap_status_date,
        sap_baseuom: product.sap_baseuom,
        sap_deletion_indicator: product.sap_deletion_indicator,
        sap_text: product.sap_text,
        sap_item_category_group: product.sap_item_category_group,
        brand_id: product.brand_id
      };
    }

    // Regular authenticated users get moderate access (no SAP internals)
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.short_description,
      price: product.price,
      category: product.category,
      features: product.product_features?.map((f: any) => f.feature) || [],
      specifications: product.product_specifications?.reduce((acc: Record<string, string>, spec: any) => {
        acc[spec.key] = spec.value;
        return acc;
      }, {}) || {},
      images: product.product_images?.sort((a: any, b: any) => a.order - b.order).map((img: any) => img.image_url) || [],
      relatedProducts: product.related_products?.map((r: any) => r.related_product_id) || [],
      inStock: product.in_stock,
      sap_product_code: product.sap_product_code, // Regular users can see product codes
      web_status: product.web_status,
      brand_id: product.brand_id
    };
  }

  private async getAllProducts(supabase: any, user: any, userRoles: string[]): Promise<Response> {
    try {
      console.log('ProductsService: Fetching all products');
      
      // Build query - for anonymous users, only show Active products
      let query = supabase
        .from('products')
        .select(`
          *,
          product_features(feature),
          product_specifications(key, value),
          product_images(image_url, order),
          related_products!related_products_product_id_fkey(related_product_id)
        `);

      // For anonymous users, only show active products
      if (!user) {
        query = query.eq('web_status', 'Active');
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching all products:', error);
        return createErrorResponse(error.message);
      }

      // Ensure we always return an array, even if data is null
      const products = data || [];
      
      // Filter data based on user authentication and roles
      const transformedData = products.map((item: any) => this.filterProductData(item, user, userRoles));

      console.log(`ProductsService: Returning ${transformedData.length} products for user: ${user ? 'authenticated' : 'anonymous'}`);
      return createSuccessResponse(transformedData);
    } catch (error) {
      console.error('Unexpected error in getAllProducts:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getProductsByCategory(supabase: any, category: string, user: any, userRoles: string[]): Promise<Response> {
    try {
      console.log(`ProductsService: Fetching products by category: ${category}`);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          product_features(feature),
          product_specifications(key, value),
          product_images(image_url, order),
          related_products!related_products_product_id_fkey(related_product_id)
        `)
        .eq('category', category);

      // For anonymous users, only show active products
      if (!user) {
        query = query.eq('web_status', 'Active');
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products by category:', error);
        return createErrorResponse(error.message);
      }

      // Ensure we always return an array, even if data is null
      const products = data || [];

      const transformedData = products.map((item: any) => this.filterProductData(item, user, userRoles));

      console.log(`ProductsService: Returning ${transformedData.length} products for category: ${category}`);
      return createSuccessResponse(transformedData);
    } catch (error) {
      console.error('Unexpected error in getProductsByCategory:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getProductById(supabase: any, productId: number, user: any, userRoles: string[]): Promise<Response> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_features(feature),
          product_specifications(key, value),
          product_images(image_url, order),
          related_products!related_products_product_id_fkey(related_product_id)
        `)
        .eq('id', productId);

      // For anonymous users, only allow access to active products
      if (!user) {
        query = query.eq('web_status', 'Active');
      }
      
      const { data, error } = await query.single();
      
      if (error) {
        console.error('Error fetching product by ID:', error);
        return createErrorResponse(error.message);
      }

      const transformedData = this.filterProductData(data, user, userRoles);

      return createSuccessResponse(transformedData);
    } catch (error) {
      console.error('Unexpected error in getProductById:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async searchProducts(supabase: any, searchQuery: string, user: any, userRoles: string[]): Promise<Response> {
    try {
      console.log(`ProductsService: Searching products with query: ${searchQuery}`);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          product_features(feature),
          product_specifications(key, value),
          product_images(image_url, order),
          related_products!related_products_product_id_fkey(related_product_id)
        `)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,sap_product_code.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);

      // For anonymous users, only show active products
      if (!user) {
        query = query.eq('web_status', 'Active');
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error searching products:', error);
        return createErrorResponse(error.message);
      }

      // Ensure we always return an array, even if data is null
      const products = data || [];

      const transformedData = products.map((item: any) => this.filterProductData(item, user, userRoles));

      console.log(`ProductsService: Returning ${transformedData.length} search results for: ${searchQuery}`);
      return createSuccessResponse(transformedData);
    } catch (error) {
      console.error('Unexpected error in searchProducts:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async createProduct(supabase: any, req: Request, user: any, userRoles: string[]): Promise<Response> {
    try {
      // Check authority for product creation
      const authorityCheck = await this.authorityHelper.checkAuthority({
        userId: user?.id || '',
        userRoles,
        resource: 'products',
        action: 'create'
      });

      if (!authorityCheck.allowed) {
        console.log('Authority denied for product creation:', authorityCheck.reason);
        return createErrorResponse('Insufficient permissions to create products', 403);
      }

      const productData = await req.json();
      console.log('Creating product with data:', productData);

      // Validate required fields
      if (!productData.name || !productData.description || !productData.price || !productData.category) {
        return createErrorResponse('Missing required fields: name, description, price, category', 400);
      }

      // Generate slug if not provided
      if (!productData.slug) {
        productData.slug = productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }

      // Insert product
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          short_description: productData.short_description || productData.description.substring(0, 100),
          price: productData.price,
          category: productData.category,
          in_stock: productData.in_stock !== undefined ? productData.in_stock : true,
          sap_product_code: productData.sap_product_code,
          web_status: productData.web_status || 'Draft',
          brand_id: productData.brand_id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        return createErrorResponse(error.message);
      }

      console.log('Product created successfully:', product.id);
      return createSuccessResponse(product);
    } catch (error) {
      console.error('Unexpected error in createProduct:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async updateProduct(supabase: any, req: Request, user: any, userRoles: string[], productId: number): Promise<Response> {
    try {
      // Check authority for product updates
      const authorityCheck = await this.authorityHelper.checkAuthority({
        userId: user?.id || '',
        userRoles,
        resource: 'products',
        action: 'update'
      });

      if (!authorityCheck.allowed) {
        console.log('Authority denied for product update:', authorityCheck.reason);
        return createErrorResponse('Insufficient permissions to update products', 403);
      }

      const updateData = await req.json();
      console.log(`Updating product ${productId} with data:`, updateData);

      // Remove id from update data if present
      delete updateData.id;

      const { data: product, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        return createErrorResponse(error.message);
      }

      if (!product) {
        return createErrorResponse('Product not found', 404);
      }

      console.log('Product updated successfully:', productId);
      return createSuccessResponse(product);
    } catch (error) {
      console.error('Unexpected error in updateProduct:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async deleteProduct(supabase: any, user: any, userRoles: string[], productId: number): Promise<Response> {
    try {
      // Check authority for product deletion
      const authorityCheck = await this.authorityHelper.checkAuthority({
        userId: user?.id || '',
        userRoles,
        resource: 'products',
        action: 'delete'
      });

      if (!authorityCheck.allowed) {
        console.log('Authority denied for product deletion:', authorityCheck.reason);
        return createErrorResponse('Insufficient permissions to delete products', 403);
      }

      console.log(`Deleting product ${productId}`);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Error deleting product:', error);
        return createErrorResponse(error.message);
      }

      console.log('Product deleted successfully:', productId);
      return createSuccessResponse({ message: 'Product deleted successfully', productId });
    } catch (error) {
      console.error('Unexpected error in deleteProduct:', error);
      return createErrorResponse('Internal server error');
    }
  }
}
