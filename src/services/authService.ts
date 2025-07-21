import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co/functions/v1';

export interface LoginRequest {
  email: string;
  password: string;
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
  message?: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth-login`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth-signup`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
};