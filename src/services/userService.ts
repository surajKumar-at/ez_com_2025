import axios from 'axios';
import { CreateUserDto, UpdateUserDto, UserDto, ApiResponse } from '@/lib/dto/user.dto';

const API_BASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co/functions/v1';

export const userService = {
  async getAllUsers(): Promise<UserDto[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
  },

  async createUser(userData: CreateUserDto): Promise<UserDto> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        action: 'create-user',
        ...userData
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create user');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(error.response?.data?.error || 'Failed to create user');
    }
  },

  async updateUser(userId: string, userData: UpdateUserDto): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        action: 'update-user',
        userId,
        ...userData
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update user');
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.error || 'Failed to update user');
    }
  },

  async blockUser(userId: string): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        action: 'block-user',
        userId
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to block user');
      }
    } catch (error: any) {
      console.error('Error blocking user:', error);
      throw new Error(error.response?.data?.error || 'Failed to block user');
    }
  },

  async unblockUser(userId: string): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        action: 'unblock-user',
        userId
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to unblock user');
      }
    } catch (error: any) {
      console.error('Error unblocking user:', error);
      throw new Error(error.response?.data?.error || 'Failed to unblock user');
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        action: 'delete-user',
        userId
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  },

  async migrateExistingUsers(): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        action: 'migrate-existing-users'
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error migrating users:', error);
      throw new Error(error.response?.data?.error || 'Failed to migrate users');
    }
  }
};