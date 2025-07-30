
import axiosInstance from '@/config/api';
import { CreateAdverseEventDto, UpdateAdverseEventDto, AdverseEventDto, ApiResponse } from '@/lib/dto/adverseEvent.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';
import { AxiosError } from 'axios';

export const adverseEventService = {
  // Get all adverse events
  getAllAdverseEvents: async (): Promise<AdverseEventDto[]> => {
    try {
      console.log('Fetching adverse events from:', getApiUrl(API_CONFIG.ENDPOINTS.ADVERSE_EVENTS));
      const response = await axiosInstance.get<ApiResponse>(getApiUrl(API_CONFIG.ENDPOINTS.ADVERSE_EVENTS));
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.error || 'Failed to fetch adverse events');
    } catch (error) {
      console.error('Error fetching adverse events:', error);
      if (error instanceof AxiosError) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  },

  // Create new adverse event
  createAdverseEvent: async (eventData: CreateAdverseEventDto): Promise<AdverseEventDto> => {
    try {
      const response = await axiosInstance.post<ApiResponse>(getApiUrl(API_CONFIG.ENDPOINTS.ADVERSE_EVENTS), eventData);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create adverse event');
    } catch (error) {
      console.error('Error creating adverse event:', error);
      throw error;
    }
  },

  // Update adverse event
  updateAdverseEvent: async (eventId: number, eventData: UpdateAdverseEventDto): Promise<void> => {
    try {
      const response = await axiosInstance.put<ApiResponse>(
        `${getApiUrl(API_CONFIG.ENDPOINTS.ADVERSE_EVENTS)}?id=${eventId}`,
        eventData
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update adverse event');
      }
    } catch (error) {
      console.error('Error updating adverse event:', error);
      throw error;
    }
  },

  // Delete adverse event
  deleteAdverseEvent: async (eventId: number): Promise<void> => {
    try {
      const response = await axiosInstance.delete<ApiResponse>(
        `${getApiUrl(API_CONFIG.ENDPOINTS.ADVERSE_EVENTS)}?id=${eventId}`
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete adverse event');
      }
    } catch (error) {
      console.error('Error deleting adverse event:', error);
      throw error;
    }
  },

  // Delete multiple adverse events
  deleteMultipleAdverseEvents: async (eventIds: number[]): Promise<void> => {
    try {
      const response = await axiosInstance.delete<ApiResponse>(
        `${getApiUrl(API_CONFIG.ENDPOINTS.ADVERSE_EVENTS)}?ids=${eventIds.join(',')}`
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete adverse events');
      }
    } catch (error) {
      console.error('Error deleting adverse events:', error);
      throw error;
    }
  },
};
