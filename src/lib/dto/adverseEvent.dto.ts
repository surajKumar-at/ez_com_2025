
import { z } from 'zod';

// Base DTO interface matching actual database columns
export interface AdverseEventDto {
  eaei_adverse_event_id?: number;
  eaei_patient_first_name?: string;
  eaei_patient_last_name?: string;
  eaei_patient_middle_initial?: string;
  eaei_patient_dob?: string;
  eaei_age_at_vaccination_in_months?: number;
  eaei_sex?: string;
  eaei_weight_at_birth?: number;
  eaei_patient_address1?: string;
  eaei_patient_address2?: string;
  eaei_patient_city?: string;
  eaei_patient_state?: string;
  eaei_patient_zip?: string;
  eaei_patient_telno?: string;
  eaei_adverse_events_description?: string;
  eaei_adverse_event_onset?: string;
  eaei_vaccination_date?: string;
  eaei_vaccinated_at?: string;
  eaei_administered_by_name?: string;
  eaei_administered_by_address1?: string;
  eaei_administered_by_address2?: string;
  eaei_administered_by_city?: string;
  eaei_administered_by_state?: string;
  eaei_administered_by_zip?: string;
  eaei_administered_by_telno?: string;
  eaei_form_filled_by_name?: string;
  eaei_form_filled_by_occupation?: string;
  eaei_form_filled_by_address1?: string;
  eaei_form_filled_by_address2?: string;
  eaei_form_filled_by_city?: string;
  eaei_form_filled_by_state?: string;
  eaei_form_filled_by_zip?: string;
  eaei_form_filled_by_telno?: string;
  eaei_relation_to_patient?: string;
  eaei_form_completed_date?: string;
  eaei_patient_died_date?: string;
  eaei_patient_recovered?: string;
  eaei_is_emergency_room_or_dr_visit_reqd?: string;
  eaei_is_life_threat_illness?: string;
  eaei_result_permanent_disability?: string;
  eaei_result_prolong_hospitalization?: string;
  eaei_hospitalization_days?: number;
  eaei_illness_at_vaccination_time?: string;
  eaei_other_medications?: string;
  eaei_vaccine_purchased_with?: string;
  eaei_diag_tests_lab_data?: string;
  eaei_no_of_bro_and_sis?: number;
  eaei_pre_conditions?: string;
  eaei_reported_previously_to?: string;
  eaei_is_15_day_report?: string;
  eaei_report_type?: string;
  eaei_mfr_immn_proj_report_no?: number;
  eaei_mfr_immn_proj_recd_date?: string;
  eaei_date_received?: string;
  eaei_pvn_or_alternative_no?: number;
  eaei_linked_sr_id?: number;
  eaei_resp_physician?: string;
  eaei_adverse_event?: string;
  eaei_suggestions_to_cust?: string;
  eaei_assigned_to?: string;
  eaei_status?: string;
  eaei_creation_date?: string;
  eaei_changed_date?: string;
  eaei_created_by?: string;
  eaei_changed_by?: string;
}

export interface CreateAdverseEventDto extends Omit<AdverseEventDto, 'eaei_adverse_event_id' | 'eaei_creation_date' | 'eaei_changed_date'> {}

export interface UpdateAdverseEventDto extends Partial<CreateAdverseEventDto> {}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Zod validation schemas
export const adverseEventSchema = z.object({
  eaei_patient_first_name: z.string().min(1, 'Patient first name is required'),
  eaei_patient_last_name: z.string().min(1, 'Patient last name is required'),
  eaei_patient_middle_initial: z.string().optional(),
  eaei_patient_dob: z.string().optional(),
  eaei_age_at_vaccination_in_months: z.number().min(0).optional(),
  eaei_sex: z.string().optional(),
  eaei_weight_at_birth: z.number().min(0).optional(),
  eaei_patient_address1: z.string().optional(),
  eaei_patient_address2: z.string().optional(),
  eaei_patient_city: z.string().optional(),
  eaei_patient_state: z.string().optional(),
  eaei_patient_zip: z.string().optional(),
  eaei_patient_telno: z.string().optional(),
  eaei_adverse_events_description: z.string().min(1, 'Event description is required'),
  eaei_adverse_event_onset: z.string().optional(),
  eaei_vaccination_date: z.string().optional(),
  eaei_vaccinated_at: z.string().optional(),
  eaei_administered_by_name: z.string().optional(),
  eaei_form_filled_by_name: z.string().min(1, 'Reporter name is required'),
  eaei_form_filled_by_occupation: z.string().optional(),
  eaei_relation_to_patient: z.string().optional(),
  eaei_form_completed_date: z.string().optional(),
  eaei_patient_recovered: z.enum(['Yes', 'No']).optional(),
  eaei_is_emergency_room_or_dr_visit_reqd: z.enum(['Yes', 'No']).optional(),
  eaei_is_life_threat_illness: z.enum(['Yes', 'No']).optional(),
  eaei_result_permanent_disability: z.enum(['Yes', 'No']).optional(),
  eaei_result_prolong_hospitalization: z.enum(['Yes', 'No']).optional(),
  eaei_hospitalization_days: z.number().optional(),
  eaei_illness_at_vaccination_time: z.string().optional(),
  eaei_other_medications: z.string().optional(),
  eaei_vaccine_purchased_with: z.string().optional(),
  eaei_diag_tests_lab_data: z.string().optional(),
  eaei_pre_conditions: z.string().optional(),
  eaei_reported_previously_to: z.string().optional(),
  eaei_is_15_day_report: z.enum(['Yes', 'No']).optional(),
  eaei_report_type: z.string().optional(),
  eaei_assigned_to: z.string().optional(),
  eaei_status: z.enum(['Draft', 'Submitted', 'Under Review', 'Closed']).default('Draft'),
});

export const adverseEventCreateSchema = adverseEventSchema.extend({
  eaei_created_by: z.string().optional(),
});

export type AdverseEvent = z.infer<typeof adverseEventSchema>;
export type AdverseEventCreate = z.infer<typeof adverseEventCreateSchema>;
