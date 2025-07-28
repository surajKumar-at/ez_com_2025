import axios from 'axios';
import { CreateSalesAreaDto, SalesArea, SalesAreaResponse } from '@/lib/dto/salesArea.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const salesAreaService = {
  getSalesAreas: async (): Promise<SalesArea[]> => {
    try {
      const response = await axios.get<SalesAreaResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SALES_AREAS), {
        headers: getAuthHeaders()
      });
      
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
      const response = await axios.post<SalesAreaResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SALES_AREAS), salesAreaData, {
        headers: getAuthHeaders()
      });
      
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
      const response = await axios.put<SalesAreaResponse>(getApiUrl(API_CONFIG.ENDPOINTS.SALES_AREAS), salesAreaData, {
        headers: getAuthHeaders()
      });
      
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