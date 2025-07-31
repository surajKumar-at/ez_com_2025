
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  console.log('=== PERPLEXITY PLUGIN MANIFEST ===');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/perplexity-plugin', '')
    
    // Serve plugin manifest
    if (path === '/manifest.json' || path === '' || path === '/') {
      const manifest = {
        schema_version: "v1",
        name_for_model: "MedicalDeviceCommerce",
        name_for_human: "Medical Device E-Commerce",
        description_for_model: "A comprehensive medical device e-commerce platform that allows users to search for medical devices, view detailed product information, and place orders directly through conversation. The platform specializes in configurable medical equipment with real-time inventory and SAP integration.",
        description_for_human: "Search and order medical devices through natural conversation",
        auth: {
          type: "none"
        },
        api: {
          type: "openapi",
          url: "https://ouzxmcydhconwakrphtn.supabase.co/functions/v1/perplexity-plugin/openapi.yaml"
        },
        logo_url: "https://ouzxmcydhconwakrphtn.supabase.co/storage/v1/object/public/Product%20Images/logo.png",
        contact_email: "support@medicaldevices.com",
        legal_info_url: "https://medicaldevices.com/legal"
      }

      return new Response(
        JSON.stringify(manifest, null, 2),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Serve OpenAPI specification
    if (path === '/openapi.yaml') {
      const openApiSpec = `
openapi: 3.0.1
info:
  title: Medical Device E-Commerce API
  description: API for searching and ordering medical devices through conversational AI
  version: 1.0.0
servers:
  - url: https://ouzxmcydhconwakrphtn.supabase.co/functions/v1/perplexity-commerce
paths:
  /search:
    get:
      operationId: searchProducts
      summary: Search for medical devices
      description: Search the product catalog using natural language queries
      parameters:
        - name: query
          in: query
          description: Search query for products (e.g., "configurable bed", "surgical instruments")
          required: true
          schema:
            type: string
        - name: limit
          in: query
          description: Maximum number of results to return
          schema:
            type: integer
            default: 10
            maximum: 50
        - name: category
          in: query
          description: Filter by product category
          schema:
            type: string
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  query:
                    type: string
                  totalResults:
                    type: integer
                  products:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
  /product:
    get:
      operationId: getProductDetails
      summary: Get detailed product information
      description: Retrieve comprehensive details about a specific product including configuration options
      parameters:
        - name: id
          in: query
          description: Product ID
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Product details
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  product:
                    $ref: '#/components/schemas/ProductDetails'
  /order:
    post:
      operationId: createOrder
      summary: Create a new order
      description: Place an order for a product with customer and shipping information
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderRequest'
      responses:
        '200':
          description: Order created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderResponse'
  /catalog:
    get:
      operationId: browseCatalog
      summary: Browse product catalog
      description: Get an overview of available product categories and featured items
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: Catalog overview
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  catalog:
                    type: object
                    properties:
                      categories:
                        type: array
                        items:
                          type: string
                      featuredProducts:
                        type: array
                        items:
                          $ref: '#/components/schemas/Product'
components:
  schemas:
    Product:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        description:
          type: string
        price:
          type: number
        currency:
          type: string
        category:
          type: string
        inStock:
          type: boolean
        sapCode:
          type: string
        images:
          type: array
          items:
            type: string
        features:
          type: array
          items:
            type: string
        detailsUrl:
          type: string
        purchaseUrl:
          type: string
    ProductDetails:
      allOf:
        - $ref: '#/components/schemas/Product'
        - type: object
          properties:
            specifications:
              type: object
            configurableAttributes:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  description:
                    type: string
                  type:
                    type: string
                  required:
                    type: boolean
                  options:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                        value:
                          type: string
                        label:
                          type: string
                        additionalPrice:
                          type: number
    OrderRequest:
      type: object
      required:
        - productId
        - quantity
        - customerInfo
        - shippingAddress
      properties:
        productId:
          type: integer
        quantity:
          type: integer
        customerInfo:
          type: object
          required:
            - name
            - email
          properties:
            name:
              type: string
            email:
              type: string
            phone:
              type: string
        shippingAddress:
          type: object
          required:
            - street
            - city
            - state
            - zip
            - country
          properties:
            street:
              type: string
            city:
              type: string
            state:
              type: string
            zip:
              type: string
            country:
              type: string
        configuration:
          type: object
          description: Selected configuration options for configurable products
    OrderResponse:
      type: object
      properties:
        success:
          type: boolean
        orderId:
          type: string
        orderNumber:
          type: string
        total:
          type: number
        currency:
          type: string
        status:
          type: string
        estimatedDelivery:
          type: string
        customerEmail:
          type: string
        trackingInfo:
          type: object
          properties:
            message:
              type: string
            trackingUrl:
              type: string
`

      return new Response(
        openApiSpec,
        { headers: { ...corsHeaders, 'Content-Type': 'application/yaml' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )
  } catch (error) {
    console.error('Plugin manifest error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
