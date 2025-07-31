
/**
 * Calls the SAP API to get order details
 * @param credentials SAP credentials
 * @param paddedSalesOrderId Sales order ID padded to 10 digits
 * @param paddedSoldToId Sold-to ID padded to 10 digits
 * @returns Response from the SAP API
 */
export const callSapApi = async (
  credentials: { sapUsername: string; sapPassword: string; server: string },
  paddedSalesOrderId: string,
  paddedSoldToId: string
) => {
  // Construct the SAP API URL
  const sapApiUrl = `${credentials.server}/sap/zfmcall/Z_BAPISDORDER_GETDETAILEDLIST`;
  
  // Construct the payload with additional view parameters
  const payload = {
    "I_BAPI_VIEW": {
      "HEADER": "X",
      "ITEM": "X",
      "SDSCHEDULE": "X",
      "BUSINESS": "X",
      "PARTNER": "X",
      "FLOW": "X",
      "STATUS": "X"  // Explicitly include STATUS view
    },
    "CUSTOMER": paddedSoldToId,
    "SALES_DOCUMENTS": [
      {
        "VBELN": paddedSalesOrderId
      }
    ]
  };
  
  console.log("Using SAP API URL:", sapApiUrl);
  console.log("Using payload:", JSON.stringify(payload));
  
  // Construct the final URL with credentials
  // Add lowercase=X parameter to try to get lowercase field names
  const url = `${sapApiUrl}?format=json&lowercase=X&sap-user=${encodeURIComponent(credentials.sapUsername)}&sap-password=${encodeURIComponent(credentials.sapPassword)}`;
  
  console.log("Calling SAP API URL (credentials omitted for security):", 
    url.replace(/sap-password=([^&]*)/, 'sap-password=*****').replace(/sap-user=([^&]*)/, 'sap-user=*****'));

  try {
    // Make the request to the SAP API
    const sapResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Log the status code from SAP
    console.log("SAP API response status:", sapResponse.status);
    
    // Parse the response
    let sapData;
    try {
      sapData = await sapResponse.json();
    } catch (error) {
      console.error("Error parsing SAP API response:", error);
      const responseText = await sapResponse.text();
      console.log("SAP API response text:", responseText);
      throw new Error("Invalid response from SAP API");
    }
    
    // Log the SAP data
    console.log("SAP API response data:", JSON.stringify(sapData, null, 2));
    
    return { sapResponse, sapData };
  } catch (error) {
    console.error("Error during SAP API call:", error);
    throw error;
  }
};
