import axios from 'axios';
import { SapBusinessPartnerRequest, SapBusinessPartnerResponse } from '@/lib/dto/sapBusinessPartner.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

export const sapBusinessPartnerService = {
  async getBusinessPartner(request: SapBusinessPartnerRequest): Promise<{
    success: boolean;
    data?: SapBusinessPartnerResponse;
    error?: string;
    requestData?: SapBusinessPartnerRequest;
  }> {
    try {
      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.SAP_BUSINESS_PARTNER), request);
      return response.data;
    } catch (error) {
      console.error('SAP Business Partner Service Error:', error);
      
      if (axios.isAxiosError(error)) {
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