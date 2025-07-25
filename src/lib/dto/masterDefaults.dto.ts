import { z } from 'zod';

export const masterDefaultSchema = z.object({
  eudd_key: z.string().min(1, 'Default key is required'),
  eudd_defaults_desc: z.string().min(1, 'Description is required'),
  eudd_sys_key: z.string().default('999002'),
  eudd_lang: z.string().default('EN'),
  eudd_default_type: z.string().min(1, 'Default type is required'),
  eudd_is_master: z.string().optional(),
});

export const defaultLevelOptions = [
  { value: '1', label: 'User Level' },
  { value: '2', label: 'Customer Level' },
  { value: '4', label: 'User and Customer Level' },
];

export const languageOptions = [
  { value: 'EN', label: 'English' },
  { value: 'ES', label: 'Spanish' },
  { value: 'FR', label: 'French' },
  { value: 'DE', label: 'German' },
];

export const masterDefaultCreateSchema = masterDefaultSchema.omit({});

export const masterDefaultUpdateSchema = masterDefaultSchema.partial().extend({
  eudd_key: z.string().min(1, 'Default key is required'),
});

export type MasterDefault = z.infer<typeof masterDefaultSchema>;
export type MasterDefaultCreate = z.infer<typeof masterDefaultCreateSchema>;
export type MasterDefaultUpdate = z.infer<typeof masterDefaultUpdateSchema>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}