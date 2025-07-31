
export const getSapCredentials = async (supabaseClient: any) => {
  console.log('Fetching SAP credentials for S4/HANA system...');
  
  const { data: credentials, error: credError } = await supabaseClient
    .from('sap_credentials')
    .select('*')
    .eq('sap_system_type', 'S4')
    .single();

  if (credError) {
    console.error('Error fetching SAP credentials:', credError);
    return {
      error: {
        message: `SAP credentials not found: ${credError.message}`,
        status: 500
      },
      credentials: null
    };
  }
  
  if (!credentials) {
    console.error('No SAP S4/HANA credentials found');
    return {
      error: {
        message: 'No SAP S4/HANA credentials configured',
        status: 500
      },
      credentials: null
    };
  }
  
  console.log('SAP S4/HANA credentials retrieved successfully');
  return { credentials, error: null };
};
