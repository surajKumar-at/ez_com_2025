
/**
 * Parse SAP error response to extract messages
 * @param responseText The raw response text from SAP
 * @returns Structured error information with messages
 */
export function parseSapErrorResponse(responseText: string) {
  try {
    console.log("Parsing SAP error response:", responseText);
    
    // Try to parse as JSON first
    try {
      const jsonResponse = JSON.parse(responseText);
      
      // Check for standard SAP OData error format
      if (jsonResponse.error) {
        const messages = [];
        
        if (jsonResponse.error.message) {
          messages.push({
            type: 'E',
            message: jsonResponse.error.message.value || jsonResponse.error.message
          });
        }
        
        // Check for inner errors or details
        if (jsonResponse.error.innererror && jsonResponse.error.innererror.errordetails) {
          jsonResponse.error.innererror.errordetails.forEach((detail: any) => {
            messages.push({
              type: detail.severity || 'E',
              message: detail.message
            });
          });
        }
        
        return {
          messages,
          mainError: jsonResponse.error.message.value || jsonResponse.error.message
        };
      }
      
      // Look for other common SAP message structures
      if (jsonResponse.d && jsonResponse.d.__next) {
        // This is likely a successful response
        return {
          messages: [{
            type: 'I',
            message: 'Request processed successfully'
          }],
          mainError: null
        };
      }
    } catch (e) {
      console.log("Response is not valid JSON, trying XML parsing");
    }
    
    // Check if it's XML (SAP often returns XML for errors)
    if (responseText.includes('<?xml') || responseText.includes('<error')) {
      // Simple XML parsing logic - extract message element
      const messageMatch = responseText.match(/<message[^>]*>(.*?)<\/message>/);
      const codeMatch = responseText.match(/<code[^>]*>(.*?)<\/code>/);
      
      if (messageMatch && messageMatch[1]) {
        return {
          messages: [{
            type: 'E',
            message: messageMatch[1],
            id: codeMatch && codeMatch[1] ? codeMatch[1] : undefined
          }],
          mainError: messageMatch[1]
        };
      }
    }
    
    // If we couldn't parse it in a structured way, return the raw text
    return {
      messages: [{
        type: 'E',
        message: 'Unrecognized error: ' + responseText.substring(0, 200) + (responseText.length > 200 ? '...' : '')
      }],
      mainError: 'Unrecognized error format'
    };
  } catch (error) {
    console.error('Error parsing SAP error response:', error);
    return {
      messages: [{
        type: 'E',
        message: 'Error parsing response: ' + error.message
      }],
      mainError: 'Error parsing response'
    };
  }
}
