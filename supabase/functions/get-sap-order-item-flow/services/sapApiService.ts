
interface SapCredentials {
  sap_user: string;
  sap_password: string;
  server: string;
}

export const fetchSapCredentials = async (supabaseClient: any): Promise<SapCredentials> => {
  const { data: credentialsData, error: credentialsError } = await supabaseClient
    .from('sap_credentials')
    .select('sap_user, sap_password, server')
    .eq('sap_system_type', 'S4')
    .limit(1)
    .single();

  if (credentialsError) {
    console.error("Error fetching SAP credentials:", credentialsError);
    throw new Error("Failed to retrieve SAP credentials");
  }

  return credentialsData as SapCredentials;
};

export const callSapApi = async (
  credentials: SapCredentials,
  salesOrderId: string,
  salesOrderItem: string
) => {
  // For GET requests, we don't need CSRF tokens
  const headers: Record<string, string> = {
    'Authorization': 'Basic ' + btoa(`${credentials.sap_user}:${credentials.sap_password}`),
    'Accept': 'application/json'
  };

  const flowUrl = `${credentials.server}/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrderItem(SalesOrder='${salesOrderId}',SalesOrderItem='${salesOrderItem}')/to_SubsequentProcFlowDocItem?$format=json`;
  console.log("Fetching order item flow from URL:", flowUrl);

  return await fetch(flowUrl, { 
    method: 'GET',
    headers 
  });
};
