import axios from 'axios';
import { MasterDefault, MasterDefaultCreate, MasterDefaultUpdate, ApiResponse } from '@/lib/dto/masterDefaults.dto';

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const masterDefaultsService = {
  getAll: async (sysKey: string = '999002'): Promise<ApiResponse<MasterDefault[]>> => {
    try {
      const response = await axios.get<ApiResponse<MasterDefault[]>>(`${API_BASE_URL}/master-defaults?sys_key=${sysKey}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching master defaults:', error);
      throw error;
    }
  },

  create: async (masterDefault: MasterDefaultCreate): Promise<ApiResponse<MasterDefault>> => {
    try {
      const response = await axios.post<ApiResponse<MasterDefault>>(`${API_BASE_URL}/master-defaults`, masterDefault, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating master default:', error);
      throw error;
    }
  },

  update: async (key: string, masterDefault: MasterDefaultUpdate): Promise<ApiResponse<MasterDefault>> => {
    try {
      const response = await axios.put<ApiResponse<MasterDefault>>(`${API_BASE_URL}/master-defaults`, { ...masterDefault, eudd_key: key }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating master default:', error);
      throw error;
    }
  },

  delete: async (key: string): Promise<ApiResponse<void>> => {
    try {
      const response = await axios.delete<ApiResponse<void>>(`${API_BASE_URL}/master-defaults`, {
        headers: getAuthHeaders(),
        data: { eudd_key: key }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting master default:', error);
      throw error;
    }
  }
};