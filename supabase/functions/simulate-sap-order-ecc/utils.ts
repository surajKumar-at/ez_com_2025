
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { ConfigurationMapping } from './types.ts';

// Helper function to pad SAP customer codes to 10 characters
export const padSapCode = (code: string): string => {
  if (!code) return code;
  
  // If the code is numeric, pad with leading zeros to 10 characters
  if (/^\d+$/.test(code)) {
    const paddedCode = code.padStart(10, '0');
    console.log(`Padded SAP code: ${code} -> ${paddedCode}`);
    return paddedCode;
  }
  
  // If not numeric, return as-is
  return code;
};

// Get current date in YYYYMMDD format
export const getCurrentDate = (): string => {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
};

// Fetch configuration mappings from database
export const fetchConfigurationMappings = async (
  supabase: any, 
  attributeIds: (string | number)[], 
  valueIds: (string | number)[]
): Promise<{ charMapping: Record<string, string>; valueMapping: Record<string, string> }> => {
  console.log('Looking up attribute and value details:', { attributeIds, valueIds });

  // Get SAP characteristics for the configured attributes
  const { data: sapCharacteristics, error: charError } = await supabase
    .from('configurable_attributes')
    .select('id, name, sap_characteristic')
    .in('id', attributeIds);

  if (charError) {
    console.error('Error fetching SAP characteristics:', charError);
  }

  // Get attribute value codes
  const { data: attributeValues, error: valuesError } = await supabase
    .from('attribute_values')
    .select('id, attribute_id, value, label')
    .in('id', valueIds);

  if (valuesError) {
    console.error('Error fetching attribute values:', valuesError);
  }

  console.log('SAP characteristics found:', sapCharacteristics);
  console.log('Attribute values found:', attributeValues);

  // Create mappings
  const charMapping: Record<string, string> = {};
  if (sapCharacteristics) {
    sapCharacteristics.forEach(char => {
      if (char.sap_characteristic) {
        charMapping[char.id] = char.sap_characteristic;
      }
    });
  }

  const valueMapping: Record<string, string> = {};
  if (attributeValues) {
    attributeValues.forEach(val => {
      valueMapping[val.id] = val.value;
    });
  }

  console.log('Characteristic mapping:', charMapping);
  console.log('Value mapping:', valueMapping);

  return { charMapping, valueMapping };
};

// Resolve ship-to SAP code
export const resolveShipToSapCode = async (supabase: any, shipTo: any): Promise<string> => {
  let shipToSapCode = shipTo.sapCode;
  
  if (!shipToSapCode && shipTo.address) {
    shipToSapCode = shipTo.address.sapAddressNumber;
  }
  
  if (!shipToSapCode) {
    console.log('No SAP code found for ship-to, looking up by ID:', shipTo.id);
    
    const { data: shipToParty, error: shipToError } = await supabase
      .from('ship_to_parties')
      .select(`
        *,
        addresses!ship_to_parties_address_id_fkey (
          sap_address_number
        )
      `)
      .eq('id', shipTo.id)
      .single();
      
    if (shipToParty && !shipToError) {
      console.log('Found ship-to party with address:', shipToParty);
      if (shipToParty.addresses && shipToParty.addresses.sap_address_number) {
        shipToSapCode = shipToParty.addresses.sap_address_number;
        console.log('Using SAP address number from linked address:', shipToSapCode);
      } else {
        console.log('No SAP address number found in linked address, using party ID as fallback');
        shipToSapCode = shipToParty.id;
      }
    } else {
      console.log('Ship-to party lookup failed:', shipToError);
      shipToSapCode = shipTo.id;
    }
  }
  
  return padSapCode(shipToSapCode);
};
