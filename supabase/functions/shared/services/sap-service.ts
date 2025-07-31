
import { ServiceHandler, createSuccessResponse, createErrorResponse } from '../db-base.ts';

export class SapService implements ServiceHandler {
  async handle(supabase: any, method: string, path: string, req: Request, user: any): Promise<Response> {
    console.log(`SapService: Handling ${method} ${path}`);

    if (method === 'POST' && path === '/sap/orders') {
      const body = await req.json();
      return this.getSapOrders(supabase, body, user);
    }

    if (method === 'POST' && path === '/sap/order-details') {
      const body = await req.json();
      return this.getSapOrderDetails(supabase, body, user);
    }

    if (method === 'POST' && path === '/sap/order-items') {
      const body = await req.json();
      return this.getSapOrderItems(supabase, body, user);
    }

    if (method === 'POST' && path === '/sap/simulate-order') {
      const body = await req.json();
      return this.simulateSapOrder(supabase, body, user);
    }

    if (method === 'POST' && path === '/sap/create-order') {
      const body = await req.json();
      return this.createSapOrder(supabase, body, user);
    }

    return createErrorResponse('Method not allowed', 405);
  }

  private async getSapOrders(supabase: any, payload: any, user: any): Promise<Response> {
    try {
      console.log('Calling get-sap-orders edge function with payload:', payload);
      
      const { data, error } = await supabase.functions.invoke('get-sap-orders', {
        body: payload
      });
      
      if (error) {
        console.error('Error from get-sap-orders function:', error);
        return createErrorResponse(error.message || 'SAP orders request failed');
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getSapOrders:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getSapOrderDetails(supabase: any, payload: any, user: any): Promise<Response> {
    try {
      console.log('Calling get-sap-order-details edge function with payload:', payload);
      
      const { data, error } = await supabase.functions.invoke('get-sap-order-details', {
        body: payload
      });
      
      if (error) {
        console.error('Error from get-sap-order-details function:', error);
        return createErrorResponse(error.message || 'SAP order details request failed');
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getSapOrderDetails:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async getSapOrderItems(supabase: any, payload: any, user: any): Promise<Response> {
    try {
      console.log('Calling get-sap-order-items edge function with payload:', payload);
      
      const { data, error } = await supabase.functions.invoke('get-sap-order-items', {
        body: payload
      });
      
      if (error) {
        console.error('Error from get-sap-order-items function:', error);
        return createErrorResponse(error.message || 'SAP order items request failed');
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in getSapOrderItems:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async simulateSapOrder(supabase: any, payload: any, user: any): Promise<Response> {
    try {
      console.log('Calling simulate-sap-order edge function with payload:', payload);
      
      const { data, error } = await supabase.functions.invoke('simulate-sap-order', {
        body: payload
      });
      
      if (error) {
        console.error('Error from simulate-sap-order function:', error);
        return createErrorResponse(error.message || 'SAP order simulation failed');
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in simulateSapOrder:', error);
      return createErrorResponse('Internal server error');
    }
  }

  private async createSapOrder(supabase: any, payload: any, user: any): Promise<Response> {
    try {
      console.log('Calling sync-order-with-sap edge function with payload:', payload);
      
      const { data, error } = await supabase.functions.invoke('sync-order-with-sap', {
        body: payload
      });
      
      if (error) {
        console.error('Error from sync-order-with-sap function:', error);
        return createErrorResponse(error.message || 'SAP order creation failed');
      }

      return createSuccessResponse(data);
    } catch (error) {
      console.error('Unexpected error in createSapOrder:', error);
      return createErrorResponse('Internal server error');
    }
  }
}
