
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function getSapAvailability(productCode: string) {
  // Get SAP credentials from the database
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get SAP credentials
  const { data: credentials, error: credError } = await supabase
    .from('sap_credentials')
    .select('*')
    .limit(1)
    .single();
    
  if (credError) {
    throw new Error(`Failed to retrieve SAP credentials: ${credError.message}`);
  }
  
  const { sap_user, sap_password, server } = credentials;
  
  // Format current date as ISO string with proper datetimeoffset format
  const now = new Date();
  const isoString = now.toISOString();
  // Format as datetimeoffset'2017-12-31T23:59:59Z' with single quotes
  const datetimeFormat = `datetimeoffset'${isoString}'`;
  // URL encode the datetime string
  const encodedDateTime = encodeURIComponent(datetimeFormat);
  
  console.log(`Using datetime in SAP-required format: ${datetimeFormat}`);
  
  // Construct the URL with proper date formatting for Edm.DateTimeOffset
  const availabilityUrl = `${server}/sap/opu/odata/SAP/API_PRODUCT_AVAILY_INFO_BASIC/DetermineAvailabilityAt`
    + `?RequestedQuantityInBaseUnit=1.0M`
    + `&Material='${productCode}'`
    + `&SupplyingPlant='1710'`
    + `&ATPCheckingRule='A'`
    + `&RequestedUTCDateTime=${encodedDateTime}`
    + `&$format=json`;
  
  console.log(`Using availability URL: ${availabilityUrl}`);
  
  try {
    // Direct GET request to the API without CSRF token for GET operations
    const authHeader = `Basic ${btoa(`${sap_user}:${sap_password}`)}`;
    console.log(`Authentication header constructed (not showing actual value for security)`);
    console.log(`Making GET request to SAP API with headers: Authorization, Accept: application/json`);
    
    const availabilityResponse = await fetch(availabilityUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`SAP API response status: ${availabilityResponse.status} ${availabilityResponse.statusText}`);
    
    if (!availabilityResponse.ok) {
      console.error(`SAP API error: ${availabilityResponse.status} ${availabilityResponse.statusText}`);
      const errorText = await availabilityResponse.text();
      console.error(`SAP API error details: ${errorText.substring(0, 500)}...`);
      
      // Add retry logic with different formats if we get a parameter error
      if (errorText.includes('Invalid Function Import Parameter')) {
        console.log('First attempt failed. Trying with alternative datetime format...');
        
        // Try with datetime prefix without 'offset'
        const altFormat = `datetime'${isoString}'`;
        
        const retryUrl1 = `${server}/sap/opu/odata/SAP/API_PRODUCT_AVAILY_INFO_BASIC/DetermineAvailabilityAt`
          + `?RequestedQuantityInBaseUnit=1.0M`
          + `&Material='${productCode}'`
          + `&SupplyingPlant='1710'`
          + `&ATPCheckingRule='A'`
          + `&RequestedUTCDateTime=${encodeURIComponent(altFormat)}`
          + `&$format=json`;
        
        console.log(`Retry URL (datetime format): ${retryUrl1}`);
        
        const retryResponse1 = await fetch(retryUrl1, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (retryResponse1.ok) {
          console.log('Second attempt succeeded with datetime format');
          return await retryResponse1.json();
        }
        
        console.log('Second attempt failed. Trying with raw ISO string...');
        
        // Try with just the ISO string in single quotes
        const isoFormat = `'${isoString}'`;
        
        const retryUrl2 = `${server}/sap/opu/odata/SAP/API_PRODUCT_AVAILY_INFO_BASIC/DetermineAvailabilityAt`
          + `?RequestedQuantityInBaseUnit=1.0M`
          + `&Material='${productCode}'`
          + `&SupplyingPlant='1710'`
          + `&ATPCheckingRule='A'`
          + `&RequestedUTCDateTime=${encodeURIComponent(isoFormat)}`
          + `&$format=json`;
        
        console.log(`Retry URL (ISO format): ${retryUrl2}`);
        
        const retryResponse2 = await fetch(retryUrl2, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (retryResponse2.ok) {
          console.log('Third attempt succeeded with ISO string in quotes');
          return await retryResponse2.json();
        }
        
        // If all attempts fail, throw the original error
        throw new Error(`SAP API error: Failed to format date correctly for RequestedUTCDateTime parameter`);
      }
      
      throw new Error(`SAP API error: ${availabilityResponse.status} ${availabilityResponse.statusText}`);
    }
    
    const data = await availabilityResponse.json();
    console.log('SAP availability response:', JSON.stringify(data).substring(0, 500) + '...');
    
    // Extract availability information
    let availableQuantity = 0;
    let availableFrom = '';
    let baseUnit = '';
    let stockItems = [];
    
    if (data.d && data.d.results) {
      stockItems = data.d.results;
      console.log(`Found ${stockItems.length} stock items in response`);
      
      stockItems.forEach((item: any, index: number) => {
        console.log(`Processing stock item ${index + 1}:`, JSON.stringify(item).substring(0, 200) + '...');
        
        // Get the available quantity
        if (item.AvailableQuantityInBaseUnit !== undefined) {
          availableQuantity = Number(item.AvailableQuantityInBaseUnit) || 0;
          console.log(`Found available quantity: ${availableQuantity}`);
        }
        
        // Get the base unit
        if (item.BaseUnit) {
          baseUnit = item.BaseUnit;
          console.log(`Found base unit: ${baseUnit}`);
        }
        
        // Format the date if available
        if (item.PeriodStartUTCDateTime) {
          try {
            const date = new Date(item.PeriodStartUTCDateTime);
            availableFrom = date.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            });
            console.log(`Formatted available from date: ${availableFrom} from ${item.PeriodStartUTCDateTime}`);
          } catch (e) {
            console.error('Error formatting date:', e);
            availableFrom = item.PeriodStartUTCDateTime;
          }
        }
      });
    } else {
      console.log('No results found in SAP response or unexpected response structure:', JSON.stringify(data).substring(0, 200));
    }
    
    const result = {
      availableQuantity,
      availableFrom,
      baseUnit,
      success: true,
      stockItems
    };
    
    console.log('Returning final result:', JSON.stringify(result).substring(0, 200));
    return result;
  } catch (error) {
    console.error("Error in SAP API call:", error);
    throw error;
  }
}
