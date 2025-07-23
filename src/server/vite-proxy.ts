
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
            const headers: any = {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            };

            // Forward authorization header if present
            if (req.headers.authorization) {
              headers['Authorization'] = req.headers.authorization;
            }

            const supabaseUrl = `${SUPABASE_URL}/functions/v1${endpoint}`;
            
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
              default:
                res.statusCode = 405;
                res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
                return;
            }

            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
            res.end(JSON.stringify(response.data));
          } catch (error: any) {
            console.error('Proxy error:', error.message);
            res.statusCode = error.response?.status || 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(error.response?.data || { success: false, error: 'Internal server error' }));
          }
        } else {
          next();
        }
      });
    }
  };
}
