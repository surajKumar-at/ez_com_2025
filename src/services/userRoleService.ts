
import axios from 'axios';
import { CreateUserRoleDto, UpdateUserRoleDto, UserRoleDto, ApiResponse } from '@/lib/dto/userRole.dto';

const API_BASE_URL = '/api';

export const userRoleService = {
  // Get all user roles
  getAllUserRoles: async (): Promise<UserRoleDto[]> => {
    try {
      console.log('Fetching user roles from:', `${API_BASE_URL}/user-roles`);
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/user-roles`);
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.error || 'Failed to fetch user roles');
    } catch (error) {
      console.error('Error fetching user roles:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  },

  // Create new user role
  createUserRole: async (roleData: CreateUserRoleDto): Promise<UserRoleDto> => {
    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/user-roles`, roleData);
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
      const response = await axios.put<ApiResponse>(
        `${API_BASE_URL}/user-roles?roleNr=${encodeURIComponent(roleNr)}`,
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
      const response = await axios.delete<ApiResponse>(
        `${API_BASE_URL}/user-roles?roleNr=${encodeURIComponent(roleNr)}`
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
