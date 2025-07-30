
import axiosInstance from '@/config/api';
import { CreateUserRoleDto, UpdateUserRoleDto, UserRoleDto, ApiResponse } from '@/lib/dto/userRole.dto';
import { API_CONFIG, getApiUrl } from '@/config/api';
import { AxiosError } from 'axios';

export const userRoleService = {
  // Get all user roles
  getAllUserRoles: async (): Promise<UserRoleDto[]> => {
    try {
      console.log('Fetching user roles from:', getApiUrl(API_CONFIG.ENDPOINTS.USER_ROLES));
      const response = await axiosInstance.get<ApiResponse>(getApiUrl(API_CONFIG.ENDPOINTS.USER_ROLES));
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.error || 'Failed to fetch user roles');
    } catch (error) {
      console.error('Error fetching user roles:', error);
      if (error instanceof AxiosError) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  },

  // Create new user role
  createUserRole: async (roleData: CreateUserRoleDto): Promise<UserRoleDto> => {
    try {
      const response = await axiosInstance.post<ApiResponse>(getApiUrl(API_CONFIG.ENDPOINTS.USER_ROLES), roleData);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create user role');
    } catch (error) {
      console.error('Error creating user role:', error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (roleNr: string, roleData: UpdateUserRoleDto): Promise<void> => {
    try {
      const response = await axiosInstance.put<ApiResponse>(
        `${getApiUrl(API_CONFIG.ENDPOINTS.USER_ROLES)}?roleNr=${encodeURIComponent(roleNr)}`,
        roleData
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Delete user role
  deleteUserRole: async (roleNr: string): Promise<void> => {
    try {
      const response = await axiosInstance.delete<ApiResponse>(
        `${getApiUrl(API_CONFIG.ENDPOINTS.USER_ROLES)}?roleNr=${encodeURIComponent(roleNr)}`
      );
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete user role');
      }
    } catch (error) {
      console.error('Error deleting user role:', error);
      throw error;
    }
  },
};
