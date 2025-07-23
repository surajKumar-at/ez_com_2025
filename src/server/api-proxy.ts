
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase configuration (server-side only)
const SUPABASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmb25tYmJoeXJldWV3ZGN2Znl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODYwMzksImV4cCI6MjA2ODE2MjAzOX0.BFHVOVIU7Fb89Wys1Mwtc2mzwiRmpGKZyyrF1o55DX0';

app.use(cors());
app.use(express.json());

// Middleware to forward auth headers and add Supabase API key
const forwardToSupabase = async (req: express.Request, res: express.Response, endpoint: string) => {
  try {
    const headers: any = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY
    };

    // Forward authorization header if present
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    const supabaseUrl = `${SUPABASE_URL}/functions/v1${endpoint}`;
    
    let response;
    switch (req.method) {
      case 'GET':
        response = await axios.get(supabaseUrl + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''), { headers });
        break;
      case 'POST':
        response = await axios.post(supabaseUrl, req.body, { headers });
        break;
      case 'PUT':
        response = await axios.put(supabaseUrl + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''), req.body, { headers });
        break;
      case 'DELETE':
        response = await axios.delete(supabaseUrl + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''), { headers });
        break;
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
};

// API Routes
app.all('/api/adverse-events*', (req, res) => forwardToSupabase(req, res, '/adverse-events'));
app.all('/api/systems*', (req, res) => forwardToSupabase(req, res, '/systems'));
app.all('/api/user-roles*', (req, res) => forwardToSupabase(req, res, '/user-roles'));
app.all('/api/users*', (req, res) => forwardToSupabase(req, res, '/users'));
app.all('/api/auth-login*', (req, res) => forwardToSupabase(req, res, '/auth-login'));
app.all('/api/auth-signup*', (req, res) => forwardToSupabase(req, res, '/auth-signup'));
app.all('/api/auth-logout*', (req, res) => forwardToSupabase(req, res, '/auth-logout'));
app.all('/api/auth-session*', (req, res) => forwardToSupabase(req, res, '/auth-session'));

app.listen(PORT, () => {
  console.log(`API Proxy server running on port ${PORT}`);
});

export default app;
