
import { corsHeaders } from '../utils/cors.ts';
import { supabase } from '../utils/supabase.ts';
import { 
  fetchOrderDetails, 
  fetchSapCredentials 
} from '../services/dataService.ts';
import { 
  createSapOrderEcc, 
  formatSapPayloadEcc 
} from '../services/sapServiceEcc.ts';

export async function handleSyncOrderEcc(req: Request): Promise<Response> {
  // Get the request body
  const requestBody = await req.json();
  const { orderId } = requestBody;
  
  console.log('ECC Request body:', JSON.stringify(requestBody, null, 2));
  
  if (!orderId) {
    console.error('Missing orderId in request body');
    return new Response(
      JSON.stringify({ error: 'Order ID is required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }

  console.log('Syncing order with SAP ECC:', orderId);

  // Fetch order details and SAP credentials
  const order = await fetchOrderDetails(orderId);
  
  if (!order) {
    console.error('Order not found:', orderId);
    return new Response(
      JSON.stringify({ error: 'Order not found' }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }

  const sapCreds = await fetchSapCredentials();
  
  if (!sapCreds) {
    console.error('SAP credentials not found');
    return new Response(
      JSON.stringify({ error: 'SAP credentials not found in the database' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }

  // Format the payload and create the order in SAP ECC
  const soldToId = order.sold_to_parties?.sap_sold_to_id || "";
  if (!soldToId) {
    console.error('Missing SAP Sold-To ID for order:', orderId);
    return new Response(
      JSON.stringify({ error: 'Missing SAP Sold-To ID for customer' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
  
  // Pass the SAP credentials to the formatter so we can use the organization values
  const payload = formatSapPayloadEcc(order, soldToId, sapCreds);
  
  try {
    const { sapOrderNumber, error } = await createSapOrderEcc(payload, sapCreds);
    
    if (error) {
      console.error('Error creating SAP ECC order:', error);
      return new Response(
        JSON.stringify({ 
          error: error.message, 
          details: error.details,
          messages: error.messages
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }
    
    if (sapOrderNumber) {
      // Update the order with the SAP order number
      const { error: updateError } = await supabase
        .from('orders')
        .update({ sap_order_number: sapOrderNumber })
        .eq('id', orderId);
      
      if (updateError) {
        console.error('Error updating order with SAP ECC order number:', JSON.stringify(updateError, null, 2));
        return new Response(
          JSON.stringify({
            error: 'SAP ECC order created but failed to update local order',
            sapOrderNumber,
            details: updateError
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        )
      }
      
      console.log('Order updated with SAP ECC order number');

      // Send confirmation email
      try {
        console.log('Sending SAP ECC order confirmation email...');
        
        // Get user email from the order
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(order.user_id);
        
        if (userError || !userData.user?.email) {
          console.warn('Could not fetch user email for ECC order confirmation:', userError);
        } else {
          const { error: emailError } = await supabase.functions.invoke('send-sap-order-confirmation', {
            body: {
              orderId: orderId,
              sapOrderNumber: sapOrderNumber,
              customerEmail: userData.user.email,
              apiSource: 'ECC'
            }
          });

          if (emailError) {
            console.error('Error sending ECC confirmation email:', emailError);
            // Don't fail the order creation if email fails
          } else {
            console.log('SAP ECC order confirmation email sent successfully');
          }
        }
      } catch (emailError) {
        console.error('Error in ECC email sending process:', emailError);
        // Don't fail the order creation if email fails
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        sapOrderNumber: sapOrderNumber || null
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    console.error('Error during SAP ECC order creation:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error creating SAP ECC order', 
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
}
