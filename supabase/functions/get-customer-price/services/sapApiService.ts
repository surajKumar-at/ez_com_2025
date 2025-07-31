
import { format } from 'https://esm.sh/date-fns@3.0.6';

export const buildSapPayload = (productCode: string, soldToId: string) => {
  // Current date in the format YYYY-MM-DD
  const today = format(new Date(), 'yyyy-MM-dd');
  
  return {
    SALESORGANIZATION: "1710",
    DISTRIBUTIONCHANNEL: "10",
    DIVISION: "00",
    TRANSACTIONCURRENCY: "USD",
    SALESDOCUMENTTYPE: "OR",
    SOLDTOPARTY: soldToId,
    PRICINGDATE: today,
    Items: [
      {
        MATERIAL: productCode,
        TARGETQUANTITY: "1.000",
        TARGETQUANTITYUNIT: "EA"
      }
    ]
  };
};

export const callSapApi = async (apiUrl: string, payload: any, credentials: any) => {
  try {
    console.log('Calling SAP API for customer price:', apiUrl);
    console.log('Request payload:', JSON.stringify(payload, null, 2));
    
    // For development/testing, provide mock data that will be used if SAP call fails
    const mockData = {
      SALESPRICERESULT: {
        NETAMOUNT: Math.floor(Math.random() * 500) + 100, // Random price between 100-600
        TRANSACTIONCURRENCY: "USD",
        PRICINGHASERROR: false
      }
    };
    
    // Create the auth header
    const authHeader = 'Basic ' + btoa(`${credentials.sap_user}:${credentials.sap_password}`);
    console.log('Using auth header (credentials masked)');
    
    // First try to get a CSRF token
    const tokenResponse = await fetch(`${apiUrl}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'x-csrf-token': 'Fetch',
        'Content-Type': 'application/json'
      }
    });
    
    if (!tokenResponse.ok) {
      console.error('Error fetching CSRF token for SAP API', tokenResponse.status, tokenResponse.statusText);
      
      if (tokenResponse.status === 403) {
        return { error: `Authentication failed: SAP API returned error: 403 Forbidden`, mockData };
      }
      
      return { error: `SAP API returned error: ${tokenResponse.status} ${tokenResponse.statusText}`, mockData };
    }
    
    // Get the CSRF token from the response
    const csrfToken = tokenResponse.headers.get('x-csrf-token');
    const cookies = tokenResponse.headers.get('set-cookie');
    
    console.log('Got CSRF token:', csrfToken ? 'Yes' : 'No');
    console.log('Got cookies:', cookies ? 'Yes' : 'No');
    
    if (!csrfToken) {
      console.warn('No CSRF token returned, will try to proceed without it');
    }
    
    // Make the actual API call with the token if we got one
    const headers: Record<string, string> = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };
    
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }
    
    if (cookies) {
      headers['Cookie'] = cookies;
    }
    
    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    
    // Handle error responses
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('SAP API error response:', response.status, response.statusText);
      console.error('Error body:', errorBody);
      
      if (response.status === 403) {
        return { error: 'Authentication failed: SAP API returned error: 403 Forbidden', mockData };
      }
      
      return { error: `SAP API returned error: ${response.status} ${response.statusText}`, mockData };
    }
    
    // Parse successful response
    const data = await response.json();
    console.log('SAP API response:', JSON.stringify(data, null, 2));
    
    return { data };
  } catch (error: any) {
    console.error('Error calling SAP API:', error);
    return { 
      error: `Error calling SAP API: ${error.message}`,
      // Provide mock data for development/testing
      mockData: {
        SALESPRICERESULT: {
          NETAMOUNT: Math.floor(Math.random() * 500) + 100, // Random price between 100-600
          TRANSACTIONCURRENCY: "USD",
          PRICINGHASERROR: false
        }
      }
    };
  }
};
