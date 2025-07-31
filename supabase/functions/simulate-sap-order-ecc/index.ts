
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

interface SimulationRequest {
  cart: {
    items: CartItem[];
  };
  soldTo: SoldToParty;
  shipTo: ShipToParty;
  productSapCodes: Record<number, string>;
}

Deno.serve(async (req) => {
  console.log('ECC SAP simulation function called');
  
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

    const body: SimulationRequest = await req.json();
    console.log('ECC simulation request body:', JSON.stringify(body, null, 2));

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

    console.log('Processing ECC simulation for:', { 
      soldToId: soldToSapId, 
      shipToId: shipToSapId, 
      itemCount: body.cart.items.length 
    });

    // Format date for ECC (YYYYMMDD format)
    const today = new Date();
    const formattedDate = today.getFullYear().toString() + 
                         (today.getMonth() + 1).toString().padStart(2, '0') + 
                         today.getDate().toString().padStart(2, '0');
    
    console.log('Using simulation date:', formattedDate);

    // Build ECC simulation payload
    const eccPayload = {
      "cond_grp": "",
      "cond_grp3": "",
      "convert_parvw_auart": "",
      "web_matnr": "Test",
      "billing_party": [],
      "messagetable": [],
      "order_ccard": [],
      "order_ccard_ex": [],
      "order_condition_ex": [],
      "order_header_in": {
        "DOC_TYPE": "TA",
        "SALES_ORG": credentials.sales_organization,
        "DISTR_CHAN": credentials.distribution_channel,
        "DIVISION": credentials.division,
        "REQ_DATE_H": formattedDate,
        "PURCH_NO": "WebPONr",
        "INCOTERMS1": "EXW",
        "INCOTERMS2": "EXWORKS"
      },
      "order_incomplete": [],
      "order_items_in": [] as any[],
      "order_cfgs_ref": [] as any[],
      "order_cfgs_inst": [] as any[],
      "order_cfgs_value": [] as any[],
      "order_items_out": [],
      "order_partners": [
        {
          "PARTN_ROLE": "WE",
          "PARTN_NUMB": soldToSapId,
          "ITM_NUMBER": "000000"
        },
        {
          "PARTN_ROLE": "AG", 
          "PARTN_NUMB": soldToSapId,
          "ITM_NUMBER": "000000"
        }
      ],
      "order_schedule_ex": [],
      "order_schedule_in": [],
      "partneraddresses": [],
      "return": [],
      "ship_to_party": [],
      "sold_to_party": []
    };

    console.log('Initial ECC payload structure created');

    // Process cart items
    body.cart.items.forEach((item, index) => {
      const itemNumber = (10 * (index + 1)).toString().padStart(6, '0');
      
      // Multiply quantity by 1000 for SAP ECC
      const sapQuantity = (item.quantity * 1000).toString();
      
      console.log(`Processing cart item ${index + 1}:`, {
        productId: item.productId,
        sapProductCode: item.sapProductCode,
        originalQuantity: item.quantity,
        sapQuantity: sapQuantity,
        itemNumber,
        hasConfiguration: !!item.configuration
      });

      // Add order item
      eccPayload.order_items_in.push({
        "ITM_NUMBER": itemNumber,
        "PO_ITM_NO": itemNumber,
        "MATERIAL": item.sapProductCode,
        "REQ_DATE": formattedDate,
        "REQ_QTY": sapQuantity,
        "TARGET_QTY": sapQuantity
      });

      // Process configuration if present
      if (item.configuration && item.configuration.attributes.length > 0) {
        const configId = (index + 1).toString().padStart(5, '0');
        const instanceId = (index + 1).toString().padStart(8, '0');

        console.log(`Processing configuration for item ${itemNumber}:`, {
          productId: item.configuration.productId,
          attributes: item.configuration.attributes,
          totalPrice: item.configuration.totalPrice
        });

        // Add configuration reference
        eccPayload.order_cfgs_ref.push({
          "POSEX": itemNumber,
          "CONFIG_ID": configId,
          "ROOT_ID": instanceId
        });

        // Add configuration instance
        eccPayload.order_cfgs_inst.push({
          "CONFIG_ID": configId,
          "INST_ID": instanceId,
          "OBJ_TYPE": "MARA",
          "CLASS_TYPE": "300",
          "OBJ_KEY": item.sapProductCode
        });

        // Add configuration values
        item.configuration.attributes.forEach(attribute => {
          console.log(`Processing attribute:`, {
            name: attribute.name,
            value: attribute.value,
            sapCharacteristic: attribute.sapCharacteristic,
            sapValueCode: attribute.sapValueCode
          });

          console.log(`Using SAP mapping: ${attribute.sapCharacteristic} = ${attribute.sapValueCode}`);

          // Add configuration value without value_long field
          eccPayload.order_cfgs_value.push({
            "CONFIG_ID": configId,
            "INST_ID": instanceId,
            "CHARC": attribute.sapCharacteristic,
            "VALUE": attribute.sapValueCode
          });
        });
      }
    });

    console.log('=== FINAL ECC SIMULATION PAYLOAD ===');
    console.log(JSON.stringify(eccPayload, null, 2));
    console.log('=== END PAYLOAD ===');

    // Make the ECC API call
    const eccEndpoint = `${credentials.ecc_server}/sap/zfmcall/BAPI_SALESORDER_SIMULATE?format=json&show_import_params=X`;
    console.log('Calling ECC endpoint:', eccEndpoint);

    const eccResponse = await fetch(eccEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sap-user': credentials.sap_user,
        'sap-password': credentials.sap_password
      },
      body: JSON.stringify(eccPayload)
    });

    console.log('ECC response status:', eccResponse.status);

    if (!eccResponse.ok) {
      throw new Error(`ECC API returned ${eccResponse.status}: ${eccResponse.statusText}`);
    }

    const eccData = await eccResponse.json();
    console.log('ECC simulation response:', JSON.stringify(eccData, null, 2));

    // Process the ECC response
    const messages = eccData.messagetable || [];
    const hasErrors = messages.some((msg: any) => msg.type === 'E');
    
    console.log('Processed messages:', messages);
    console.log('Has errors:', hasErrors);

    // Extract pricing information from order_items_out
    let pricing = {
      netValue: 0,
      taxAmount: 0, 
      grossValue: 0,
      currency: 'USD',
      items: [] as any[]
    };

    if (eccData.order_items_out && Array.isArray(eccData.order_items_out)) {
      console.log('Processing order_items_out for pricing:', eccData.order_items_out);
      
      eccData.order_items_out.forEach((item: any, index: number) => {
        // Extract net value from net_value1 field and convert back from SAP format
        const netValue1 = parseFloat(item.net_value1 || '0');
        const originalQuantity = body.cart.items[index]?.quantity || 1;
        
        console.log(`Item ${index}: net_value1=${item.net_value1}, originalQuantity=${originalQuantity}`);
        
        const itemPricing = {
          itemNumber: item.ITM_NUMBER || String((index + 1) * 10).padStart(6, '0'),
          material: item.MATERIAL || '',
          quantity: originalQuantity,
          unitPrice: netValue1 / originalQuantity,
          netValue: netValue1,
          taxAmount: 0, // ECC may not provide tax breakdown in simulation
          description: item.SHORT_TEXT || ''
        };
        
        pricing.items.push(itemPricing);
        pricing.netValue += netValue1;
      });
      
      pricing.grossValue = pricing.netValue + pricing.taxAmount;
      console.log('Final pricing calculation:', pricing);
    } else {
      console.log('No order_items_out found in ECC response');
    }

    console.log('Extracted pricing:', pricing);

    const finalResponse = {
      success: true,
      simulationResults: {
        pricing
      },
      messages,
      rawEccResponse: eccData
    };

    console.log('Final ECC simulation response:', JSON.stringify(finalResponse, null, 2));

    return new Response(JSON.stringify(finalResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in ECC simulation:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
