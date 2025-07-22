import axios from 'axios';
import { CreateUserRoleDto, UpdateUserRoleDto, UserRoleDto, ApiResponse } from '@/lib/dto/userRole.dto';

const API_BASE_URL = 'https://ifonmbbhyreuewdcvfyt.supabase.co/functions/v1';

export const userRoleService = {
  // Get all user roles
  getAllUserRoles: async (): Promise<UserRoleDto[]> => {
    try {
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/user-roles`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch user roles');
    } catch (error) {
      console.error('Error fetching user roles:', error);
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