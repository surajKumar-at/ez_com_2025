import axiosInstance from '@/config/api';
import { SapBusinessPartnerRequest, SapBusinessPartnerApiResponse } from '@/lib/dto/sapBusinessPartner.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';
import { AxiosError } from 'axios';

export const sapBusinessPartnerService = {
  async getBusinessPartner(request: SapBusinessPartnerRequest): Promise<SapBusinessPartnerApiResponse | {
    success: false;
    error: string;
  }> {
    try {
      const response = await axiosInstance.post(getApiUrl(API_CONFIG.ENDPOINTS.SAP_BUSINESS_PARTNER), request);
      return response.data;
    } catch (error) {
      console.error('SAP Business Partner Service Error:', error);
      
      if (error instanceof AxiosError) {
        return {
          success: false,
          error: error.response?.data?.error || error.message,
        };
      }
      
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  },
};