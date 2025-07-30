import axiosInstance from '@/config/api';
import { CreateSalesAreaDto, SalesArea, SalesAreaResponse } from '@/lib/dto/salesArea.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

export const salesAreaService = {
  getSalesAreas: async (): Promise<SalesArea[]> => {
    try {
    const response = await axiosInstance.get<SalesAreaResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SALES_AREAS));
      
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch sales areas');
    } catch (error) {
      console.error('Error fetching sales areas:', error);
      throw error;
    }
  },

  createSalesArea: async (salesAreaData: CreateSalesAreaDto): Promise<SalesArea> => {
    try {
      const response = await axiosInstance.post<SalesAreaResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SALES_AREAS), salesAreaData);
      
      if (response.data.success && response.data.data) {
        return response.data.data as SalesArea;
      }
      throw new Error(response.data.error || 'Failed to create sales area');
    } catch (error) {
      console.error('Error creating sales area:', error);
      throw error;
    }
  },

  updateSalesArea: async (salesAreaData: CreateSalesAreaDto & { eskd_sys_no: number }): Promise<SalesArea> => {
    try {
      const response = await axiosInstance.put<SalesAreaResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SALES_AREAS), salesAreaData);
      
      if (response.data.success && response.data.data) {
        return response.data.data as SalesArea;
      }
      throw new Error(response.data.error || 'Failed to update sales area');
    } catch (error) {
      console.error('Error updating sales area:', error);
      throw error;
    }
  }
};