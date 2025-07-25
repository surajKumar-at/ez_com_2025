import axios from 'axios';
import { SiteDefault, SiteDefaultCreate, SiteDefaultUpdate, ApiResponse } from '@/lib/dto/siteDefaults.dto';

const BASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co/functions/v1';

export const siteDefaultsService = {
  async getAll(): Promise<ApiResponse<SiteDefault[]>> {
    try {
      const response = await axios.get(`${BASE_URL}/site-defaults`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch site defaults');
    }
  },

  async getById(key: string): Promise<ApiResponse<SiteDefault>> {
    try {
      const response = await axios.get(`${BASE_URL}/site-defaults?key=${key}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch site default');
    }
  },

  async create(data: SiteDefaultCreate): Promise<ApiResponse<SiteDefault>> {
    try {
      const response = await axios.post(`${BASE_URL}/site-defaults`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create site default');
    }
  },

  async update(key: string, data: SiteDefaultUpdate): Promise<ApiResponse<SiteDefault>> {
    try {
      const response = await axios.put(`${BASE_URL}/site-defaults?key=${key}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update site default');
    }
  },

  async delete(key: string): Promise<ApiResponse<void>> {
    try {
      const response = await axios.delete(`${BASE_URL}/site-defaults?key=${key}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete site default');
    }
  },
};