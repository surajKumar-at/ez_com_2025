-- Insert GET_BUSINESS_PARTNERS URL configuration
INSERT INTO ezc_sap_urls (key, value) 
VALUES ('GET_BUSINESS_PARTNERS', '/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_CustomerSalesArea(Customer=''{CUSTOMER}'',SalesOrganization=''{SALES_ORG}'',DistributionChannel=''{DIST_CHANNEL}'',Division=''{DIVISION}'')/to_PartnerFunction?$select=Customer,PartnerFunction,BPCustomerNumber')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;