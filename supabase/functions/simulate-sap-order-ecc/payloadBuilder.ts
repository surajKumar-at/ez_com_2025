
import { EccPayload, EccCredentials } from './types.ts';
import { getCurrentDate } from './utils.ts';

export const buildEccPayload = async (
  supabase: any,
  cart: any, 
  soldToSapCode: string, 
  shipToSapCode: string, 
  credentials: EccCredentials,
  productSapCodes: Record<number, string>
): Promise<EccPayload> => {
  const currentDate = getCurrentDate();
  console.log('Using simulation date:', currentDate);

  // Build initial ECC simulation payload
  const eccPayload: EccPayload = {
    cond_grp: "",
    cond_grp3: "",
    convert_parvw_auart: "",
    web_matnr: "Test",
    billing_party: [],
    messagetable: [],
    order_ccard: [],
    order_ccard_ex: [],
    order_condition_ex: [],
    order_header_in: {
      DOC_TYPE: "TA",
      SALES_ORG: credentials.sales_organization || "1710",
      DISTR_CHAN: credentials.distribution_channel || "10",
      DIVISION: credentials.division || "00",
      REQ_DATE_H: currentDate,
      PURCH_NO: "WebPONr",
      INCOTERMS1: "EXW",
      INCOTERMS2: "EXWORKS"
    },
    order_incomplete: [],
    order_items_in: [],
    order_cfgs_ref: [],
    order_cfgs_inst: [],
    order_cfgs_value: [],
    order_items_out: [],
    order_partners: [
      {
        PARTN_ROLE: "WE",
        PARTN_NUMB: shipToSapCode,
        ITM_NUMBER: "000000"
      },
      {
        PARTN_ROLE: "AG",
        PARTN_NUMB: soldToSapCode,
        ITM_NUMBER: "000000"
      }
    ],
    order_schedule_ex: [],
    order_schedule_in: [],
    partneraddresses: [],
    return: [],
    ship_to_party: [],
    sold_to_party: []
  };

  console.log('Initial ECC payload structure created');

  // Process cart items
  let configId = 1;
  
  for (let i = 0; i < cart.items.length; i++) {
    const item = cart.items[i];
    const itemNumber = String((i + 1) * 10).padStart(6, '0');
    const sapProductCode = item.sapProductCode || productSapCodes?.[item.productId] || item.productId.toString();
    
    console.log(`Processing cart item ${i + 1}:`, {
      productId: item.productId,
      sapProductCode: sapProductCode,
      quantity: item.quantity,
      itemNumber: itemNumber,
      hasConfiguration: !!item.configuration
    });
    
    // Add line item
    eccPayload.order_items_in.push({
      ITM_NUMBER: itemNumber,
      PO_ITM_NO: itemNumber,
      MATERIAL: sapProductCode,
      REQ_DATE: currentDate,
      REQ_QTY: item.quantity.toString(),
      TARGET_QTY: item.quantity.toString()
    });

    // Handle configurable products
    if (item.configuration && item.configuration.attributes && item.configuration.attributes.length > 0) {
      await processConfiguration(eccPayload, item, itemNumber, sapProductCode, configId);
      configId++;
    }
  }

  return eccPayload;
};

const processConfiguration = async (
  eccPayload: EccPayload,
  item: any,
  itemNumber: string,
  sapProductCode: string,
  configId: number
) => {
  console.log(`Processing configuration for item ${itemNumber}:`, item.configuration);
  
  const currentConfigId = String(configId).padStart(5, '0');
  const rootId = String(configId).padStart(8, '0');
  
  // Add configuration reference
  eccPayload.order_cfgs_ref.push({
    POSEX: itemNumber,
    CONFIG_ID: currentConfigId,
    ROOT_ID: rootId
  });

  // Add configuration instance
  eccPayload.order_cfgs_inst.push({
    CONFIG_ID: currentConfigId,
    INST_ID: rootId,
    OBJ_TYPE: "MARA",
    CLASS_TYPE: "300",
    OBJ_KEY: sapProductCode
  });

  // Add configuration values - use SAP codes from cart configuration
  for (const attr of item.configuration.attributes) {
    console.log('Processing attribute:', {
      name: attr.name,
      value: attr.value,
      sapCharacteristic: attr.sapCharacteristic,
      sapValueCode: attr.sapValueCode
    });
    
    // Use SAP characteristic and value codes from the cart configuration
    const sapCharacteristic = attr.sapCharacteristic;
    const sapValueCode = attr.sapValueCode;
    
    if (sapCharacteristic && sapValueCode) {
      console.log(`Using SAP mapping: ${sapCharacteristic} = ${sapValueCode}`);
      eccPayload.order_cfgs_value.push({
        CONFIG_ID: currentConfigId,
        INST_ID: rootId,
        CHARC: sapCharacteristic,
        VALUE: sapValueCode
      });
    } else {
      console.warn(`Missing SAP codes for attribute: ${attr.name}`, {
        sapCharacteristic: sapCharacteristic,
        sapValueCode: sapValueCode
      });
      // Fallback to display values if SAP codes are missing
      eccPayload.order_cfgs_value.push({
        CONFIG_ID: currentConfigId,
        INST_ID: rootId,
        CHARC: attr.name || `ATTR_${attr.valueId}`,
        VALUE: attr.value
      });
    }
  }
};
