-- Create table for SAP credentials
CREATE TABLE IF NOT EXISTS public.ezc_sap_credincials (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  environment VARCHAR(255) DEFAULT 'DEMO',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for SAP URLs
CREATE TABLE IF NOT EXISTS public.ezc_sap_urls (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default SAP credentials
INSERT INTO public.ezc_sap_credincials (username, password, environment) 
VALUES ('MBABLANI', 'P@ssw0rd123', 'DEMO');

-- Insert default SAP URLs
INSERT INTO public.ezc_sap_urls (key, value, description) 
VALUES (
  'GET_SELECTED_SOLDTO', 
  '/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_BusinessPartner?$filter=BusinessPartner eq ''{PARTNER}'' or Customer eq ''{PARTNER}''&$expand=to_BusinessPartnerAddress&$select=to_BusinessPartnerAddress,BusinessPartnerFullName',
  'Get business partner details with address information'
);

INSERT INTO public.ezc_sap_urls (key, value, description) 
VALUES (
  'BASE_URL', 
  'https://demo21.answerthinkdemo.com',
  'Base URL for SAP API calls'
);