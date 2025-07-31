
export const getSoldToParty = async (supabaseClient: any, userId: string) => {
  console.log('Fetching sold-to party for user:', userId);
  
  const { data: soldToParties, error: soldToError } = await supabaseClient
    .from('sold_to_parties')
    .select('sap_sold_to_id')
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (soldToError) {
    console.error('Error fetching sold-to parties:', soldToError);
    return {
      error: {
        message: `No sold-to parties found for user: ${soldToError.message}`,
        status: 404
      },
      soldTo: null
    };
  }
  
  if (!soldToParties?.sap_sold_to_id) {
    console.error('No SAP sold-to ID available for user');
    return {
      error: {
        message: 'No SAP sold-to ID available for this user',
        status: 404
      },
      soldTo: null
    };
  }
  
  console.log('Successfully retrieved sold-to party:', soldToParties.sap_sold_to_id);
  return { soldTo: soldToParties, error: null };
};
