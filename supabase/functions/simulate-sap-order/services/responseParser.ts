
/**
 * Extract relevant pricing information from the simulation results
 */
export function extractPricingInfo(simulationResults: any) {
  try {
    const result = {
      netValue: 0,
      taxAmount: 0,
      totalDiscount: 0,
      grossValue: 0,
      currency: "USD",
      items: [],
      scheduleLines: []
    };
    
    // Extract header-level pricing info if available
    if (simulationResults.d) {
      // First try to extract from the main order data
      result.netValue = parseFloat(simulationResults.d.NetAmount) || 0;
      result.taxAmount = parseFloat(simulationResults.d.TaxAmount) || 0;
      result.grossValue = parseFloat(simulationResults.d.TotalNetAmount) || 0;
      result.currency = simulationResults.d.TransactionCurrency || "USD";
      
      // If there's a to_Pricing object, extract data from there as it's more reliable
      if (simulationResults.d.to_Pricing && typeof simulationResults.d.to_Pricing === 'object') {
        // Check if it has results array or is a direct object
        const pricingData = simulationResults.d.to_Pricing.results?.[0] || simulationResults.d.to_Pricing;
        
        if (pricingData) {
          console.log("Found pricing data in to_Pricing:", pricingData);
          // Override with more accurate pricing data if available
          result.netValue = parseFloat(pricingData.NetAmount || pricingData.TotalNetAmount) || result.netValue;
          result.grossValue = parseFloat(pricingData.TotalNetAmount) || result.grossValue;
          result.currency = pricingData.TransactionCurrency || result.currency;
        }
      }
      
      // Extract item-level pricing if available
      if (simulationResults.d.to_Item && simulationResults.d.to_Item.results) {
        result.items = simulationResults.d.to_Item.results.map((item: any) => ({
          itemNumber: item.SalesOrderItem,
          material: item.Material,
          description: item.SalesOrderItemText,
          quantity: parseFloat(item.RequestedQuantity) || 0,
          netPrice: parseFloat(item.NetPriceAmount) || 0,
          netValue: parseFloat(item.NetAmount) || 0,
          taxAmount: parseFloat(item.TaxAmount) || 0,
          currency: item.TransactionCurrency || result.currency
        }));
        
        // Extract schedule lines if available
        simulationResults.d.to_Item.results.forEach((item: any) => {
          if (item.to_ScheduleLine && item.to_ScheduleLine.results && item.to_ScheduleLine.results.length > 0) {
            console.log(`Extracting ${item.to_ScheduleLine.results.length} schedule lines for item ${item.SalesOrderItem}`);
            
            item.to_ScheduleLine.results.forEach((scheduleLine: any) => {
              // Pass the raw SAP date format "/Date(timestamp)/" directly to the frontend
              let requestedDate = scheduleLine.RequestedDeliveryDate || null;
              let confirmedDate = scheduleLine.ConfirmedDeliveryDate || requestedDate || null;
              
              // Log the raw date formats for debugging
              console.log(`Schedule line date formats - Item: ${item.SalesOrderItem}, Line: ${scheduleLine.ScheduleLine}`);
              console.log(`  RequestedDate (raw): ${scheduleLine.RequestedDeliveryDate}`);
              console.log(`  ConfirmedDate (raw): ${scheduleLine.ConfirmedDeliveryDate}`);
              
              // Parse quantity
              const orderQuantity = parseFloat(scheduleLine.ScheduleLineOrderQuantity || scheduleLine.OrderQuantity || "0");
              
              result.scheduleLines.push({
                itemNumber: item.SalesOrderItem,
                scheduleLine: scheduleLine.ScheduleLine,
                requestedDeliveryDate: requestedDate,
                confirmedDeliveryDate: confirmedDate,
                orderQuantity: orderQuantity
              });
              
              console.log(`Parsed schedule line: Item ${item.SalesOrderItem}, Line ${scheduleLine.ScheduleLine}, Quantity ${orderQuantity}, Date ${confirmedDate || requestedDate}`);
            });
          }
        });
      }
      
      // Extract pricing elements if available
      if (simulationResults.d.to_PricingElement && simulationResults.d.to_PricingElement.results) {
        let totalDiscount = 0;
        simulationResults.d.to_PricingElement.results.forEach((element: any) => {
          if (element.ConditionType && element.ConditionType.startsWith('D')) {
            const discountAmount = parseFloat(element.ConditionAmount) || 0;
            console.log(`Found discount: ${element.ConditionType} = ${discountAmount}`);
            totalDiscount += discountAmount;
          }
        });
        result.totalDiscount = totalDiscount;
        console.log(`Total discount calculated: ${totalDiscount}`);
      }
    }
    
    console.log("Extracted pricing info:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Error extracting pricing info:", error);
    return {
      netValue: 0,
      taxAmount: 0,
      totalDiscount: 0,
      grossValue: 0,
      currency: "USD",
      items: [],
      scheduleLines: []
    };
  }
}
