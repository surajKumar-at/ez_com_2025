import { z } from 'zod';

export const UserDto = z.object({
  eu_id: z.string(),
  eu_email: z.string().email(),
  eu_first_name: z.string(),
  eu_last_name: z.string(),
  eu_type: z.number(), // 1: Admin, 2: Internal User/Internal User Admin, 3: Customer
  eu_business_partner: z.string().optional(),
  eu_deletion_flag: z.string(),
  eu_created_date: z.string(),
  eu_last_login_date: z.string().optional(),
  eu_last_login_time: z.string().optional(),
  supabase_user_id: z.string().optional(),
  roles: z.array(z.any()).optional(),
  permissions: z.array(z.any()).optional(),
});

export const CreateUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').default('portal'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  userType: z.number().min(1).max(3), // 1: Admin, 2: Internal User/Internal User Admin, 3: Customer
  roles: z.array(z.string()).optional().default([]),
  businessPartner: z.string().optional(),
  sysKey: z.string().default('999001'),
  soldTo: z.string().optional(),
  authKeys: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional().default([])
});

export const UpdateUserDto = CreateUserDto.partial().extend({
  eu_id: z.string().min(1, 'User ID is required'),
});

export const UserSessionDto = z.object({
  user: UserDto,
  permissions: z.array(z.object({
    auth_key: z.string(),
    auth_value: z.string()
  })),
  soldToOptions: z.array(z.object({
    customer_no: z.string(),
    customer_name: z.string(),
    sys_key: z.string()
  })).optional(),
  selectedSoldTo: z.string().optional(),
  shipToOptions: z.array(z.object({
    customer_no: z.string(),
    customer_name: z.string(),
    reference_no: z.number()
  })).optional()
});

export const LoginRequestDto = z.object({
  email: z.string().email(),
  password: z.string(),
  loginType: z.enum(['admin', 'user']).default('user')
});

export const ApiResponse = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type UserDto = z.infer<typeof UserDto>;
export type CreateUserDto = z.infer<typeof CreateUserDto>;
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
export type UserSessionDto = z.infer<typeof UserSessionDto>;
export type LoginRequestDto = z.infer<typeof LoginRequestDto>;
export type ApiResponse = z.infer<typeof ApiResponse>;