
import { corsHeaders } from '../utils/cors.ts';

/**
 * Formats an order into the payload structure expected by SAP
 * @param order The order data to format
 * @param soldToId The SAP customer ID
 * @param sapCreds SAP credentials and configuration
 * @returns Formatted payload ready to send to SAP
 */
export function formatSapPayload(order: any, soldToId: string, sapCreds: any) {
  console.log('Formatting SAP payload');
  
  // Get today's date and convert to the SAP expected format: "/Date(timestamp)/"
  const today = new Date();
  const timestamp = today.getTime(); // Get timestamp in milliseconds
  const sapFormattedDate = `/Date(${timestamp})/`;
  
  console.log('Using RequestedDeliveryDate:', sapFormattedDate);
  console.log('Order data for SAP payload:', JSON.stringify(order, null, 2));
  
  // Use the actual PO number from the order, or fall back to a default message
  const poNumber = order.po_number && order.po_number.trim() !== '' 
    ? order.po_number 
    : "Created via B2B Portal";
  
  console.log('Using PO Number for SAP:', poNumber);
  
  const payload = {
    SalesOrderType: "OR",
    SalesOrganization: sapCreds.sales_organization || "1710",
    DistributionChannel: sapCreds.distribution_channel || "10",
    OrganizationDivision: sapCreds.division || "00",
    SoldToParty: soldToId,
    PurchaseOrderByCustomer: poNumber,
    CustomerPaymentTerms: "",
    RequestedDeliveryDate: sapFormattedDate,
    to_Partner: [
      {
        PartnerFunction: "SH",
        Customer: soldToId
      }
    ],
    to_Text: [
      {
        Language: "EN",
        LongTextID: "TX01",
        LongText: `Order created from B2B Portal - Order ID: ${order.id}${order.po_number ? ` - PO: ${order.po_number}` : ''}`
      }
    ],
    to_Item: order.order_items.map((item: any, index: number) => {
      // Format the item number as a string with leading zeros
      const itemNumber = (index + 1).toString().padStart(2, '0');
      
      // Prioritize SAP code from the database record if available
      const sapCode = item.sap_product_code || 
                     (item.products && item.products.sap_product_code) || 
                     'FG226';
                     
      console.log(`Order item ${index + 1}: Product ID ${item.product_id}, SAP code: ${sapCode}`);
      
      return {
        SalesOrderItem: itemNumber,
        Material: sapCode,
        RequestedQuantity: item.quantity.toString()
      };
    })
  };

  console.log('SAP payload item details:');
  payload.to_Item.forEach((item: any) => {
    console.log(`Item ${item.SalesOrderItem}: Material ${item.Material}, Quantity ${item.RequestedQuantity}`);
  });
  
  console.log('Final SAP payload PO number:', payload.PurchaseOrderByCustomer);
  
  return payload;
}
