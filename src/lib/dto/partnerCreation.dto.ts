import { z } from 'zod';

const basePartnerCreationSchema = z.object({
  ebpc_company_name: z.string().min(1, 'Company name is required'),
  ebpc_description: z.string().optional(),
  ebpc_catalog_no: z.string().min(1, 'Catalog is required'),
  ebpc_unlimited_users: z.boolean().default(false),
  ebpc_number_of_users: z.number().int().min(1).optional(),
  ebpc_intranet_business_partner: z.boolean().default(false),
  ebpc_is_serves_partner: z.boolean().optional(),
});

export const partnerCreationSchema = basePartnerCreationSchema.refine((data) => {
  // Ensure only one of unlimited_users or number_of_users is set
  if (data.ebpc_unlimited_users && data.ebpc_number_of_users) {
    return false;
  }
  if (!data.ebpc_unlimited_users && !data.ebpc_number_of_users) {
    return false;
  }
  return true;
}, {
  message: "Either unlimited users or specific number of users must be selected, not both",
  path: ["ebpc_unlimited_users"]
});

export const partnerCreationCreateSchema = basePartnerCreationSchema.extend({
  ebpc_created_by: z.string().optional(),
});

export const partnerCreationUpdateSchema = basePartnerCreationSchema.partial().extend({
  ebpc_id: z.number().int().positive(),
});

export const catalogOptionSchema = z.object({
  ecg_catalog_no: z.string(),
  ecg_sys_key: z.string(),
  ecg_product_group: z.string(),
});

export type PartnerCreation = z.infer<typeof partnerCreationSchema>;
export type PartnerCreationCreate = z.infer<typeof partnerCreationCreateSchema>;
export type PartnerCreationUpdate = z.infer<typeof partnerCreationUpdateSchema>;
export type CatalogOption = z.infer<typeof catalogOptionSchema>;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}