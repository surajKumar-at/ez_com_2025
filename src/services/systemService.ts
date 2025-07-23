import axios from 'axios';
import { CreateSystemDto, System, SystemResponse } from '@/lib/dto/system.dto';

const API_BASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co/functions/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const systemService = {
  getSystems: async (): Promise<System[]> => {
    try {
      const response = await axios.get<SystemResponse>(`${API_BASE_URL}/systems`, {
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
      const response = await axios.post<SystemResponse>(`${API_BASE_URL}/systems`, systemData, {
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
      const response = await axios.delete<SystemResponse>(`${API_BASE_URL}/systems?ids=${systemIds.join(',')}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete systems');
      }
    } catch (error) {
      console.error('Error deleting systems:', error);
      throw error;
    }
  }
};