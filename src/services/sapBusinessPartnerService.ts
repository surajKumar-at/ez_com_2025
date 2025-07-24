import axios from 'axios';
import { SapBusinessPartnerRequest, SapBusinessPartnerResponse } from '@/lib/dto/sapBusinessPartner.dto';

const API_BASE_URL = '/api';

export const sapBusinessPartnerService = {
  async getBusinessPartner(request: SapBusinessPartnerRequest): Promise<{
    success: boolean;
    data?: SapBusinessPartnerResponse;
    error?: string;
    requestData?: SapBusinessPartnerRequest;
  }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/sap-business-partner`, request);
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