import axios from 'axios';
import { CreateSystemDto, System, SystemResponse, SystemType, SystemTypeResponse } from '@/lib/dto/system.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  console.log("AUTH "+token);;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const systemService = {
  getSystems: async (): Promise<System[]> => {
    try {
      const response = await axios.get<SystemResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SYSTEMS), {
        headers: getAuthHeaders()
      });
      
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch systems');
    } catch (error) {
      console.error('Error fetching systems:', error);
      throw error;
    }
  },

  createSystem: async (systemData: CreateSystemDto): Promise<System> => {
    try {
      const response = await axios.post<SystemResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SYSTEMS), systemData, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data as System;
      }
      throw new Error(response.data.error || 'Failed to create system');
    } catch (error) {
      console.error('Error creating system:', error);
      throw error;
    }
  },

  deleteSystems: async (systemIds: number[]): Promise<void> => {
    try {
      const response = await axios.delete<SystemResponse>(`${getApiUrl(API_CONFIG.ENDPOINTS.SYSTEMS)}?ids=${systemIds.join(',')}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete systems');
      }
    } catch (error) {
      console.error('Error deleting systems:', error);
      throw error;
    }
  },

  getSystemTypes: async (): Promise<SystemType[]> => {
    try {
      const response = await axios.get<SystemTypeResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SYSTEM_TYPES), {
        headers: getAuthHeaders()
      });
      
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch system types');
    } catch (error) {
      console.error('Error fetching system types:', error);
      throw error;
    }
  }
};