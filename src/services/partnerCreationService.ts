import axiosInstance from '@/config/api';
import { PartnerCreation, PartnerCreationCreate, PartnerCreationUpdate, CatalogOption, ApiResponse } from '@/lib/dto/partnerCreation.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

export const partnerCreationService = {
  getAll: async (): Promise<ApiResponse<PartnerCreation[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<PartnerCreation[]>>(getApiUrl('/partner-creation'));
      return response.data;
    } catch (error) {
      console.error('Error fetching partner creations:', error);
      throw error;
    }
  },

  getCatalogOptions: async (): Promise<ApiResponse<CatalogOption[]>> => {
    try {
      console.log('🔄 Fetching catalog options...');
      const url = getApiUrl('/partner-creation/catalogs');
      console.log('📡 Request URL:', url);
      
      const response = await axiosInstance.get<ApiResponse<CatalogOption[]>>(url);
      console.log('✅ Catalog options response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching catalog options:', error);
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response data:', error.response.data);
      }
      throw error;
    }
  },

  create: async (partnerCreation: PartnerCreationCreate): Promise<ApiResponse<PartnerCreation>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<PartnerCreation>>(getApiUrl('/partner-creation'), partnerCreation);
      return response.data;
    } catch (error) {
      console.error('Error creating partner creation:', error);
      throw error;
    }
  },

  update: async (id: number, partnerCreation: PartnerCreationUpdate): Promise<ApiResponse<PartnerCreation>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<PartnerCreation>>(getApiUrl('/partner-creation'), { ...partnerCreation, ebpc_id: id });
      return response.data;
    } catch (error) {
      console.error('Error updating partner creation:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(getApiUrl('/partner-creation'), {
        data: { ebpc_id: id }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting partner creation:', error);
      throw error;
    }
  }
};