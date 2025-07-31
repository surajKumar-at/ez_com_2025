
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface CartItem {
  productId: number;
  quantity: number;
  sapProductCode: string;
  configuration?: {
    productId: number;
    attributes: Array<{
      name: string;
      value: string;
      additionalPrice: number;
      sapCharacteristic: string;
      sapValueCode: string;
    }>;
    totalPrice: number;
  };
}

interface SoldToParty {
  id: string;
  name: string;
  sapCode: string;
  addresses: Array<{
    sapAddressNumber: string;
  }>;
}

interface ShipToParty {
  id: string;
  name: string;
  soldToId: string;
  address: {
    sapAddressNumber: string;
  };
}

interface OrderCreateRequest {
  cart: {
    items: CartItem[];
  };
  soldTo: SoldToParty;
  shipTo: ShipToParty;
  productSapCodes: Record<number, string>;
  poNumber?: string;
}

Deno.serve(async (req) => {
  console.log('ECC SAP order creation function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authentication from headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client for authentication verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Authenticated user:', user.email);

    const body: OrderCreateRequest = await req.json();
    console.log('ECC order creation request body:', JSON.stringify(body, null, 2));

    // Get ECC credentials
    const { data: credentials, error: credError } = await supabase
      .from('sap_credentials')
      .select('*')
      .eq('sap_system_type', 'ECC')
      .single();

    if (credError || !credentials) {
      return new Response(JSON.stringify({
        success: false,
        error: 'ECC credentials not found'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('ECC credentials loaded:', {
      server: credentials.ecc_server,
      salesOrg: credentials.sales_organization,
      distChannel: credentials.distribution_channel,
      division: credentials.division
    });

    // Helper function to pad SAP codes
    const padSapCode = (code: string): string => {
      const cleanCode = code.replace(/^0+/, ''); // Remove leading zeros
      const paddedCode = cleanCode.padStart(10, '0'); // Pad to 10 digits
      console.log(`Padded SAP code: ${code} -> ${paddedCode}`);
      return paddedCode;
    };

    const soldToSapId = padSapCode(body.soldTo.sapCode);
    const shipToSapId = padSapCode(body.shipTo.address.sapAddressNumber);

    console.log('Processing ECC order creation for:', { 
      soldToId: soldToSapId, 
      shipToId: shipToSapId, 
      itemCount: body.cart.items.length 
    });

    // Format date for ECC (YYYYMMDD format)
    const today = new Date();
    const formattedDate = today.getFullYear().toString() + 
                         (today.getMonth() + 1).toString().padStart(2, '0') + 
                         today.getDate().toString().padStart(2, '0');
    
    console.log('Using order date:', formattedDate);

    // Build ECC order creation payload
    const eccPayload = {
      "logic_switch": "",
      "order_header_in": {
        "DOC_TYPE": "TA",
        "SALES_ORG": credentials.sales_organization,
        "DISTR_CHAN": credentials.distribution_channel,
        "DIVISION": credentials.division,
        "REQ_DATE_H": formattedDate,
        "PURCH_NO": body.poNumber || "WebPONr",
        "PURCH_NO_C":body.poNumber || "WebPONr"
      },
      "order_header_inx": {
        "DOC_TYPE": "X",
        "SALES_ORG": "X",
        "DISTR_CHAN": "X",
        "DIVISION": "X",
        "REQ_DATE_H": "X",
        "PURCH_NO": "X"
      },
      "order_items_in": [] as any[],
      "order_items_inx": [] as any[],
      "order_partners": [
        {
          "PARTN_ROLE": "WE",
          "PARTN_NUMB": shipToSapId,
          "ITM_NUMBER": "000000"
        },
        {
          "PARTN_ROLE": "AG",
          "PARTN_NUMB": soldToSapId,
          "ITM_NUMBER": "000000"
        }
      ],
      "order_schedules_in": [] as any[],
      "order_schedules_inx": [] as any[],
      "order_cfgs_ref": [] as any[],
      "order_cfgs_inst": [] as any[],
      "order_cfgs_value": [] as any[],
      "partneraddresses": [],
      "return": []
    };

    console.log('Initial ECC order payload structure created');

    // Process cart items
    let configId = 1;
    
    for (let i = 0; i < body.cart.items.length; i++) {
      const item = body.cart.items[i];
      const itemNumber = String((i + 1) * 10).padStart(6, '0');
      const sapProductCode = item.sapProductCode || body.productSapCodes?.[item.productId] || item.productId.toString();
      
      // Use original quantity without multiplying by 1000 for creation
      const sapQuantity = item.quantity.toString();
      
      console.log(`Processing cart item ${i + 1}:`, {
        productId: item.productId,
        sapProductCode: sapProductCode,
        originalQuantity: item.quantity,
        sapQuantity: sapQuantity,
        itemNumber: itemNumber,
        hasConfiguration: !!item.configuration
      });
      
      // Add order item
      eccPayload.order_items_in.push({
        "ITM_NUMBER": itemNumber,
        "PO_ITM_NO": itemNumber,
        "MATERIAL": sapProductCode,
        "TARGET_QTY": sapQuantity
      });

      // Add corresponding inx entry
      eccPayload.order_items_inx.push({
        "ITM_NUMBER": itemNumber,
        "PO_ITM_NO": "X",
        "MATERIAL": "X",
        "TARGET_QTY": "X"
      });

      // Add schedule line
      eccPayload.order_schedules_in.push({
        "ITM_NUMBER": itemNumber,
        "SCHED_LINE": "0001",
        "REQ_DATE": formattedDate,
        "REQ_QTY": sapQuantity
      });

      // Add corresponding schedule inx entry
      eccPayload.order_schedules_inx.push({
        "ITM_NUMBER": itemNumber,
        "SCHED_LINE": "X",
        "REQ_DATE": "X",
        "REQ_QTY": "X"
      });

      // Handle configurable products
      if (item.configuration && item.configuration.attributes && item.configuration.attributes.length > 0) {
        console.log(`Processing configuration for item ${itemNumber}:`, item.configuration);
        
        const currentConfigId = String(configId).padStart(5, '0');
        const rootId = String(configId).padStart(8, '0');
        
        // Add configuration reference
        eccPayload.order_cfgs_ref.push({
          "POSEX": itemNumber,
          "CONFIG_ID": currentConfigId,
          "ROOT_ID": rootId
        });

        // Add configuration instance
        eccPayload.order_cfgs_inst.push({
          "CONFIG_ID": currentConfigId,
          "INST_ID": rootId,
          "OBJ_TYPE": "MARA",
          "CLASS_TYPE": "300",
          "OBJ_KEY": sapProductCode
        });

        // Add configuration values
        for (const attr of item.configuration.attributes) {
          console.log('Processing attribute:', {
            name: attr.name,
            value: attr.value,
            sapCharacteristic: attr.sapCharacteristic,
            sapValueCode: attr.sapValueCode
          });
          
          const sapCharacteristic = attr.sapCharacteristic;
          const sapValueCode = attr.sapValueCode;
          
          if (sapCharacteristic && sapValueCode) {
            console.log(`Using SAP mapping: ${sapCharacteristic} = ${sapValueCode}`);
            eccPayload.order_cfgs_value.push({
              "CONFIG_ID": currentConfigId,
              "INST_ID": rootId,
              "CHARC": sapCharacteristic,
              "VALUE": sapValueCode
            });
          } else {
            console.warn(`Missing SAP codes for attribute: ${attr.name}`);
            // Fallback to display values if SAP codes are missing
            eccPayload.order_cfgs_value.push({
              "CONFIG_ID": currentConfigId,
              "INST_ID": rootId,
              "CHARC": attr.name || `ATTR_${configId}`,
              "VALUE": attr.value
            });
          }
        }
        
        configId++;
      }
    }

    console.log('=== FINAL ECC ORDER CREATION PAYLOAD ===');
    console.log(JSON.stringify(eccPayload, null, 2));
    console.log('=== END PAYLOAD ===');

    // Make the ECC API call for order creation
    const eccEndpoint = `${credentials.ecc_server}/sap/zfmcall/Z_EZ_SALESORDER_CREATEDEMO2A?format=json&show_import_params=X`;
    console.log('Calling ECC order creation endpoint:', eccEndpoint);

    const eccResponse = await fetch(eccEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sap-user': credentials.sap_user,
        'sap-password': credentials.sap_password
      },
      body: JSON.stringify(eccPayload)
    });

    console.log('ECC order creation response status:', eccResponse.status);

    if (!eccResponse.ok) {
      throw new Error(`ECC API returned ${eccResponse.status}: ${eccResponse.statusText}`);
    }

    const eccData = await eccResponse.json();
    console.log('ECC order creation response:', JSON.stringify(eccData, null, 2));

    // Process the ECC response
    const messages = eccData.return || [];
    const hasErrors = messages.some((msg: any) => msg.type === 'E');
    
    console.log('Processed messages:', messages);
    console.log('Has errors:', hasErrors);

    // Extract sales document number if successful
    let salesOrderNumber = null;
    if (!hasErrors && eccData.salesdocument) {
      salesOrderNumber = eccData.salesdocument;
      console.log('Sales order created successfully:', salesOrderNumber);
    }

    const finalResponse = {
      success: !hasErrors,
      salesOrderNumber,
      messages,
      rawEccResponse: eccData
    };

    console.log('Final ECC order creation response:', JSON.stringify(finalResponse, null, 2));

    return new Response(JSON.stringify(finalResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ECC order creation:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
