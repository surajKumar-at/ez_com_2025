
export function validateSapCredentials(credentials: any): string | null {
  const { sap_user, sap_password, server } = credentials;
  
  if (!sap_user || !sap_password || !server) {
    console.error("SAP credentials or connection details incomplete:", { 
      hasUsername: !!sap_user, 
      hasPassword: !!sap_password,
      hasServer: !!server,
    });
    return "SAP credentials or connection details are incomplete";
  }
  
  return null;
}

export function constructSapApiUrl(server: string, salesOrderId: string): string {
  const apiPath = `/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder('${encodeURIComponent(salesOrderId)}')`;
  const expandParam = '?$expand=to_Partner,to_Text';
  return `${server}${apiPath}${expandParam}`;
}

export async function fetchCsrfToken(server: string, sapUsername: string, sapPassword: string) {
  const serviceRootUrl = `${server}/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder`;
  console.log("Fetching CSRF token from:", serviceRootUrl);
  
  const csrfResponse = await fetch(serviceRootUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(`${sapUsername}:${sapPassword}`)}`,
      'x-csrf-token': 'Fetch',
      'Accept': 'application/json'
    }
  });
  
  console.log("CSRF token response status:", csrfResponse.status);
  
  if (!csrfResponse.ok) {
    const errorText = await csrfResponse.text();
    console.error("Error fetching CSRF token:", errorText);
    throw new Error(`Error authenticating with SAP: ${errorText}`);
  }
  
  const csrfToken = csrfResponse.headers.get('x-csrf-token');
  const cookiesHeader = csrfResponse.headers.get('set-cookie');
  
  console.log("CSRF token obtained:", csrfToken ? "Yes" : "No");
  console.log("Cookies obtained:", cookiesHeader ? "Yes" : "No");
  
  return { csrfToken, cookiesHeader };
}

export function parseCookies(cookiesHeader: string | null): string {
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
  return cookies.join('; ');
}

export function buildSapRequestHeaders(sapUsername: string, sapPassword: string, csrfToken: string | null, cookieHeader: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Authorization': `Basic ${btoa(`${sapUsername}:${sapPassword}`)}`,
    'Accept': 'application/json'
  };
  
  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }
  
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }
  
  return headers;
}
