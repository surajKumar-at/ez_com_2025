import axios from 'axios';
import { SiteDefault, SiteDefaultCreate, SiteDefaultUpdate, ApiResponse } from '@/lib/dto/siteDefaults.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';

export const siteDefaultsService = {
  async getAll(): Promise<ApiResponse<SiteDefault[]>> {
    try {
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.SITE_DEFAULTS));
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch site defaults');
    }
  },

  async getById(key: string): Promise<ApiResponse<SiteDefault>> {
    try {
      const response = await axios.get(`${getApiUrl(API_CONFIG.ENDPOINTS.SITE_DEFAULTS)}?key=${key}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch site default');
    }
  },

  async create(data: SiteDefaultCreate): Promise<ApiResponse<SiteDefault>> {
    try {
      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.SITE_DEFAULTS), data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create site default');
    }
  },

  async update(key: string, data: SiteDefaultUpdate): Promise<ApiResponse<SiteDefault>> {
    try {
      const response = await axios.put(`${getApiUrl(API_CONFIG.ENDPOINTS.SITE_DEFAULTS)}?key=${key}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update site default');
    }
  },

  async delete(key: string): Promise<ApiResponse<void>> {
    try {
      const response = await axios.delete(`${getApiUrl(API_CONFIG.ENDPOINTS.SITE_DEFAULTS)}?key=${key}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete site default');
    }
  },
};