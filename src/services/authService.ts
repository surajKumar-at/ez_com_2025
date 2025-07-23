import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { LoginRequestDto, UserSessionDto } from '@/lib/dto/user.dto';

const API_BASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co/functions/v1';

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
      // Sign in with Supabase Auth
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Authentication failed'
        };
      }

      // Get user data from ezc_users
      const { data: userData, error: userError } = await supabase
        .from('ezc_users')
        .select('*')
        .eq('supabase_user_id', authData.user.id)
        .eq('eu_deletion_flag', 'N')
        .single();

      if (userError || !userData) {
        await supabase.auth.signOut();
        return {
          success: false,
          message: 'User not found or inactive'
        };
      }

      // Check login type restrictions
      if (data.loginType === 'admin' && userData.eu_type !== 1) {
        await supabase.auth.signOut();
        return {
          success: false,
          message: 'Admin access required'
        };
      }

      // Get user permissions for menu display
      const permissions = await this.getUserPermissions(userData.eu_id);
      
      // For non-admin users, get sold-to options and store in Upstash
      let sessionData: UserSessionDto = {
        user: userData,
        permissions
      };

      if (userData.eu_type !== 1) {
        const soldToOptions = await this.getUserSoldToOptions(userData.eu_id);
        sessionData.soldToOptions = soldToOptions;

        // Store session in Upstash (24 hours TTL)
        const sessionKey = `user_session:${userData.eu_id}`;
        await upstash.set(sessionKey, sessionData, 86400);
      }

      // Update last login
      await supabase
        .from('ezc_users')
        .update({
          eu_last_login_date: new Date().toLocaleDateString('en-US'),
          eu_last_login_time: new Date().toLocaleTimeString('en-US')
        })
        .eq('eu_id', userData.eu_id);

      return {
        success: true,
        user: userData,
        session: sessionData,
        message: 'Login successful'
      };
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
    // Get current user to clear their session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get ezc_users data to find eu_id
      const { data: userData } = await supabase
        .from('ezc_users')
        .select('eu_id')
        .eq('supabase_user_id', user.id)
        .single();

      if (userData) {
        // Clear session from Upstash
        const sessionKey = `user_session:${userData.eu_id}`;
        await upstash.del(sessionKey);
      }
    }

    await supabase.auth.signOut();
  },

  async getUserPermissions(userId: string): Promise<Array<{auth_key: string, auth_value: string}>> {
    try {
      const { data, error } = await supabase.rpc('get_user_permissions', { user_id: userId });
      
      if (error) {
        console.error('Error fetching user permissions:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  },

  async getUserSoldToOptions(userId: string): Promise<Array<{customer_no: string, customer_name: string, sys_key: string}>> {
    try {
      const { data, error } = await supabase.rpc('get_user_sold_to_options', { user_id: userId });
      
      if (error) {
        console.error('Error fetching sold-to options:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching sold-to options:', error);
      return [];
    }
  },

  async getShipToOptions(soldTo: string): Promise<Array<{customer_no: string, customer_name: string, reference_no: number}>> {
    try {
      const { data, error } = await supabase.rpc('get_ship_to_options', { sold_to: soldTo });
      
      if (error) {
        console.error('Error fetching ship-to options:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching ship-to options:', error);
      return [];
    }
  },

  async updateSessionSoldTo(userId: string, soldTo: string): Promise<void> {
    try {
      const sessionKey = `user_session:${userId}`;
      const session = await upstash.get(sessionKey);
      
      if (session) {
        session.selectedSoldTo = soldTo;
        session.shipToOptions = await this.getShipToOptions(soldTo);
        await upstash.set(sessionKey, session, 86400);
      }
    } catch (error) {
      console.error('Error updating session sold-to:', error);
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