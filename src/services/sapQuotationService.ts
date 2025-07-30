import axiosInstance from '@/config/api';
import { SapQuotationRequestDto, SapQuotationResponseDto } from '@/lib/dto/sapQuotation.dto';

export const sapQuotationService = {
  async getQuotations(request: SapQuotationRequestDto, edgeFunctionUrl: string): Promise<SapQuotationResponseDto> {
    try {
      const response = await axiosInstance.post(edgeFunctionUrl, request);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching SAP quotations:', error);
      throw error;
    }
  }
};