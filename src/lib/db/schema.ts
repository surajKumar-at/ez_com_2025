import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';

// EZC_USER_ROLES table schema
export const ezcUserRoles = pgTable('ezc_user_roles', {
  eurRoleNr: varchar('eur_role_nr'),
  eurRoleType: varchar('eur_role_type'),
  eurLanguage: varchar('eur_language'),
  eurRoleDescription: varchar('eur_role_description'),
  eurDeletedFlag: varchar('eur_deleted_flag'),
  eurComponent: varchar('eur_component'),
  eurBusDomain: varchar('eur_bus_domain'),
});

// Zod validation schemas
export const userRoleSchema = z.object({
  eurRoleNr: z.string().min(1, 'Role is required'),
  eurRoleType: z.enum(['E', 'S', 'C'], {
    required_error: 'Role type is required'
  }),
  eurRoleDescription: z.string().min(1, 'Description is required'),
  eurBusDomain: z.string().default('Sales'),
});

export const userRoleCreateSchema = userRoleSchema.extend({
  eurLanguage: z.string().default('EN'),
  eurDeletedFlag: z.string().default(''),
  eurComponent: z.string().default('ROLE'),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserRoleCreate = z.infer<typeof userRoleCreateSchema>;