
import { parseSapErrorResponse } from '../_shared/sapErrorParser.ts';

/**
 * Fetches a CSRF token from SAP for authentication
 * @param sapCreds SAP credentials and configuration
 * @returns CSRF token and cookie header for subsequent requests
 */
export async function fetchCsrfToken(sapCreds: any) {
  // Use the base service root URL instead of the $metadata endpoint
  const serviceRootUrl = `${sapCreds.server}${sapCreds.api_path.split('(')[0]}`;
  console.log('Fetching CSRF token from service root:', serviceRootUrl);
  
  try {
    // Make a GET request to fetch CSRF token as recommended in SAP docs
    // This is the key change - using GET instead of OPTIONS
    const csrfResponse = await fetch(serviceRootUrl, {
      method: 'GET', // Changed from OPTIONS to GET
      headers: {
        'Authorization': 'Basic ' + btoa(`${sapCreds.sap_user}:${sapCreds.sap_password}`),
        'x-csrf-token': 'Fetch', // Request a new token
        'Accept': 'application/json'
      }
    });
    
    console.log('CSRF response status:', csrfResponse.status);
    
    if (!csrfResponse.ok) {
      const errorText = await csrfResponse.text();
      console.error('Error fetching CSRF token:', errorText);
      console.error('Status:', csrfResponse.status);
      console.error('Status Text:', csrfResponse.statusText);
      console.error('Headers:', JSON.stringify(Object.fromEntries([...csrfResponse.headers.entries()]), null, 2));
      
      // Parse the error response
      const { messages, mainError } = parseSapErrorResponse(errorText);
      
      return {
        error: { 
          message: mainError || 'Failed to authenticate with SAP', 
          details: errorText,
          status: csrfResponse.status,
          statusText: csrfResponse.statusText,
          messages
        }
      };
    }
    
    // Extract CSRF token and cookies from the response
    const csrfToken = csrfResponse.headers.get('x-csrf-token');
    const cookiesHeader = csrfResponse.headers.get('set-cookie');
    
    console.log('CSRF token obtained:', csrfToken);
    console.log('Cookies header exists:', cookiesHeader ? 'Yes' : 'No');
    
    if (!csrfToken) {
      console.error('No CSRF token returned from SAP');
      return {
        error: { 
          message: 'No CSRF token returned from SAP',
          messages: [{
            type: 'E',
            message: 'Authentication failed: No CSRF token returned'
          }]
        }
      };
    }
    
    // Parse cookies from the set-cookie header
    const cookies: string[] = [];
    if (cookiesHeader) {
      // Split multiple Set-Cookie headers if they exist
      const cookieParts = cookiesHeader.split(', ');
      for (const part of cookieParts) {
        if (part.includes('=')) {
          // Extract just the name=value part before the first ;
          const mainPart = part.split(';')[0].trim();
          cookies.push(mainPart);
        }
      }
    }
    
    const cookieHeader = cookies.join('; ');
    console.log('Processed cookie header:', cookieHeader || 'No cookies');
    
    return { csrfToken, cookieHeader };
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return {
      error: { 
        message: 'Error fetching CSRF token', 
        details: error.message,
        messages: [{
          type: 'E',
          message: 'Connection error: ' + error.message
        }]
      }
    };
  }
}
