
import { fetchCsrfToken } from "../../_shared/sapAuthService.ts";
import { parseSapErrorResponse } from "../../_shared/sapErrorParser.ts";

/**
 * Makes the actual API call to SAP for order simulation
 */
export async function callSapSimulationApi(payload: any, sapCreds: any) {
  try {
    // Log the formatted payload that will be sent to SAP
    console.log("============= SAP SIMULATION PAYLOAD =============");
    console.log("SAP Simulation payload:", JSON.stringify(payload, null, 2));
    console.log("==================================================");

    // Fetch CSRF token for SAP API call - using GET instead of OPTIONS
    console.log("Fetching CSRF token for SAP API call");
    const { csrfToken, cookieHeader, error: csrfError } = await fetchCsrfToken(sapCreds);
    
    if (csrfError) {
      console.error("Error fetching CSRF token:", csrfError);
      return {
        success: false, 
        error: "Failed to authenticate with SAP", 
        details: csrfError,
        messages: [{
          type: 'E',
          message: "Authentication failed. Order can still be placed but will require manual synchronization."
        }]
      };
    }
    
    // Make the actual API call to SAP
    console.log("Making API call to SAP for order simulation");
    const apiUrl = `${sapCreds.server}/sap/opu/odata/sap/API_SALES_ORDER_SIMULATION_SRV/A_SalesOrderSimulation`;
    console.log("SAP API URL:", apiUrl);
    
    const headers: Record<string, string> = {
      'Authorization': 'Basic ' + btoa(`${sapCreds.sap_user}:${sapCreds.sap_password}`),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-csrf-token': csrfToken
    };
    
    // Add cookies if they were returned
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }
    
    // Log request headers for debugging
    console.log("Request headers:", JSON.stringify(headers, null, 2));
    
    const sapResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });
    
    console.log("SAP API response status:", sapResponse.status);
    
    const responseText = await sapResponse.text();
    console.log("SAP API response text (first 5000 chars):", responseText.substring(0, 5000) + (responseText.length > 5000 ? "..." : ""));
    
    if (!sapResponse.ok) {
      console.error("Error from SAP API:", {
        status: sapResponse.status,
        statusText: sapResponse.statusText
      });
      
      // Parse the error response
      const { messages, mainError } = parseSapErrorResponse(responseText);
      
      return {
        success: false, 
        error: mainError || "Error from SAP simulation API", 
        details: responseText.substring(0, 1000), // Trim very long responses
        messages: messages || [{
          type: 'E',
          message: "SAP returned an error. Order can still be placed but will require manual synchronization."
        }]
      };
    }
    
    // Parse the response JSON
    try {
      const responseData = JSON.parse(responseText);
      console.log("SAP API response parsed successfully");
      return {
        success: true,
        data: responseData
      };
    } catch (parseError) {
      console.error("Error parsing SAP API response:", parseError);
      return {
        success: false, 
        error: "Failed to parse SAP response", 
        details: responseText.substring(0, 1000),
        messages: [{
          type: 'E',
          message: "Could not parse SAP response. Order can still be placed but will require manual synchronization."
        }]
      };
    }
  } catch (apiError) {
    console.error("Error during SAP API call:", apiError);
    return {
      success: false, 
      error: "Error during SAP API call", 
      details: apiError instanceof Error ? apiError.message : String(apiError),
      messages: [{
        type: 'E',
        message: "Connection error. Order can still be placed but will require manual synchronization."
      }]
    };
  }
}
