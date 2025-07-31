import { ServiceHandler, createSuccessResponse, createErrorResponse } from '../db-base.ts';

export class OrdersService implements ServiceHandler {
  async handle(supabase: any, method: string, path: string, req: Request, user: any): Promise<Response> {
    console.log(`OrdersService: Handling ${method} ${path}`);
    console.log(`OrdersService: User authenticated:`, !!user);

    // GET /orders - Get user's orders
    if (method === 'GET' && path === '/orders') {
      return this.getUserOrders(supabase, user);
    }

    // GET /orders/:id - Get specific order
    if (method === 'GET' && path.startsWith('/orders/')) {
      const orderId = path.split('/')[2];
      return this.getOrderById(supabase, user, orderId);
    }

    // POST /orders - Create new order
    if (method === 'POST' && path === '/orders') {
      const body = await req.json();
      return this.createOrder(supabase, user, body);
    }

    // POST /orders/unified - Create unified order with cart and addresses
    if (method === 'POST' && path === '/orders/unified') {
      console.log('OrdersService: Handling unified order creation');
      const body = await req.json();
      console.log('OrdersService: Request body received:', !!body);
      return this.createOrderUnified(supabase, user, body);
    }

    // PUT /orders/:id - Update order
    if (method === 'PUT' && path.startsWith('/orders/')) {
      const orderId = path.split('/')[2];
      const body = await req.json();
      return this.updateOrder(supabase, user, orderId, body);
    }

    console.log(`OrdersService: No handler found for ${method} ${path}`);
    return createErrorResponse('Method not allowed', 405);
  }

  private async getUserOrders(supabase: any, user: any): Promise<Response> {
    try {
      if (!user) {
        return createErrorResponse('Authentication required', 401);
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          deliveries(*),
          invoices(*),
          tracking_info(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user orders:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getUserOrders:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getOrderById(supabase: any, user: any, orderId: string): Promise<Response> {
    try {
      if (!user) {
        return createErrorResponse('Authentication required', 401);
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          deliveries(*),
          invoices(*),
          tracking_info(*)
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching order by ID:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getOrderById:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async createOrder(supabase: any, user: any, orderData: any): Promise<Response> {
    try {
      if (!user) {
        return createErrorResponse('Authentication required', 401);
      }

      // Start a transaction for order creation
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (orderError) {
        console.error('Error creating order:', orderError);
        return createErrorResponse(orderError.message);
      }

      // Create order items if provided
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map((item: any) => ({
          ...item,
          order_id: order.id
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) {
          console.error('Error creating order items:', itemsError);
          return createErrorResponse(itemsError.message);
        }
      }

      return createSuccessResponse(order);
    } catch (error) {
      console.error('Unexpected error in createOrder:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async createOrderUnified(supabase: any, user: any, orderData: any): Promise<Response> {
    try {
      console.log('OrdersService: Creating unified order with data:', !!orderData);
      console.log('OrdersService: User:', user?.email);
      
      if (!user) {
        console.error('OrdersService: No authenticated user found');
        return createErrorResponse('Authentication required', 401);
      }
      
      const { cart, soldTo, shipTo, paymentMethod, paymentDetails, sapPricing } = orderData;
      
      if (!cart || !soldTo || !shipTo) {
        console.error('OrdersService: Missing required order data');
        return createErrorResponse('Missing required order data: cart, soldTo, or shipTo');
      }

      console.log('OrdersService: Processing order with cart items:', cart.items?.length || 0);

      // Generate a unique order ID
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 1000);
      const orderId = `ORD-${timestamp}-${randomSuffix}`;

      console.log('OrdersService: Generated order ID:', orderId);

      // Calculate total based on SAP pricing if available
      let totalAmount = 0;
      
      if (sapPricing && sapPricing.grossValue) {
        totalAmount = Number(sapPricing.grossValue);
        console.log('OrdersService: Using SAP pricing total:', totalAmount);
      } else {
        totalAmount = cart.items.reduce((sum: number, item: any) => {
          return sum + (item.visiblePrice || 0) * item.quantity;
        }, 0);
        console.log('OrdersService: Calculated total from cart:', totalAmount);
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: user.id,
          total: totalAmount,
          status: 'pending',
          sold_to_id: soldTo.id,
          ship_to_id: shipTo.id,
          po_number: paymentMethod === 'purchase-order' ? paymentDetails.poNumber : null,
          order_date: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError) {
        console.error('OrdersService: Error creating order:', orderError);
        return createErrorResponse(orderError.message);
      }

      console.log('OrdersService: Order created successfully:', orderId);

      // Create order items
      const orderItems = cart.items.map((item: any) => {
        // Find corresponding SAP item if available
        const sapItem = sapPricing?.items?.find(
          (sapItem: any) => sapItem.material === item.sapProductCode
        );
        
        const unitPrice = sapItem 
          ? (sapItem.netValue / sapItem.quantity) 
          : (item.visiblePrice || 0);
          
        return {
          order_id: orderId,
          product_id: item.productId,
          quantity: item.quantity,
          price: unitPrice,
          name: `Product ${item.productId}`, // Fallback name
          status: 'pending'
        };
      });

      console.log('OrdersService: Creating order items:', orderItems.length);

      // Insert all order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('OrdersService: Error creating order items:', itemsError);
        return createErrorResponse(itemsError.message);
      }

      console.log('OrdersService: Unified order created successfully:', orderId);
      
      // Return the response in the format expected by the frontend
      return createSuccessResponse({ 
        orderId: orderId,
        success: true,
        message: 'Order created successfully'
      });
    } catch (error) {
      console.error('OrdersService: Unexpected error in createOrderUnified:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async updateOrder(supabase: any, user: any, orderId: string, updateData: any): Promise<Response> {
    try {
      if (!user) {
        return createErrorResponse('Authentication required', 401);
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating order:', error);
        return createErrorResponse(error.message);
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in updateOrder:', error);
      return createErrorResponse('Internal server error');
    }
  }
}
