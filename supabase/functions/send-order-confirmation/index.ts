
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
    const { order, customerEmail } = await req.json();
    
    if (!order || !customerEmail) {
      throw new Error('Missing required parameters');
    }

    console.log('Sending order confirmation email to:', customerEmail);
    console.log('Order details:', order);

    const { data, error } = await resend.emails.send({
      from: 'admin@answerthinkdemo.com',
      to: customerEmail,
      subject: `Order Confirmation - Order #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #502b80;">Order Confirmation</h1>
          <p>Thank you for your order!</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Order Details:</h2>
            <p><strong>Order Number:</strong> ${order.id}</p>
            ${order.sap_order_number ? `<p><strong>SAP Order Number:</strong> ${order.sap_order_number}</p>` : ''}
            <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Items Ordered:</h3>
            ${order.items.map((item: any) => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p style="margin: 5px 0;">
                  <strong>${item.name}</strong><br>
                  Quantity: ${item.quantity}<br>
                  Price: $${item.price.toFixed(2)}
                </p>
              </div>
            `).join('')}
          </div>

          <p style="color: #666; font-size: 0.9em;">
            If you have any questions about your order, please contact our customer service team.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in send-order-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
