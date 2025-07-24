import axios from 'axios';
import { 
  SystemAuthDto, 
  AuthDescriptionDto, 
  SystemAuthAssignmentDto, 
  SystemAuthRequest,
  SystemAuthResponse 
} from '@/lib/dto/systemAuth.dto';

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const systemAuthService = {
  // Get all systems for dropdown
  async getSystems(): Promise<SystemAuthDto[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/system-auth/systems`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch systems');
      }
    } catch (error) {
      console.error('Error fetching systems:', error);
      throw error;
    }
  },

  // Get all authorization descriptions
  async getAuthDescriptions(): Promise<AuthDescriptionDto[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/system-auth/auth-descriptions`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch authorization descriptions');
      }
    } catch (error) {
      console.error('Error fetching authorization descriptions:', error);
      throw error;
    }
  },

  // Get system's current authorizations
  async getSystemAuthorizations(systemId: number): Promise<SystemAuthAssignmentDto[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/system-auth/system-authorizations/${systemId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch system authorizations');
      }
    } catch (error) {
      console.error('Error fetching system authorizations:', error);
      throw error;
    }
  },

  // Update system authorizations
  async updateSystemAuthorizations(systemAuthRequest: SystemAuthRequest): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/system-auth/update`, systemAuthRequest, {
        headers: getAuthHeaders()
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update system authorizations');
      }
    } catch (error) {
      console.error('Error updating system authorizations:', error);
      throw error;
    }
  }
};