
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ECC Order Creation Handler
async function handleEccOrderCreation(req: Request) {
  console.log("ECC SAP order creation function called");
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request body
    const body = await req.json();
    console.log('ECC order creation request:', body);

    const { orderId } = body;
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    // Get order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Get ECC credentials
    const { data: credentials, error: credsError } = await supabase
      .from('sap_credentials')
      .select('*')
      .eq('sap_system_type', 'ECC')
      .single();

    if (credsError || !credentials) {
      throw new Error('ECC credentials not found');
    }

    console.log('Creating ECC order for order ID:', orderId);

    // Build ECC order creation payload
    const eccOrderPayload = {
      SALES_ORGANIZATION: credentials.sales_organization || '1710',
      DISTRIBUTION_CHANNEL: credentials.distribution_channel || '10',
      DIVISION: credentials.division || '00',
      DOCUMENT_TYPE: 'OR',
      SOLD_TO_PARTY: order.sold_to_id,
      SHIP_TO_PARTY: order.ship_to_id,
      CURRENCY: 'USD',
      PURCHASE_ORDER_NUMBER: order.po_number,
      ITEMS: order.order_items.map((item: any, index: number) => ({
        ITM_NUMBER: String(index + 1).padStart(6, '0'),
        MATERIAL: item.sap_product_code || item.product_id.toString(),
        TARGET_QTY: item.quantity.toString(),
        TARGET_QU: 'EA',
        PLANT: credentials.ecc_plant || '1710'
      }))
    };

    console.log('ECC order payload:', JSON.stringify(eccOrderPayload, null, 2));

    // For now, return mock data since ECC API implementation would be complex
    // In production, this would make actual SOAP/RFC calls to ECC
    const mockSapOrderNumber = `ECC${Date.now()}`;
    
    // Update order with SAP order number
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        sap_order_number: mockSapOrderNumber,
        status: 'processing'
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
    }

    const mockEccOrderResponse = {
      success: true,
      sapOrderNumber: mockSapOrderNumber,
      messages: [
        {
          type: 'S',
          message: `ECC order created successfully with number ${mockSapOrderNumber} (mock data)`
        }
      ]
    };

    console.log('ECC order creation response:', mockEccOrderResponse);

    return new Response(
      JSON.stringify(mockEccOrderResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("ECC order creation error:", error);
    
    const errorResponse = {
      success: false,
      error: error.message || "ECC order creation failed",
      messages: [
        {
          type: 'E',
          message: `ECC order creation error: ${error.message}`
        }
      ]
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
}

serve(handleEccOrderCreation);
