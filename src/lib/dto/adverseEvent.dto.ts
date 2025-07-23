
import { z } from 'zod';

// Base DTO interface
export interface AdverseEventDto {
  eaei_id?: number;
  eaei_created_on?: string;
  eaei_modified_on?: string;
  eaei_patient_fname?: string;
  eaei_patient_lname?: string;
  eaei_patient_mname?: string;
  eaei_patient_dob?: string;
  eaei_patient_age?: number;
  eaei_patient_gender?: string;
  eaei_patient_weight?: number;
  eaei_patient_height?: number;
  eaei_patient_medical_record_no?: string;
  eaei_event_description?: string;
  eaei_event_date?: string;
  eaei_event_time?: string;
  eaei_event_location?: string;
  eaei_event_severity?: string;
  eaei_event_outcome?: string;
  eaei_reporter_name?: string;
  eaei_reporter_title?: string;
  eaei_reporter_contact?: string;
  eaei_device_name?: string;
  eaei_device_model?: string;
  eaei_device_serial?: string;
  eaei_device_lot?: string;
  eaei_medication_name?: string;
  eaei_medication_dose?: string;
  eaei_medication_route?: string;
  eaei_medication_frequency?: string;
  eaei_concomitant_meds?: string;
  eaei_medical_history?: string;
  eaei_lab_values?: string;
  eaei_actions_taken?: string;
  eaei_followup_required?: string;
  eaei_report_to_fda?: string;
  eaei_report_to_manufacturer?: string;
  eaei_status?: string;
  eaei_assigned_to?: string;
  eaei_priority?: string;
  eaei_created_by?: string;
  eaei_modified_by?: string;
}

export interface CreateAdverseEventDto extends Omit<AdverseEventDto, 'eaei_id' | 'eaei_created_on' | 'eaei_modified_on'> {}

export interface UpdateAdverseEventDto extends Partial<CreateAdverseEventDto> {}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Zod validation schemas
export const adverseEventSchema = z.object({
  eaei_patient_fname: z.string().min(1, 'Patient first name is required'),
  eaei_patient_lname: z.string().min(1, 'Patient last name is required'),
  eaei_patient_mname: z.string().optional(),
  eaei_patient_dob: z.string().optional(),
  eaei_patient_age: z.number().min(0).optional(),
  eaei_patient_gender: z.string().optional(),
  eaei_patient_weight: z.number().min(0).optional(),
  eaei_patient_height: z.number().min(0).optional(),
  eaei_patient_medical_record_no: z.string().optional(),
  eaei_event_description: z.string().min(1, 'Event description is required'),
  eaei_event_date: z.string().optional(),
  eaei_event_time: z.string().optional(),
  eaei_event_location: z.string().optional(),
  eaei_event_severity: z.enum(['Mild', 'Moderate', 'Severe', 'Life-threatening']).optional(),
  eaei_event_outcome: z.string().optional(),
  eaei_reporter_name: z.string().min(1, 'Reporter name is required'),
  eaei_reporter_title: z.string().optional(),
  eaei_reporter_contact: z.string().optional(),
  eaei_device_name: z.string().optional(),
  eaei_device_model: z.string().optional(),
  eaei_device_serial: z.string().optional(),
  eaei_device_lot: z.string().optional(),
  eaei_medication_name: z.string().optional(),
  eaei_medication_dose: z.string().optional(),
  eaei_medication_route: z.string().optional(),
  eaei_medication_frequency: z.string().optional(),
  eaei_concomitant_meds: z.string().optional(),
  eaei_medical_history: z.string().optional(),
  eaei_lab_values: z.string().optional(),
  eaei_actions_taken: z.string().optional(),
  eaei_followup_required: z.enum(['Yes', 'No']).optional(),
  eaei_report_to_fda: z.enum(['Yes', 'No']).optional(),
  eaei_report_to_manufacturer: z.enum(['Yes', 'No']).optional(),
  eaei_status: z.enum(['Draft', 'Submitted', 'Under Review', 'Closed']).default('Draft'),
  eaei_assigned_to: z.string().optional(),
  eaei_priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
});

export const adverseEventCreateSchema = adverseEventSchema.extend({
  eaei_created_by: z.string().optional(),
});

export type AdverseEvent = z.infer<typeof adverseEventSchema>;
export type AdverseEventCreate = z.infer<typeof adverseEventCreateSchema>;
