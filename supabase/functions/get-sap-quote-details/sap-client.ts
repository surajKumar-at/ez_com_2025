import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { SapCredentials, QuoteDetailsRequest, RequestHeaders } from './types.ts';
import { fetchSapCsrfToken } from './csrf.ts';

export class SapQuoteDetailsClient {
  private supabaseClient: any;

  constructor(authHeader: string) {
    this.supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );
  }

  async getSapCredentials(): Promise<SapCredentials> {
    console.log("Attempting to fetch SAP credentials from database...");
    
    const credentialsStart = performance.now();
    const { data: credentialsData, error: credentialsError } = await this.supabaseClient
      .from('sap_credentials')
      .select('sap_user, sap_password, server')
      .eq('sap_system_type', 'S4')
      .limit(1)
      .single();

    const credentialsEnd = performance.now();
    console.log(`SAP credentials fetch took ${(credentialsEnd - credentialsStart).toFixed(2)}ms`);

    if (credentialsError) {
      console.error("Error fetching SAP credentials:", credentialsError);
      throw new Error("Failed to retrieve SAP credentials: " + credentialsError.message);
    }

    if (!credentialsData) {
      console.error("No S4 SAP credentials found in the database");
      throw new Error("S4 SAP credentials not found");
    }

    console.log("SAP credentials retrieved successfully");
    return credentialsData as SapCredentials;
  }

  async fetchQuoteDetails(request: QuoteDetailsRequest): Promise<any> {
    const credentials = await this.getSapCredentials();
    
    // Extract credentials and connection details
    const { sap_user: sapUsername, sap_password: sapPassword, server } = credentials;
    
    if (!sapUsername || !sapPassword || !server) {
      console.error("SAP credentials incomplete:", { 
        hasUsername: !!sapUsername, 
        hasPassword: !!sapPassword,
        hasServer: !!server
      });
      throw new Error("SAP credentials are incomplete");
    }

    // Get CSRF token
    const { csrfToken, cookieHeader, error: csrfError } = await fetchSapCsrfToken(
      sapUsername, 
      sapPassword, 
      `${server}/sap/opu/odata/sap/API_SALES_QUOTATION_SRV/`
    );
    
    if (csrfError) {
      console.error("Error fetching CSRF token:", csrfError);
      throw new Error("Authentication error: " + csrfError);
    }

    // Set up headers with token and cookies
    const headers: RequestHeaders = {
      'Authorization': 'Basic ' + btoa(`${sapUsername}:${sapPassword}`),
      'Accept': 'application/json'
    };
    
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }
    
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    // Fetch quote header details
    const headerUrl = `${server}/sap/opu/odata/sap/API_SALES_QUOTATION_SRV/A_SalesQuotation('${request.quoteNumber}')?$format=json`;
    console.log("Fetching quote header:", headerUrl);
    
    const headerResponse = await fetch(headerUrl, { headers });
    if (!headerResponse.ok) {
      const errorText = await headerResponse.text();
      console.error("SAP quote header API error:", errorText);
      throw new Error(`Quote header API error: ${headerResponse.status} ${headerResponse.statusText}`);
    }
    
    const headerData = await headerResponse.json();
    console.log("Quote header data received");

    // Fetch quote items
    const itemsUrl = `${server}/sap/opu/odata/sap/API_SALES_QUOTATION_SRV/A_SalesQuotation('${request.quoteNumber}')/to_Item?$format=json`;
    console.log("Fetching quote items:", itemsUrl);
    
    let itemsData = [];
    try {
      const itemsResponse = await fetch(itemsUrl, { headers });
      if (itemsResponse.ok) {
        const itemsResult = await itemsResponse.json();
        itemsData = itemsResult.d?.results || itemsResult.results || [];
        console.log(`Quote items received: ${itemsData.length} items`);
      } else {
        console.log("Quote items not available or accessible");
      }
    } catch (error) {
      console.log("Error fetching quote items:", error.message);
    }

    // Fetch quote partners
    const partnersUrl = `${server}/sap/opu/odata/sap/API_SALES_QUOTATION_SRV/A_SalesQuotation('${request.quoteNumber}')/to_Partner?$format=json`;
    console.log("Fetching quote partners:", partnersUrl);
    
    let partnersData = [];
    try {
      const partnersResponse = await fetch(partnersUrl, { headers });
      if (partnersResponse.ok) {
        const partnersResult = await partnersResponse.json();
        partnersData = partnersResult.d?.results || partnersResult.results || [];
        console.log(`Quote partners received: ${partnersData.length} partners`);
      } else {
        console.log("Quote partners not available or accessible");
      }
    } catch (error) {
      console.log("Error fetching quote partners:", error.message);
    }

    // Fetch quote texts
    const textsUrl = `${server}/sap/opu/odata/sap/API_SALES_QUOTATION_SRV/A_SalesQuotation('${request.quoteNumber}')/to_Text?$format=json`;
    console.log("Fetching quote texts:", textsUrl);
    
    let textsData = [];
    try {
      const textsResponse = await fetch(textsUrl, { headers });
      if (textsResponse.ok) {
        const textsResult = await textsResponse.json();
        textsData = textsResult.d?.results || textsResult.results || [];
        console.log(`Quote texts received: ${textsData.length} texts`);
      } else {
        console.log("Quote texts not available or accessible");
      }
    } catch (error) {
      console.log("Error fetching quote texts:", error.message);
    }

    // Combine all data
    const combinedData = {
      d: headerData.d || headerData,
      items: itemsData,
      partners: partnersData,
      texts: textsData
    };

    console.log("Combined quote data prepared with items, partners, and texts");
    return combinedData;
  }
}