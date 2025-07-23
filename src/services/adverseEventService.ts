
import axios from 'axios';
import { CreateAdverseEventDto, UpdateAdverseEventDto, AdverseEventDto, ApiResponse } from '@/lib/dto/adverseEvent.dto';

const API_BASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co/functions/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlmb25tYmJoeXJldWV3ZGN2Znl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODYwMzksImV4cCI6MjA2ODE2MjAzOX0.BFHVOVIU7Fb89Wys1Mwtc2mzwiRmpGKZyyrF1o55DX0'
  };
};

export const adverseEventService = {
  // Get all adverse events
  getAllAdverseEvents: async (): Promise<AdverseEventDto[]> => {
    try {
      console.log('Fetching adverse events from:', `${API_BASE_URL}/adverse-events`);
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/adverse-events`, {
        headers: getAuthHeaders()
      });
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.error || 'Failed to fetch adverse events');
    } catch (error) {
      console.error('Error fetching adverse events:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  },

  // Create new adverse event
  createAdverseEvent: async (eventData: CreateAdverseEventDto): Promise<AdverseEventDto> => {
    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/adverse-events`, eventData, {
        headers: getAuthHeaders()
      });
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
      const response = await axios.put<ApiResponse>(
        `${API_BASE_URL}/adverse-events?id=${eventId}`,
        eventData,
        {
          headers: getAuthHeaders()
        }
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
      const response = await axios.delete<ApiResponse>(
        `${API_BASE_URL}/adverse-events?id=${eventId}`,
        {
          headers: getAuthHeaders()
        }
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
      const response = await axios.delete<ApiResponse>(
        `${API_BASE_URL}/adverse-events?ids=${eventIds.join(',')}`,
        {
          headers: getAuthHeaders()
        }
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
