
export const processEccResponse = (eccResult: any) => {
  const messages = [];
  let hasErrors = false;

  // Check for errors in the return table
  if (eccResult.return && Array.isArray(eccResult.return)) {
    for (const returnItem of eccResult.return) {
      if (returnItem.type === 'E') {
        hasErrors = true;
        messages.push({
          type: 'E',
          message: returnItem.message || 'Unknown error from SAP ECC',
          messageId: returnItem.code,
          messageNumber: returnItem.log_msg_no
        });
      } else if (returnItem.type === 'W') {
        messages.push({
          type: 'W',
          message: returnItem.message || 'Warning from SAP ECC',
          messageId: returnItem.code,
          messageNumber: returnItem.log_msg_no
        });
      } else if (returnItem.type === 'I' || returnItem.type === 'S') {
        messages.push({
          type: returnItem.type,
          message: returnItem.message || 'Information from SAP ECC',
          messageId: returnItem.code,
          messageNumber: returnItem.log_msg_no
        });
      }
    }
  }

  console.log('Processed messages:', messages);
  console.log('Has errors:', hasErrors);

  // Extract pricing information if available
  let pricing = null;
  if (eccResult.order_items_out && Array.isArray(eccResult.order_items_out)) {
    console.log('Processing order_items_out for pricing:', eccResult.order_items_out);
    
    const items = eccResult.order_items_out.map((item, index) => {
      console.log(`Item ${index}: net_value1=${item.net_value1}, originalQuantity=${item.req_qty}`);
      console.log(`Item ${index} material fields:`, {
        material: item.material,
        mat_entrd: item.mat_entrd,
        material_long: item.material_long,
        mat_entrd_long: item.mat_entrd_long
      });
      
      // Extract material code - try multiple fields to ensure we get the material
      let materialCode = '';
      if (item.material && item.material.trim()) {
        materialCode = item.material.trim();
      } else if (item.mat_entrd && item.mat_entrd.trim()) {
        materialCode = item.mat_entrd.trim();
      } else if (item.material_long && item.material_long.trim()) {
        materialCode = item.material_long.trim();
      } else if (item.mat_entrd_long && item.mat_entrd_long.trim()) {
        materialCode = item.mat_entrd_long.trim();
      }
      
      console.log(`Item ${index} final material code:`, materialCode);
      
      return {
        itemNumber: item.itm_number || String((index + 1) * 10).padStart(6, '0'),
        material: materialCode, // Use the extracted material code
        quantity: parseFloat(item.req_qty || '0'),
        unitPrice: parseFloat(item.net_value1 || '0'), // Use net_value1 which contains the actual unit price
        netValue: parseFloat(item.net_value1 || '0'),
        taxAmount: parseFloat(item.tx_doc_cur || '0'), // Use tx_doc_cur for tax
        description: item.short_text || ''
      };
    });

    const netValue = items.reduce((sum, item) => sum + item.netValue, 0);
    const taxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);

    pricing = {
      netValue,
      taxAmount,
      grossValue: netValue + taxAmount,
      currency: eccResult.order_header_in?.CURRENCY || 'USD',
      items
    };

    console.log('Extracted pricing:', pricing);
  }

  return {
    success: !hasErrors,
    simulationResults: pricing ? { pricing } : null,
    messages,
    rawEccResponse: eccResult
  };
};
