import { z } from 'zod';

export const siteDefaultSchema = z.object({
  eudd_key: z.string().min(1, 'Default key is required'),
  eudd_defaults_desc: z.string().min(1, 'Description is required'),
  eudd_sys_key: z.string().default('NOT'),
  eudd_lang: z.string().default('EN'),
  eudd_default_type: z.string().optional(),
  eudd_is_master: z.string().optional(),
});

export const siteDefaultCreateSchema = siteDefaultSchema.omit({});

export const siteDefaultUpdateSchema = siteDefaultSchema.partial().extend({
  eudd_key: z.string().min(1, 'Default key is required'),
});

export type SiteDefault = z.infer<typeof siteDefaultSchema>;
export type SiteDefaultCreate = z.infer<typeof siteDefaultCreateSchema>;
export type SiteDefaultUpdate = z.infer<typeof siteDefaultUpdateSchema>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}