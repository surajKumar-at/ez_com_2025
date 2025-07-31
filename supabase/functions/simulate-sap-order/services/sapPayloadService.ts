
/**
 * Formats a cart into the payload structure expected by SAP for order simulation
 * @param cart The cart data to format
 * @param productSapCodes Map of product IDs to their SAP codes
 * @param soldToId The SAP customer ID for sold-to party
 * @param shipToId The SAP customer ID for ship-to party
 * @param sapCreds SAP credentials and configuration
 * @returns Formatted payload ready to send to SAP for simulation
 */
export function formatSimulationPayload(
  cart: any,
  productSapCodes: Map<number, string>,
  soldToId: string,
  shipToId: string,
  sapCreds: any
) {
  console.log('Formatting SAP simulation payload');
  console.log('Using SAP Codes - SoldTo:', soldToId, 'ShipTo:', shipToId);
  
  // Debug: Print cart contents
  console.log('Cart contents for SAP simulation:');
  console.log(JSON.stringify(cart, null, 2));
  
  // Debug: Print all product SAP codes
  console.log('Product SAP codes available:');
  productSapCodes.forEach((code, id) => {
    console.log(`Product ID ${id} -> SAP code: ${code}`);
  });
  
  // Use SAP configuration from credentials or defaults
  const salesOrg = sapCreds.sales_organization || "1710";
  const distChannel = sapCreds.distribution_channel || "10";
  const division = sapCreds.division || "00";
  
  // Create the base payload
  const payload = {
    SalesOrderType: "OR",
    SalesOrganization: salesOrg,
    DistributionChannel: distChannel,
    OrganizationDivision: division,
    SoldToParty: soldToId,
    PurchaseOrderByCustomer: "Simulated via B2B Portal",
    CustomerPaymentTerms: "",
    to_Item: cart.items.map((item: any, index: number) => {
      // Priority for SAP product code:
      // 1. Use the sapProductCode directly from the cart item
      // 2. Use the productSapCodes map only as fallback
      // 3. Use default FG226 if all else fails
      
      const sapProductCode = item.sapProductCode || 
                           (typeof item.productId === 'number' && productSapCodes.get(item.productId)) || 
                           'FG226';
                           
      console.log(`Item ${index+1}: Using SAP code for product ${item.productId}: ${sapProductCode}`);
      
      // Format the item number as a 10-character string with leading zeros
      const itemNumber = (index + 1).toString().padStart(2, '0');
      
      // Check if this is a configured item
      let itemData = {
        SalesOrderItem: itemNumber,
        HigherLevelItem: "0",
        SalesOrderItemCategory: "TAN",
        PurchaseOrderByCustomer: "Simulated via B2B Portal",
        Material: sapProductCode,
        RequestedQuantity: item.quantity.toString(),
        DeliveryPriority: "2",
        to_ScheduleLine: [], // Empty array to trigger schedule line generation in SAP
        to_PricingElement: []
      };
      
      // Add configuration information for debugging purposes
      if (item.configuration) {
        console.log(`Item ${index+1} has configuration:`, JSON.stringify(item.configuration, null, 2));
      }
      
      return itemData;
    }),
    // Important: Include the empty to_Pricing object to trigger pricing simulation
    to_Pricing: {},
    to_PricingElement: [
      // Add standard discount condition for simulation
      {
        ConditionType: "DRN1",
        ConditionRateValue: "5"
      }
    ],
    to_Partner: [
      // Add sold-to party
      {
        PartnerFunction: "SP",
        Customer: soldToId
      },
      // Add ship-to party
      {
        PartnerFunction: "SH",
        Customer: shipToId || soldToId // Fallback to sold-to if ship-to is missing
      }
    ],
    to_Credit: {}
  };

  console.log('SAP simulation payload items:');
  payload.to_Item.forEach((item: any) => {
    console.log(`Item ${item.SalesOrderItem}: Material ${item.Material}, Quantity ${item.RequestedQuantity}`);
  });
  
  return payload;
}
