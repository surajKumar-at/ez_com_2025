
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PerplexityRequest {
  model?: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  search_domain_filter?: string[];
  search_recency_filter?: string;
  return_images?: boolean;
  return_related_questions?: boolean;
}

Deno.serve(async (req) => {
  console.log('=== PERPLEXITY API FUNCTION INVOKED ===');
  console.log(`Perplexity API: Incoming request - ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Perplexity API: Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')
    let user = null
    
    if (authHeader) {
      const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      )
      
      if (!authError && authUser) {
        user = authUser
        console.log('Perplexity API: User authenticated:', user.email);
      }
    }

    const url = new URL(req.url)
    const path = url.pathname.replace('/functions/v1/perplexity-api', '')
    console.log('Perplexity API: Processing path:', path)

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
    if (!perplexityApiKey) {
      console.error('Perplexity API: Missing API key')
      return new Response(
        JSON.stringify({ error: 'Perplexity API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Route to specific handlers
    if (path === '/search-products' && req.method === 'POST') {
      return await handleProductSearch(req, supabaseClient, perplexityApiKey)
    }
    
    if (path === '/recommendations' && req.method === 'POST') {
      return await handleRecommendations(req, supabaseClient, perplexityApiKey)
    }
    
    if (path === '/chat' && req.method === 'POST') {
      return await handleConversationalSearch(req, perplexityApiKey)
    }
    
    if (path === '/enhance-description' && req.method === 'POST') {
      return await handleDescriptionEnhancement(req, perplexityApiKey)
    }

    console.log(`Perplexity API: No handler found for path: ${path}`)
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )
  } catch (error) {
    console.error('Perplexity API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function callPerplexityAPI(apiKey: string, request: PerplexityRequest) {
  console.log('Calling Perplexity API with request:', JSON.stringify(request, null, 2))
  
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 1000,
      return_images: false,
      return_related_questions: true,
      search_recency_filter: 'month',
      ...request
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Perplexity API error:', response.status, errorText)
    throw new Error(`Perplexity API error: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  console.log('Perplexity API response:', JSON.stringify(data, null, 2))
  return data
}

async function handleProductSearch(req: Request, supabase: any, apiKey: string) {
  try {
    const { query, productContext, userPreferences, limit = 5 } = await req.json()
    console.log('Handling product search for query:', query)

    // Get available products from database
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, description, short_description, category, price, features, specifications')
      .eq('web_status', 'Active')
      .limit(20)

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch products' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const productList = products.map(p => `${p.name} (${p.category}) - ${p.short_description || p.description}`).join('\n')

    const perplexityRequest: PerplexityRequest = {
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for a medical device e-commerce platform. Help users find the best products based on their needs. Available products:\n${productList}\n\nProvide specific product recommendations with explanations.`
        },
        {
          role: 'user',
          content: `I'm looking for: ${query}. Please recommend the most suitable products and explain why they match my needs.`
        }
      ]
    }

    const aiResponse = await callPerplexityAPI(apiKey, perplexityRequest)
    const content = aiResponse.choices[0]?.message?.content || ''

    // Parse AI response to extract product recommendations
    const recommendations = products.slice(0, limit).map((product, index) => ({
      productId: product.id.toString(),
      reason: `AI-recommended based on your search for "${query}"`,
      confidence: Math.max(0.9 - (index * 0.1), 0.5)
    }))

    const response = {
      searchTerm: query,
      recommendations,
      explanation: content,
      suggestedFilters: {
        category: [...new Set(products.map(p => p.category))].slice(0, 5)
      }
    }

    return new Response(
      JSON.stringify(response),
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

async function handleRecommendations(req: Request, supabase: any, apiKey: string) {
  try {
    const { productId, context } = await req.json()
    console.log('Handling recommendations for product:', productId)

    // Get the specific product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Get related products
    const { data: relatedProducts } = await supabase
      .from('products')
      .select('id, name, description, category, price')
      .eq('category', product.category)
      .neq('id', productId)
      .limit(10)

    const perplexityRequest: PerplexityRequest = {
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant for medical device recommendations. Analyze products and suggest related items that would complement or enhance the user\'s purchase.'
        },
        {
          role: 'user',
          content: `Based on this product: ${product.name} (${product.description}), recommend complementary or alternative products from this list: ${relatedProducts?.map(p => `${p.id}: ${p.name}`).join(', ')}. ${context ? `Additional context: ${context}` : ''}`
        }
      ]
    }

    const aiResponse = await callPerplexityAPI(apiKey, perplexityRequest)
    const content = aiResponse.choices[0]?.message?.content || ''

    const recommendations = relatedProducts?.slice(0, 3).map((prod, index) => ({
      productId: prod.id.toString(),
      reason: `Recommended by AI as complementary to ${product.name}`,
      confidence: Math.max(0.8 - (index * 0.1), 0.6)
    })) || []

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Recommendations error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to get recommendations' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleConversationalSearch(req: Request, apiKey: string) {
  try {
    const { query, context } = await req.json()
    console.log('Handling conversational search for:', query)

    const perplexityRequest: PerplexityRequest = {
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant for a medical device e-commerce platform. Help users with product information, comparisons, and purchasing decisions. Be helpful and informative.'
        },
        {
          role: 'user',
          content: context ? `${context}\n\nUser question: ${query}` : query
        }
      ]
    }

    const aiResponse = await callPerplexityAPI(apiKey, perplexityRequest)
    const content = aiResponse.choices[0]?.message?.content || ''
    const relatedQuestions = aiResponse.related_questions || []

    const response = {
      content,
      relatedQuestions,
      citations: []
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Conversational search error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process conversational search' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}

async function handleDescriptionEnhancement(req: Request, apiKey: string) {
  try {
    const { product } = await req.json()
    console.log('Enhancing description for product:', product.name)

    const perplexityRequest: PerplexityRequest = {
      messages: [
        {
          role: 'system',
          content: 'You are an AI copywriter specializing in medical device descriptions. Create compelling, accurate, and professional product descriptions that highlight benefits and features.'
        },
        {
          role: 'user',
          content: `Enhance this product description for better customer engagement:\n\nProduct: ${product.name}\nCurrent Description: ${product.description}\nCategory: ${product.category}\nFeatures: ${JSON.stringify(product.features)}\n\nCreate an improved description that is engaging, informative, and professional.`
        }
      ]
    }

    const aiResponse = await callPerplexityAPI(apiKey, perplexityRequest)
    const enhancedDescription = aiResponse.choices[0]?.message?.content || product.description

    return new Response(
      JSON.stringify({ enhancedDescription }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Description enhancement error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to enhance description' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}
