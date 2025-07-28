// API Configuration
// This handles both local development (with Vite proxy) and production deployment

const isDevelopment = import.meta.env.DEV;
const SUPABASE_PROJECT_ID = 'ifonmbbhyreuewdcvfyt';

export const API_CONFIG = {
  // Use proxy in development, direct Supabase URL in production
  BASE_URL: isDevelopment 
    ? '/api' 
    : `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1`,
  
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
    SITE_DEFAULTS: '/site-defaults'
  }
};

// Helper function to get full URL for an endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};