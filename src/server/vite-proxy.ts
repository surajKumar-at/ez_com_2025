
import type { Plugin } from 'vite';
import axios from 'axios';

const SUPABASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmb25tYmJoeXJldWV3ZGN2Znl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODYwMzksImV4cCI6MjA2ODE2MjAzOX0.BFHVOVIU7Fb89Wys1Mwtc2mzwiRmpGKZyyrF1o55DX0';

export function apiProxyPlugin(): Plugin {
  return {
    name: 'api-proxy',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        console.log(`🔄 API Proxy intercepted: ${req.method} ${req.url}`);

        // Handle CORS preflight requests
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
          res.end();
          return;
        }

        try {
          // Extract the endpoint path from /api/endpoint-name
          const endpoint = req.url || '';
          console.log(`➡️ Extracted endpoint: ${endpoint}`);

          const headers: any = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
          };

          // Forward authorization header if present
          if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
            console.log('🔐 Forwarding auth header');
          }

          // Handle system-types as a sub-path of systems
          let supabaseUrl;
          if (endpoint === '/system-types') {
            supabaseUrl = `${SUPABASE_URL}/functions/v1/systems/system-types`;
          } else {
            supabaseUrl = `${SUPABASE_URL}/functions/v1${endpoint}`;
          }
          console.log(`📡 Forwarding to: ${supabaseUrl}`);

          let response;
          let requestBody = '';

          // Collect request body for POST/PUT requests
          if (req.method === 'POST' || req.method === 'PUT') {
            await new Promise<void>((resolve) => {
              req.on('data', chunk => {
                requestBody += chunk.toString();
              });
              req.on('end', () => {
                resolve();
              });
            });

            console.log(`📦 Request body: ${requestBody}`);
            
            const parsedBody = requestBody ? JSON.parse(requestBody) : {};
            
            if (req.method === 'POST') {
              response = await axios.post(supabaseUrl, parsedBody, { headers });
            } else if (req.method === 'PUT') {
              response = await axios.put(supabaseUrl, parsedBody, { headers });
            }
          } else {
            // Handle GET/DELETE requests
            if (req.method === 'GET') {
              response = await axios.get(supabaseUrl, { headers });
            } else if (req.method === 'DELETE') {
              response = await axios.delete(supabaseUrl, { headers });
            }
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
          res.end(JSON.stringify({
            success: false,
            error: error.response?.data?.message || error.message || 'Internal server error'
          }));
        }
      });
    },
    configurePreviewServer(server) {
      // Also configure for preview server
      server.middlewares.use('/api', async (req, res, next) => {
        console.log(`🔄 Preview API Proxy intercepted: ${req.method} ${req.url}`);

        // Handle CORS preflight requests
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
          res.end();
          return;
        }

        try {
          // Extract the endpoint path from /api/endpoint-name
          const endpoint = req.url || '';
          console.log(`➡️ Extracted endpoint: ${endpoint}`);

          const headers: any = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
          };

          // Forward authorization header if present
          if (req.headers.authorization) {
            headers['Authorization'] = req.headers.authorization;
            console.log('🔐 Forwarding auth header');
          }

          // Handle system-types as a sub-path of systems  
          let supabaseUrl;
          if (endpoint === '/system-types') {
            supabaseUrl = `${SUPABASE_URL}/functions/v1/systems/system-types`;
          } else {
            supabaseUrl = `${SUPABASE_URL}/functions/v1${endpoint}`;
          }
          console.log(`📡 Forwarding to: ${supabaseUrl}`);

          let response;
          let requestBody = '';

          // Collect request body for POST/PUT requests
          if (req.method === 'POST' || req.method === 'PUT') {
            await new Promise<void>((resolve) => {
              req.on('data', chunk => {
                requestBody += chunk.toString();
              });
              req.on('end', () => {
                resolve();
              });
            });

            console.log(`📦 Request body: ${requestBody}`);
            
            const parsedBody = requestBody ? JSON.parse(requestBody) : {};
            
            if (req.method === 'POST') {
              response = await axios.post(supabaseUrl, parsedBody, { headers });
            } else if (req.method === 'PUT') {
              response = await axios.put(supabaseUrl, parsedBody, { headers });
            }
          } else {
            // Handle GET/DELETE requests
            if (req.method === 'GET') {
              response = await axios.get(supabaseUrl, { headers });
            } else if (req.method === 'DELETE') {
              response = await axios.delete(supabaseUrl, { headers });
            }
          }

          console.log(`✅ Supabase response status: ${response?.status}`);
          console.log(`📋 Response data:`, response?.data);

          res.statusCode = response?.status || 200;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
          res.end(JSON.stringify(response?.data));

        } catch (error: any) {
          console.error('❌ Preview Proxy error:', error.message);
          console.error('❌ Error response:', error.response?.data);

          res.statusCode = error.response?.status || 500;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({
            success: false,
            error: error.response?.data?.message || error.message || 'Internal server error'
          }));
        }
      });
    }
  };
}
