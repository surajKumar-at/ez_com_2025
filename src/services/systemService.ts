import axiosInstance from '@/config/api';
import { CreateSystemDto, System, SystemResponse, SystemType, SystemTypeResponse } from '@/lib/dto/system.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

export const systemService = {
  getSystems: async (): Promise<System[]> => {
    try {
      const response = await axiosInstance.get<SystemResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SYSTEMS));
      
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
      const response = await axiosInstance.post<SystemResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SYSTEMS), systemData);
      
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
      const response = await axiosInstance.delete<SystemResponse>(`${getApiUrl(API_CONFIG.ENDPOINTS.SYSTEMS)}?ids=${systemIds.join(',')}`);
      
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
      const response = await axiosInstance.get<SystemTypeResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SYSTEM_TYPES));
      
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