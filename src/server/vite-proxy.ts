
import type { Plugin } from 'vite';
import axios from 'axios';

const SUPABASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmb25tYmJoeXJldWV3ZGN2Znl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODYwMzksImV4cCI6MjA2ODE2MjAzOX0.BFHVOVIU7Fb89Wys1Mwtc2mzwiRmpGKZyyrF1o55DX0';

export function apiProxyPlugin(): Plugin {
  return {
    name: 'api-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Only handle requests that start with /api/
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        console.log(`🔄 Intercepted request: ${req.method} ${req.url}`);

        // Handle CORS preflight requests
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
          res.end();
          return;
        }

        // Extract the endpoint path from /api/endpoint-name
        const endpoint = req.url.replace('/api', '');
        console.log(`➡️ Extracted endpoint: ${endpoint}`);

        const headers: any = {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        };

        // Forward authorization header if present
        if (req.headers.authorization) {
          headers['Authorization'] = req.headers.authorization;
          console.log('🔐 Forwarding auth header');
        }

        const supabaseUrl = `${SUPABASE_URL}/functions/v1${endpoint}`;
        console.log(`📡 Forwarding to: ${supabaseUrl}`);

        // Handle POST/PUT requests with body
        if (req.method === 'POST' || req.method === 'PUT') {
          let body = '';
          
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              console.log(`📦 Request body: ${body}`);
              
              const config = { headers };
              let response;

              if (req.method === 'POST') {
                response = await axios.post(supabaseUrl, body ? JSON.parse(body) : {}, config);
              } else if (req.method === 'PUT') {
                response = await axios.put(supabaseUrl, body ? JSON.parse(body) : {}, config);
              }

              console.log(`✅ Supabase response status: ${response?.status}`);
              console.log(`📋 Response data:`, response?.data);

              res.statusCode = response?.status || 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
              res.end(JSON.stringify(response?.data));
            } catch (error: any) {
              console.error('❌ Proxy error:', error.message);
              console.error('❌ Error response:', error.response?.data);

              res.statusCode = error.response?.status || 500;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify(error.response?.data || { success: false, error: 'Internal server error' }));
            }
          });
        } else {
          // Handle GET/DELETE requests
          (async () => {
            try {
              const config = { headers };
              let response;

              if (req.method === 'GET') {
                response = await axios.get(supabaseUrl, config);
              } else if (req.method === 'DELETE') {
                response = await axios.delete(supabaseUrl, config);
              }

              console.log(`✅ Supabase response status: ${response?.status}`);

              res.statusCode = response?.status || 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
              res.end(JSON.stringify(response?.data));
            } catch (error: any) {
              console.error('❌ Proxy error:', error.message);
              console.error('❌ Error details:', error.response?.data);

              res.statusCode = error.response?.status || 500;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify(error.response?.data || { success: false, error: 'Internal server error' }));
            }
          })();
        }
      });
    }
  };
}
