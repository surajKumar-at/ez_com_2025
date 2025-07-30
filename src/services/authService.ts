import axiosInstance from 'axios';
// import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { LoginRequestDto, UserSessionDto } from '@/lib/dto/user.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

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
      console.log('🌐 Current location:', window.location.href);
      console.log('📡 API Base URL:', API_CONFIG.BASE_URL);
      
      const loginUrl = getApiUrl(API_CONFIG.ENDPOINTS.AUTH_LOGIN);
      console.log('🎯 Login URL:', loginUrl);
      
      const requestData = {
        email: data.email,
        password: data.password,
        loginType: data.loginType || 'user'
      };
      
      console.log('📦 Request data:', requestData);
      
      const response = await axiosInstance.post(loginUrl, requestData);

      console.log('✅ Login response:', response.data);

      if (response.data.success && response.data.user) {
        // Store the auth token for future requests
        localStorage.setItem('auth_token', response.data.session.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        console.log('✅ Auth data stored successfully');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting signup for:', data.email);
      
      const response = await axiosInstance.post(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_SIGNUP), data);
      
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
      
      const response = await axiosInstance.post(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_LOGOUT), {});
      
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
      
      const response = await axiosInstance.get(getApiUrl(API_CONFIG.ENDPOINTS.AUTH_SESSION));
      
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
