import { CsrfTokenResult } from './types.ts';

/**
 * Fetches a CSRF token for SAP API calls
 */
export async function fetchSapCsrfToken(
  sapUsername: string, 
  sapPassword: string, 
  serviceUrl: string
): Promise<CsrfTokenResult> {
  console.log('Fetching CSRF token from:', serviceUrl);
  
  const csrfStart = performance.now();
  
  try {
    const response = await fetch(serviceUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(`${sapUsername}:${sapPassword}`),
        'x-csrf-token': 'Fetch',
        'Accept': 'application/json'
      }
    });
    
    const csrfEnd = performance.now();
    console.log(`CSRF token fetch took ${(csrfEnd - csrfStart).toFixed(2)}ms`);
    console.log('CSRF token request status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching CSRF token:', errorText);
      return { error: 'Failed to authenticate with SAP: ' + response.status + ' ' + response.statusText };
    }
    
    const csrfToken = response.headers.get('x-csrf-token');
    const cookiesHeader = response.headers.get('set-cookie');
    
    console.log('CSRF token received:', csrfToken ? 'Yes' : 'No');
    console.log('Cookies received:', cookiesHeader ? 'Yes' : 'No');
    
    // Parse cookies from the set-cookie header
    const cookies: string[] = [];
    if (cookiesHeader) {
      const cookieParts = cookiesHeader.split(', ');
      for (const part of cookieParts) {
        if (part.includes('=')) {
          const mainPart = part.split(';')[0].trim();
          cookies.push(mainPart);
        }
      }
    }
    
    const cookieHeader = cookies.join('; ');
    
    return { csrfToken, cookieHeader };
  } catch (error) {
    const csrfEnd = performance.now();
    console.log(`CSRF token fetch failed after ${(csrfEnd - csrfStart).toFixed(2)}ms`);
    console.error('Network error fetching CSRF token:', error);
    return { error: 'Network error: ' + error.message };
  }
}