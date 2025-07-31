// TypeScript types for the SAP quote details function

export interface SapCredentials {
  sap_user: string;
  sap_password: string;
  server: string;
}

export interface CsrfTokenResult {
  csrfToken?: string;
  cookieHeader?: string;
  error?: string;
}

export interface QuoteDetailsRequest {
  quoteNumber: string;
  soldToId?: string;
  apiVersion?: string;
}

export interface RequestHeaders {
  [key: string]: string;
}