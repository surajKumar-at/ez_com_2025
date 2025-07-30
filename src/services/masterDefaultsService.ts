import axiosInstance from '@/config/api';
import { MasterDefault, MasterDefaultCreate, MasterDefaultUpdate, ApiResponse } from '@/lib/dto/masterDefaults.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

export const masterDefaultsService = {
  getAll: async (sysKey: string = '999002'): Promise<ApiResponse<MasterDefault[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<MasterDefault[]>>(`${getApiUrl(API_CONFIG.ENDPOINTS.MASTER_DEFAULTS)}?sys_key=${sysKey}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching master defaults:', error);
      throw error;
    }
  },

  create: async (masterDefault: MasterDefaultCreate): Promise<ApiResponse<MasterDefault>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<MasterDefault>>(getApiUrl(API_CONFIG.ENDPOINTS.MASTER_DEFAULTS), masterDefault);
      return response.data;
    } catch (error) {
      console.error('Error creating master default:', error);
      throw error;
    }
  },

  update: async (key: string, masterDefault: MasterDefaultUpdate): Promise<ApiResponse<MasterDefault>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<MasterDefault>>(getApiUrl(API_CONFIG.ENDPOINTS.MASTER_DEFAULTS), { ...masterDefault, eudd_key: key });
      return response.data;
    } catch (error) {
      console.error('Error updating master default:', error);
      throw error;
    }
  },

  delete: async (key: string): Promise<ApiResponse<void>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(getApiUrl(API_CONFIG.ENDPOINTS.MASTER_DEFAULTS), {
        data: { eudd_key: key }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting master default:', error);
      throw error;
    }
  }
};