import { z } from 'zod';

export const UserRoleDto = z.object({
  eurRoleNr: z.string(),
  eurRoleType: z.enum(['E', 'S', 'C']),
  eurRoleDescription: z.string(),
  eurBusDomain: z.string(),
  eurLanguage: z.string(),
  eurDeletedFlag: z.string(),
  eurComponent: z.string(),
});

export const CreateUserRoleDto = z.object({
  eurRoleNr: z.string().min(1, 'Role is required'),
  eurRoleType: z.enum(['E', 'S', 'C'], {
    required_error: 'Role type is required'
  }),
  eurRoleDescription: z.string().min(1, 'Description is required'),
  eurBusDomain: z.string().default('Sales'),
});

export const UpdateUserRoleDto = CreateUserRoleDto.partial().extend({
  eurRoleNr: z.string().min(1, 'Role is required'),
});

export const ApiResponse = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type UserRoleDto = z.infer<typeof UserRoleDto>;
export type CreateUserRoleDto = z.infer<typeof CreateUserRoleDto>;
export type UpdateUserRoleDto = z.infer<typeof UpdateUserRoleDto>;
export type ApiResponse = z.infer<typeof ApiResponse>;