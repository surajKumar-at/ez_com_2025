
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, sapOrderNumber, customerEmail, apiSource } = await req.json();
    
    if (!orderId || !sapOrderNumber || !customerEmail) {
      throw new Error('Missing required parameters: orderId, sapOrderNumber, or customerEmail');
    }

    console.log('Sending SAP order confirmation email to:', customerEmail);
    console.log('Order details:', { orderId, sapOrderNumber, apiSource });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Fetch order details from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        status,
        order_date,
        po_number,
        sap_order_number,
        order_items(
          id,
          name,
          quantity,
          price,
          product_id
        ),
        sold_to_parties(name),
        ship_to_parties(name)
      `)
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      throw new Error('Failed to fetch order details');
    }

    // Generate the order details link
    const orderLink = `${Deno.env.get("SUPABASE_URL")?.replace('/rest/v1', '')}/sap-order/${sapOrderNumber}`;

    // Calculate order totals
    const subtotal = order.order_items?.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.price), 0) || 0;
    const tax = subtotal * 0.07; // 7% tax
    const total = order.total || (subtotal + tax);

    const { data, error } = await resend.emails.send({
      from: 'admin@answerthinkdemo.com',
      to: customerEmail,
      cc: 'mbablan@gmail.com',
      subject: `SAP Order Confirmation - Order #${sapOrderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #502b80; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Order Confirmation</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your SAP order has been successfully created!</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #333; margin-top: 0;">Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order Number:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${order.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>SAP Order Number:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${sapOrderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order Date:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(order.order_date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Status:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${order.status}</td>
              </tr>
              ${order.po_number ? `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>PO Number:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${order.po_number}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>API Source:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${apiSource || 'S4'}</td>
              </tr>
            </table>

            <h3 style="color: #333; margin-bottom: 15px;">Customer Information</h3>
            <p><strong>Sold To:</strong> ${order.sold_to_parties?.name || 'N/A'}</p>
            <p><strong>Ship To:</strong> ${order.ship_to_parties?.name || 'N/A'}</p>
          </div>

          <div style="background-color: white; padding: 20px; border: 1px solid #ddd; border-top: none;">
            <h3 style="color: #333; margin-top: 0;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.order_items?.map((item: any) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #eee;">$${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd;">
              <div style="text-align: right;">
                <p style="margin: 5px 0;"><strong>Subtotal: $${subtotal.toFixed(2)}</strong></p>
                <p style="margin: 5px 0;"><strong>Tax: $${tax.toFixed(2)}</strong></p>
                <p style="margin: 5px 0; font-size: 18px; color: #502b80;"><strong>Total: $${total.toFixed(2)}</strong></p>
              </div>
            </div>
          </div>

          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0 0 15px 0; font-size: 16px;">View your order details online:</p>
            <a href="${orderLink}" 
               style="display: inline-block; background-color: #502b80; color: white; padding: 12px 25px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              View Order Details
            </a>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Note:</strong> If you're not already logged in, you'll be redirected to the login page first. 
              After successful login, you'll be automatically taken to your order details.
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #888;">
            <p>Thank you for your business!</p>
            <p>If you have any questions about your order, please contact our customer service team.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('SAP order confirmation email sent successfully:', data);

    return new Response(JSON.stringify({ success: true, emailId: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in send-sap-order-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
