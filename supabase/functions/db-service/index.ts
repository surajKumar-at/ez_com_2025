
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'
import { OrdersService } from '../shared/services/orders-service.ts'
import { UsersService } from '../shared/services/users-service.ts'
import { ProductsService } from '../shared/services/products-service.ts'
import { ConfigService } from '../shared/services/config-service.ts'
import { EdgeInputValidator } from '../shared/security/edgeInputValidation.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  console.log('=== DB SERVICE FUNCTION INVOKED ===');
  console.log(`DB Service: Incoming request - ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('DB Service: Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    console.log('DB Service: Initializing Supabase client');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')
    console.log('DB Service: Auth header present:', !!authHeader);
    let user = null
    
    if (authHeader) {
      const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      )
      
      if (!authError && authUser) {
        user = authUser
        console.log('DB Service: User authenticated:', user.email);
      } else {
        console.log('DB Service: Auth error:', authError);
      }
    }

    // Parse URL and extract path correctly
    const url = new URL(req.url);
    console.log('DB Service: Full URL:', req.url);
    console.log('DB Service: URL pathname:', url.pathname);
    console.log('DB Service: URL search params:', url.search);
    
    // Extract the path after /functions/v1/db-service
    // The URL structure is: https://domain/functions/v1/db-service/path
    const pathParts = url.pathname.split('/');
    console.log('DB Service: Path parts:', pathParts);
    
    // Find the index of 'db-service' in the path
    const dbServiceIndex = pathParts.findIndex(part => part === 'db-service');
    
    let path = '/';
    if (dbServiceIndex !== -1 && dbServiceIndex < pathParts.length - 1) {
      // Get everything after 'db-service'
      const remainingParts = pathParts.slice(dbServiceIndex + 1).filter(part => part !== '');
      path = '/' + remainingParts.join('/');
    }
    
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    console.log(`DB Service: Extracted path: ${path}`);
    
    // Validate and sanitize query parameters
    const validatedParams = EdgeInputValidator.validateQueryParams(url);
    console.log('DB Service: Validated query params:', validatedParams);
    
    // Parse request body
    let requestBody = null;
    try {
      if (req.method !== 'GET') {
        requestBody = await req.json();
        console.log('DB Service: Request body:', requestBody);
      }
    } catch (error) {
      console.log('DB Service: No JSON body or error parsing:', error);
    }

    // Get method from request
    const method = req.method;
    console.log(`DB Service: Processing ${method} ${path}`)
    console.log('User authenticated:', !!user)

    // Create a mock request object for services that expect it
    // Include query parameters in the URL for services to parse
    const fullUrl = `${url.origin}${path}${url.search}`;
    const mockRequest = {
      json: () => Promise.resolve(requestBody || {}),
      method: method,
      url: fullUrl,
      headers: req.headers,
      validatedParams // Pass validated params directly
    };

    // Route to appropriate service - Handle config endpoints
    if (path.startsWith('/config')) {
      console.log('DB Service: Routing to ConfigService with path:', path)
      const configService = new ConfigService()
      const result = await configService.handle(supabaseClient, method, path, mockRequest, user)
      console.log('DB Service: ConfigService returned result')
      return result
    }

    // Handle products endpoints
    if (path.startsWith('/products')) {
      console.log('DB Service: Routing to ProductsService with path:', path)
      const productsService = new ProductsService()
      const result = await productsService.handle(supabaseClient, method, path, mockRequest, user)
      console.log('DB Service: ProductsService returned result')
      return result
    }

    // Handle users endpoints
    if (path.startsWith('/users')) {
      console.log('DB Service: Routing to UsersService with path:', path)
      const usersService = new UsersService()
      const result = await usersService.handle(supabaseClient, method, path, mockRequest, user)
      console.log('DB Service: UsersService returned result')
      return result
    }

    if (path.startsWith('/orders')) {
      console.log('DB Service: Routing to OrdersService with path:', path)
      const ordersService = new OrdersService()
      const result = await ordersService.handle(supabaseClient, method, path, mockRequest, user)
      console.log('DB Service: OrdersService returned result')
      return result
    }

    // Handle other endpoints here as needed
    console.log(`DB Service: No handler found for path: ${path}`)
    return new Response(
      JSON.stringify({ 
        error: 'Endpoint not found', 
        path, 
        method,
        pathParts,
        dbServiceIndex,
        availableEndpoints: ['/config/logging', '/products', '/products/:id', '/orders', '/orders/unified', '/orders/:id', '/users/me', '/users/sold-to-parties']
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
        status: 404 
      }
    )
  } catch (error) {
    console.error('DB Service error:', error)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }, 
        status: 500 
      }
    )
  }
})
