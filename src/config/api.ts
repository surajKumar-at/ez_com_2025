import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// API Configuration
// This handles both local development (with Vite proxy) and production deployment

const isDevelopment = import.meta.env.DEV;
const SUPABASE_PROJECT_ID = 'ifonmbbhyreuewdcvfyt';

export const API_CONFIG = {
  // Use proxy in development, direct Supabase URL in production
  BASE_URL: '/api',
  // BASE_URL: isDevelopment 
  //   ? '/api' 
  //   : `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1`,
  
  // Individual endpoint helpers
  ENDPOINTS: {
    AUTH_LOGIN: '/auth-login',
    AUTH_LOGOUT: '/auth-logout', 
    AUTH_SESSION: '/auth-session',
    AUTH_SIGNUP: '/auth-signup',
    MASTER_DEFAULTS: '/master-defaults',
    SAP_BUSINESS_PARTNER: '/sap-business-partner',
    SALES_AREAS: '/sales-areas',
    SYSTEMS: '/systems',
    SYSTEM_TYPES: '/system-types',
    SYSTEM_AUTH: '/system-auth',
    USERS: '/users',
    USER_ROLES: '/user-roles',
    ADVERSE_EVENTS: '/adverse-events',
    SITE_DEFAULTS: '/site-defaults',
    CHECK_CUSTOMER_EXISTS: '/check-customer-exists'
  }
};

// Helper function to get full URL for an endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Centralized Axios instance with interceptors
const axiosInstance: AxiosInstance = axios.create({
  timeout: 30000,
  baseURL: "",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors globally
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      // Optionally redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;