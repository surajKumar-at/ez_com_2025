
import { corsHeaders } from '../utils/cors.ts';
import { formatSapPayload } from './sapPayloadService.ts';
import { parseSapErrorResponse } from './sapErrorParser.ts';
import { fetchCsrfToken } from './sapAuthService.ts';

/**
 * Creates a sales order in SAP
 * @param payload The formatted order payload
 * @param sapCreds SAP credentials and configuration
 * @returns The SAP order number or error information
 */
export async function createSapOrder(payload: any, sapCreds: any) {
  const apiUrl = `${sapCreds.server}${sapCreds.api_path}`;
  console.log('SAP API URL:', apiUrl);
  
  try {
    // Step 1: Fetch CSRF token using a separate endpoint with GET method
    const { csrfToken, cookieHeader, error: csrfError } = await fetchCsrfToken(sapCreds);
    
    if (csrfError) {
      return { error: csrfError };
    }
    
    // Step 2: Make the actual POST request with the token and cookies
    console.log('Sending POST request to SAP...');
    const postHeaders: Record<string, string> = {
      'Authorization': 'Basic ' + btoa(`${sapCreds.sap_user}:${sapCreds.sap_password}`),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-csrf-token': csrfToken
    };
    
    // Add cookies if they were returned
    if (cookieHeader) {
      postHeaders['Cookie'] = cookieHeader;
    }
    
    // Log all headers we're sending
    console.log('POST request headers:', JSON.stringify(postHeaders, null, 2));
    
    const sapResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: postHeaders,
      body: JSON.stringify(payload)
    });
    
    console.log('SAP response status:', sapResponse.status);
    
    const responseText = await sapResponse.text();
    console.log('SAP response text:', responseText);
    
    if (!sapResponse.ok) {
      console.error('Error creating SAP order:', responseText);
      console.error('Status:', sapResponse.status);
      console.error('Status Text:', sapResponse.statusText);
      console.error('Response headers:', JSON.stringify(Object.fromEntries([...sapResponse.headers.entries()]), null, 2));
      
      // Parse the error response to extract messages
      const { messages, mainError } = parseSapErrorResponse(responseText);
      
      return { 
        error: { 
          message: mainError || 'Failed to create SAP order', 
          details: responseText,
          status: sapResponse.status,
          statusText: sapResponse.statusText,
          messages
        }
      };
    }
    
    // Parse successful response
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing response JSON:', e);
      return {
        error: {
          message: 'Error parsing response from SAP',
          details: responseText,
          messages: [{
            type: 'E',
            message: 'Could not parse response as JSON: ' + e.message
          }]
        }
      };
    }
    
    console.log('SAP response data:', JSON.stringify(responseData, null, 2));
    
    // Extract the SAP order number from the response
    const sapOrderNumber = responseData.d?.SalesOrder;
    
    if (sapOrderNumber) {
      console.log('SAP order number obtained:', sapOrderNumber);
      return { sapOrderNumber };
    } else {
      console.warn('No SAP order number in response');
      return { 
        sapOrderNumber: null,
        error: {
          message: 'No order number received from SAP',
          details: responseText,
          messages: [{
            type: 'W',
            message: 'Response received but no order number was found'
          }]
        }
      };
    }
  } catch (error) {
    console.error('Fetch error during SAP API call:', error);
    return { 
      error: { 
        message: 'Error communicating with SAP API', 
        details: error.message,
        messages: [{
          type: 'E',
          message: 'Connection error: ' + error.message
        }]
      }
    };
  }
}

// Re-export functions from the other modules for backward compatibility
export { formatSapPayload } from './sapPayloadService.ts';
export { parseSapErrorResponse } from './sapErrorParser.ts';
