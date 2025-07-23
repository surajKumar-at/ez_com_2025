
import type { Plugin } from 'vite';
import axios from 'axios';

const SUPABASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmb25tYmJoeXJldWV3ZGN2Znl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODYwMzksImV4cCI6MjA2ODE2MjAzOX0.BFHVOVIU7Fb89Wys1Mwtc2mzwiRmpGKZyyrF1o55DX0';

export function apiProxyPlugin(): Plugin {
  return {
    name: 'api-proxy',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        if (req.url?.startsWith('/api/')) {
          try {
            const endpoint = req.url.replace('/api', '');
            console.log(`🔄 Proxying request: ${req.method} ${endpoint}`);
            
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
            console.log(`➡️ Forwarding to: ${supabaseUrl}`);
            
            let body = '';
            if (req.method === 'POST' || req.method === 'PUT') {
              req.on('data', chunk => {
                body += chunk.toString();
              });
              await new Promise(resolve => req.on('end', resolve));
            }

            let response;
            const config = { headers };
            
            switch (req.method) {
              case 'GET':
                response = await axios.get(supabaseUrl, config);
                break;
              case 'POST':
                response = await axios.post(supabaseUrl, body ? JSON.parse(body) : {}, config);
                break;
              case 'PUT':
                response = await axios.put(supabaseUrl, body ? JSON.parse(body) : {}, config);
                break;
              case 'DELETE':
                response = await axios.delete(supabaseUrl, config);
                break;
              case 'OPTIONS':
                res.statusCode = 200;
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
                res.end();
                return;
              default:
                console.log(`❌ Method not allowed: ${req.method}`);
                res.statusCode = 405;
                res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
                return;
            }

            console.log(`✅ Supabase response status: ${response.status}`);
            
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
            res.end(JSON.stringify(response.data));
          } catch (error: any) {
            console.error('❌ Proxy error:', error.message);
            console.error('❌ Error details:', error.response?.data);
            
            res.statusCode = error.response?.status || 500;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(error.response?.data || { success: false, error: 'Internal server error' }));
          }
        } else {
          next();
        }
      });
    }
  };
}
