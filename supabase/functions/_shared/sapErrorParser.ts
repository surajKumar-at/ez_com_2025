
/**
 * Parses SAP error responses to extract meaningful error messages
 * @param errorText Raw response text from SAP
 * @returns Parsed error messages and main error text
 */
export function parseSapErrorResponse(errorText: string) {
  try {
    // Try to parse as JSON first
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      // Not JSON, try XML parsing or other formats if needed
      return { 
        messages: [{
          type: 'E',
          message: 'Could not parse SAP error response'
        }], 
        mainError: 'Invalid response format from SAP'
      };
    }
    
    // Extract error messages from SAP response format
    const messages: {type: string; message: string}[] = [];
    let mainError = 'Error from SAP';
    
    // Handle standard SAP OData error format
    if (errorData.error) {
      if (typeof errorData.error === 'string') {
        mainError = errorData.error;
      } else if (errorData.error.message) {
        mainError = errorData.error.message.value || errorData.error.message;
        
        // Try to extract detailed error messages if available
        if (errorData.error.innererror && errorData.error.innererror.errordetails) {
          errorData.error.innererror.errordetails.forEach((detail: any) => {
            messages.push({
              type: 'E',
              message: detail.message || detail.Message || 'Unknown error'
            });
          });
        }
      }
    }
    
    // If no detailed messages were found, add the main error
    if (messages.length === 0) {
      messages.push({
        type: 'E',
        message: mainError
      });
    }
    
    return { messages, mainError };
  } catch (error) {
    // Fallback for any parsing errors
    return {
      messages: [{
        type: 'E',
        message: 'Failed to parse error response'
      }],
      mainError: 'Unknown error format'
    };
  }
}
