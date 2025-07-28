import axios from 'axios';
import { MasterDefault, MasterDefaultCreate, MasterDefaultUpdate, ApiResponse } from '@/lib/dto/masterDefaults.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

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
      const response = await axios.get<ApiResponse<MasterDefault[]>>(`${getApiUrl(API_CONFIG.ENDPOINTS.MASTER_DEFAULTS)}?sys_key=${sysKey}`, {
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
      const response = await axios.post<ApiResponse<MasterDefault>>(getApiUrl(API_CONFIG.ENDPOINTS.MASTER_DEFAULTS), masterDefault, {
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
      const response = await axios.put<ApiResponse<MasterDefault>>(getApiUrl(API_CONFIG.ENDPOINTS.MASTER_DEFAULTS), { ...masterDefault, eudd_key: key }, {
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
      const response = await axios.delete<ApiResponse<void>>(getApiUrl(API_CONFIG.ENDPOINTS.MASTER_DEFAULTS), {
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