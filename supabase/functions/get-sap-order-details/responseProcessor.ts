
export function logPartnerAndTextData(sapData: any) {
  if (sapData && sapData.d) {
    console.log("SAP API response structure:", Object.keys(sapData));
    
    if (sapData.d.to_Partner) {
      console.log("Partner data found directly in response");
      
      if (sapData.d.to_Partner.results) {
        console.log(`Found ${sapData.d.to_Partner.results.length} partners in to_Partner.results`);
      } else if (Array.isArray(sapData.d.to_Partner)) {
        console.log(`Found ${sapData.d.to_Partner.length} partners in to_Partner array`);
      } else {
        console.log("to_Partner exists but is not in expected format:", typeof sapData.d.to_Partner);
      }
    } else {
      console.log("No to_Partner found in response. Available fields:", Object.keys(sapData.d));
    }

    // Log text information
    if (sapData.d.to_Text) {
      console.log("Text data found directly in response");
      
      if (sapData.d.to_Text.results) {
        console.log(`Found ${sapData.d.to_Text.results.length} text entries in to_Text.results`);
        
        // Look for TX03 shipping instructions specifically
        const shippingInstructions = sapData.d.to_Text.results.find(
          (text: any) => text.LongTextID === 'TX03'
        );
        
        if (shippingInstructions) {
          console.log("Found TX03 shipping instructions:", shippingInstructions.LongText);
        } else {
          console.log("No TX03 shipping instructions found");
          console.log("Available text IDs:", sapData.d.to_Text.results.map((t: any) => t.LongTextID));
        }
      } else if (Array.isArray(sapData.d.to_Text)) {
        console.log(`Found ${sapData.d.to_Text.length} text entries in to_Text array`);
      } else {
        console.log("to_Text exists but is not in expected format:", typeof sapData.d.to_Text);
      }
    } else {
      console.log("No to_Text found in response. Available fields:", Object.keys(sapData.d));
    }
  }
}

export async function processSapResponse(sapResponse: Response): Promise<any> {
  console.log("SAP API response status:", sapResponse.status);
  
  let sapData;
  let responseText;
  
  try {
    responseText = await sapResponse.text();
    
    // Only try to parse as JSON if we got a successful response
    if (sapResponse.ok) {
      try {
        sapData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing SAP API response:", parseError);
        throw new Error("Invalid JSON response from SAP API");
      }
    }
  } catch (textError) {
    console.error("Error reading SAP API response text:", textError);
    throw new Error("Error reading response from SAP API");
  }
  
  // Check if the response was successful
  if (!sapResponse.ok) {
    console.error("SAP API returned an error:", responseText);
    throw new Error(`SAP API error (${sapResponse.status}): ${responseText}`);
  }
  
  // Enhanced logging for partner and text information
  logPartnerAndTextData(sapData);
  
  return sapData;
}
