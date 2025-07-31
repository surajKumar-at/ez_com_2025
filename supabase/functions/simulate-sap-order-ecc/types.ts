
export interface EccCredentials {
  ecc_server: string;
  sales_organization: string;
  distribution_channel: string;
  division: string;
  sap_user: string;
  sap_password: string;
}

export interface EccSimulationRequest {
  cart: any;
  soldTo: any;
  shipTo: any;
  productSapCodes: Record<number, string>;
}

export interface ConfigurationMapping {
  attributeId: string | number;
  valueId: string | number;
  sapCharacteristic?: string;
  sapValueCode?: string;
  fallbackName?: string;
  fallbackValue?: string;
}

export interface EccPayload {
  cond_grp: string;
  cond_grp3: string;
  convert_parvw_auart: string;
  web_matnr: string;
  billing_party: any[];
  messagetable: any[];
  order_ccard: any[];
  order_ccard_ex: any[];
  order_condition_ex: any[];
  order_header_in: any;
  order_incomplete: any[];
  order_items_in: any[];
  order_cfgs_ref: any[];
  order_cfgs_inst: any[];
  order_cfgs_value: any[];
  order_items_out: any[];
  order_partners: any[];
  order_schedule_ex: any[];
  order_schedule_in: any[];
  partneraddresses: any[];
  return: any[];
  ship_to_party: any[];
  sold_to_party: any[];
}
