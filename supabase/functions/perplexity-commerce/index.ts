
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PerplexityProductSearchRequest {
  query: string;
  limit?: number;
  category?: string;
  priceRange?: { min: number; max: number };
}

interface PerplexityOrderRequest {
  productId: number;
  quantity: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  configuration?: any;
}

Deno.serve(async (req) => {
  console.log('=== PERPLEXITY COMMERCE API FUNCTION INVOKED ===');
  console.log(`Perplexity Commerce: Incoming request - ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Perplexity Commerce: Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/perplexity-commerce', '')
    console.log('Perplexity Commerce: Processing path:', path)

    // Route to specific handlers
    if (path === '/search' && req.method === 'GET') {
      return await handleProductSearch(req, supabaseClient)
    }
    
    if (path === '/product' && req.method === 'GET') {
      return await handleProductDetails(req, supabaseClient)
    }
    
    if (path === '/order' && req.method === 'POST') {
      return await handleOrderCreation(req, supabaseClient)
    }
    
    if (path === '/catalog' && req.method === 'GET') {
      return await handleCatalogBrowse(req, supabaseClient)
    }

    console.log(`Perplexity Commerce: No handler found for path: ${path}`)
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )
  } catch (error) {
    console.error('Perplexity Commerce error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function handleProductSearch(req: Request, supabase: any) {
  try {
    const url = new URL(req.url)
    const query = url.searchParams.get('query') || ''
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const category = url.searchParams.get('category')
    
    console.log('Handling product search for query:', query)

    let searchQuery = supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        short_description,
        price,
        category,
        in_stock,
        sap_product_code,
        product_images(image_url),
        product_features(feature),
        product_specifications(key, value)
      `)
      .eq('web_status', 'Active')
      .limit(limit)

    if (query) {
      searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%`)
    }

    if (category) {
      searchQuery = searchQuery.eq('category', category)
    }

    const { data: products, error } = await searchQuery

    if (error) {
      console.error('Error searching products:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to search products' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Transform products for Perplexity consumption
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.short_description || product.description,
      price: product.price,
      currency: 'USD',
      category: product.category,
      inStock: product.in_stock,
      sapCode: product.sap_product_code,
      images: product.product_images?.map(img => img.image_url) || [],
      features: product.product_features?.map(f => f.feature) || [],
      specifications: product.product_specifications?.reduce((acc, spec) => {
        acc[spec.key] = spec.value
        return acc
      }, {}) || {},
      purchaseUrl: `https://ouzxmcydhconwakrphtn.supabase.co/functions/v1/perplexity-commerce/order?productId=${product.id}`,
      detailsUrl: `https://ouzxmcydhconwakrphtn.supabase.co/functions/v1/perplexity-commerce/product?id=${product.id}`
    }))

    return new Response(
      JSON.stringify({
        success: true,
        query,
        totalResults: transformedProducts.length,
        products: transformedProducts
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Product search error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to search products' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleProductDetails(req: Request, supabase: any) {
  try {
    const url = new URL(req.url)
    const productId = url.searchParams.get('id')
    
    if (!productId) {
      return new Response(
        JSON.stringify({ error: 'Product ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Fetching product details for ID:', productId)

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images(image_url, order),
        product_features(feature),
        product_specifications(key, value),
        product_attributes(
          id,
          is_mandatory,
          sort_order,
          configurable_attributes(
            id,
            name,
            description,
            attribute_type,
            help_text,
            attribute_values(
              id,
              value,
              label,
              additional_price
            )
          )
        )
      `)
      .eq('id', productId)
      .eq('web_status', 'Active')
      .single()

    if (error || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      shortDescription: product.short_description,
      price: product.price,
      currency: 'USD',
      category: product.category,
      inStock: product.in_stock,
      sapCode: product.sap_product_code,
      images: product.product_images?.sort((a, b) => a.order - b.order).map(img => img.image_url) || [],
      features: product.product_features?.map(f => f.feature) || [],
      specifications: product.product_specifications?.reduce((acc, spec) => {
        acc[spec.key] = spec.value
        return acc
      }, {}) || {},
      configurableAttributes: product.product_attributes?.map(attr => ({
        id: attr.configurable_attributes.id,
        name: attr.configurable_attributes.name,
        description: attr.configurable_attributes.description,
        type: attr.configurable_attributes.attribute_type,
        required: attr.is_mandatory,
        helpText: attr.configurable_attributes.help_text,
        options: attr.configurable_attributes.attribute_values?.map(val => ({
          id: val.id,
          value: val.value,
          label: val.label,
          additionalPrice: val.additional_price || 0
        })) || []
      })) || [],
      orderEndpoint: `https://ouzxmcydhconwakrphtn.supabase.co/functions/v1/perplexity-commerce/order`
    }

    return new Response(
      JSON.stringify({
        success: true,
        product: transformedProduct
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Product details error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch product details' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleOrderCreation(req: Request, supabase: any) {
  try {
    const orderData: PerplexityOrderRequest = await req.json()
    console.log('Creating order from Perplexity:', orderData)

    // Validate required fields
    if (!orderData.productId || !orderData.quantity || !orderData.customerInfo || !orderData.shippingAddress) {
      return new Response(
        JSON.stringify({ error: 'Missing required order information' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', orderData.productId)
      .eq('web_status', 'Active')
      .single()

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found or unavailable' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    if (!product.in_stock) {
      return new Response(
        JSON.stringify({ error: 'Product is out of stock' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create order ID
    const timestamp = Date.now()
    const randomSuffix = Math.floor(Math.random() * 1000)
    const orderId = `PPLX-${timestamp}-${randomSuffix}`

    // Calculate total
    const unitPrice = product.price
    const totalPrice = unitPrice * orderData.quantity

    // Create address record
    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .insert({
        name: orderData.customerInfo.name,
        street: orderData.shippingAddress.street,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        zip: orderData.shippingAddress.zip,
        country: orderData.shippingAddress.country
      })
      .select()
      .single()

    if (addressError) {
      console.error('Error creating address:', addressError)
      return new Response(
        JSON.stringify({ error: 'Failed to create shipping address' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create sold-to party
    const { data: soldTo, error: soldToError } = await supabase
      .from('sold_to_parties')
      .insert({
        id: `PPLX-CUSTOMER-${timestamp}`,
        name: orderData.customerInfo.name,
        account_number: `PPLX-${timestamp}`,
        address_id: address.id,
        user_id: null // Perplexity orders don't have authenticated users
      })
      .select()
      .single()

    if (soldToError) {
      console.error('Error creating sold-to party:', soldToError)
      return new Response(
        JSON.stringify({ error: 'Failed to create customer record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create ship-to party
    const { data: shipTo, error: shipToError } = await supabase
      .from('ship_to_parties')
      .insert({
        id: `PPLX-SHIP-${timestamp}`,
        name: orderData.customerInfo.name,
        sold_to_id: soldTo.id,
        address_id: address.id
      })
      .select()
      .single()

    if (shipToError) {
      console.error('Error creating ship-to party:', shipToError)
      return new Response(
        JSON.stringify({ error: 'Failed to create shipping record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        user_id: null, // Perplexity orders are guest orders
        total: totalPrice,
        status: 'pending',
        sold_to_id: soldTo.id,
        ship_to_id: shipTo.id,
        order_date: new Date().toISOString()
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create order item
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: orderId,
        product_id: orderData.productId,
        quantity: orderData.quantity,
        price: unitPrice,
        name: product.name,
        status: 'pending'
      })

    if (itemError) {
      console.error('Error creating order item:', itemError)
      return new Response(
        JSON.stringify({ error: 'Failed to create order item' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        orderNumber: orderId,
        total: totalPrice,
        currency: 'USD',
        status: 'pending',
        estimatedDelivery: '5-7 business days',
        customerEmail: orderData.customerInfo.email,
        trackingInfo: {
          message: 'Order confirmation will be sent via email',
          trackingUrl: null
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create order' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleCatalogBrowse(req: Request, supabase: any) {
  try {
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    
    console.log('Fetching catalog with limit:', limit, 'offset:', offset)

    // Get categories
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('category')
      .eq('web_status', 'Active')

    if (productsError) {
      console.error('Error fetching categories:', productsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch catalog' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const categories = [...new Set(products.map(p => p.category))].filter(Boolean)

    // Get featured products
    const { data: featuredProducts, error: featuredError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        short_description,
        price,
        category,
        in_stock,
        product_images(image_url)
      `)
      .eq('web_status', 'Active')
      .eq('in_stock', true)
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (featuredError) {
      console.error('Error fetching featured products:', featuredError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch featured products' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const transformedProducts = featuredProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.short_description,
      price: product.price,
      currency: 'USD',
      category: product.category,
      inStock: product.in_stock,
      image: product.product_images?.[0]?.image_url || null,
      detailsUrl: `https://ouzxmcydhconwakrphtn.supabase.co/functions/v1/perplexity-commerce/product?id=${product.id}`
    }))

    return new Response(
      JSON.stringify({
        success: true,
        catalog: {
          categories,
          featuredProducts: transformedProducts,
          pagination: {
            limit,
            offset,
            hasMore: featuredProducts.length === limit
          }
        },
        searchEndpoint: 'https://ouzxmcydhconwakrphtn.supabase.co/functions/v1/perplexity-commerce/search',
        orderEndpoint: 'https://ouzxmcydhconwakrphtn.supabase.co/functions/v1/perplexity-commerce/order'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Catalog browse error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch catalog' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}
