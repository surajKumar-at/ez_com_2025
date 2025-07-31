
export function parseXML(xmlText: string) {
  try {
    // Extract the d:AvailableQuantityInBaseUnit value from XML
    const availableQuantityMatch = xmlText.match(/<d:AvailableQuantityInBaseUnit>(.*?)<\/d:AvailableQuantityInBaseUnit>/);
    const availableQuantity = availableQuantityMatch ? availableQuantityMatch[1] : null;

    // Extract the d:ConfirmationStatus value from XML
    const confirmationStatusMatch = xmlText.match(/<d:ConfirmationStatus>(.*?)<\/d:ConfirmationStatus>/);
    const confirmationStatus = confirmationStatusMatch ? confirmationStatusMatch[1] : null;

    // Extract any error messages if present
    const errorMessageMatch = xmlText.match(/<message>(.*?)<\/message>/);
    const errorMessage = errorMessageMatch ? errorMessageMatch[1] : null;

    return {
      availableQuantity: availableQuantity ? Number(availableQuantity) : 0,
      confirmationStatus,
      errorMessage,
      success: !errorMessage && availableQuantity !== null
    };
  } catch (error) {
    console.error("Error parsing XML:", error);
    return {
      availableQuantity: 0,
      confirmationStatus: null,
      errorMessage: "Failed to parse SAP response",
      success: false
    };
  }
}

