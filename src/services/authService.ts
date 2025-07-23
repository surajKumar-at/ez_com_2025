
import axios from 'axios';
import { LoginRequestDto, UserSessionDto } from '@/lib/dto/user.dto';

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

export interface LoginRequest {
  email: string;
  password: string;
  loginType?: 'admin' | 'user';
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: number;
}

export interface AuthResponse {
  success: boolean;
  user?: any;
  session?: UserSessionDto;
  message?: string;
}

// Upstash Redis client for session management
class UpstashClient {
  private token: string;
  private baseUrl: string;

  constructor() {
    this.token = 'AevtAAIjcDE0NTQ0NTVkYjI4MjE0ZjcyOTJhMTU1ZTUyODcxOTRmZHAxMA';
    this.baseUrl = 'https://evolved-cod-60397.upstash.io';
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const command = ttl ? ['SET', key, JSON.stringify(value), 'EX', ttl] : ['SET', key, JSON.stringify(value)];
    
    await fetch(`${this.baseUrl}/command`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });
  }

  async get(key: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/command`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['GET', key])
    });

    const data = await response.json();
    return data.result ? JSON.parse(data.result) : null;
  }

  async del(key: string): Promise<void> {
    await fetch(`${this.baseUrl}/command`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['DEL', key])
    });
  }
}

const upstash = new UpstashClient();

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting login for:', data.email);
      
      const response = await axios.post(`${API_BASE_URL}/auth-login`, {
        email: data.email,
        password: data.password,
        loginType: data.loginType || 'user'
      });

      console.log('✅ Login response:', response.data);

      if (response.data.success && response.data.user) {
        // Store the auth token for future requests
        localStorage.setItem('auth_token', response.data.user.supabase_user_id);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        console.log('✅ Auth data stored successfully');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting signup for:', data.email);
      
      const response = await axios.post(`${API_BASE_URL}/auth-signup`, data);
      
      console.log('✅ Signup response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  },

  async logout(): Promise<void> {
    try {
      console.log('🔓 Attempting logout');
      
      const response = await axios.post(`${API_BASE_URL}/auth-logout`, {}, {
        headers: getAuthHeaders()
      });
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      console.log('✅ Logout successful:', response.data);
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Clear local storage even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  async getCurrentSession(): Promise<AuthResponse> {
    try {
      console.log('🔍 Checking current session');
      
      const response = await axios.get(`${API_BASE_URL}/auth-session`, {
        headers: getAuthHeaders()
      });
      
      console.log('✅ Session check response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Session check error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Session check failed'
      };
    }
  },

  async getSession(userId: string): Promise<UserSessionDto | null> {
    try {
      const sessionKey = `user_session:${userId}`;
      return await upstash.get(sessionKey);
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }
};
