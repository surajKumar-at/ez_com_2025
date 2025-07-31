
/**
 * Gets the product SAP codes map for the cart items
 */
export async function getProductSapCodesMap(
  cart: any,
  productSapCodes: any,
  supabaseClient: any
): Promise<Map<number, string>> {
  // Create a map of product IDs to their SAP codes
  const productSapCodesMap = new Map();
  
  // First, try to use the productSapCodes from the request
  if (productSapCodes) {
    for (const [id, code] of Object.entries(productSapCodes)) {
      productSapCodesMap.set(Number(id), code);
    }
  }
  
  // If the map is empty or we need to supplement missing codes, fetch from the database
  if (productSapCodesMap.size === 0 || productSapCodesMap.size !== cart.items.length) {
    const productIds = cart.items.map((item: any) => item.productId);
    console.log("Fetching SAP product codes for IDs:", productIds);
    
    const { data: products, error: productsError } = await supabaseClient
      .from("products")
      .select("id, sap_product_code")
      .in("id", productIds);

    if (productsError) {
      console.error("Error fetching product details:", productsError);
      throw new Error("Failed to retrieve product details");
    }

    // Add any missing codes to the map
    products.forEach((product: any) => {
      if (!productSapCodesMap.has(product.id)) {
        productSapCodesMap.set(product.id, product.sap_product_code);
      }
    });
  }
  
  // Log all the product codes to verify
  console.log("Product SAP codes mapping (final):");
  productSapCodesMap.forEach((code, id) => {
    console.log(`Product ID ${id} -> SAP code ${code}`);
  });
  
  return productSapCodesMap;
}
