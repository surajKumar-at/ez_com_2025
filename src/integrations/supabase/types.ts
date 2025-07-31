export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      df001_orders: {
        Row: {
          address1: string | null
          address2: string | null
          address3: string | null
          address4: string | null
          city: string | null
          company_id: string | null
          country: string | null
          customer_account_no: string | null
          customer_id: string | null
          customer_name: string | null
          DATE: string | null
          dea_license_no: string | null
          division_id: string | null
          id: number
          insert_date: string | null
          order_id: string | null
          po_number: string | null
          postal_code: string | null
          reference: string | null
          ship_to_id: string | null
          state: string | null
          status: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          address3?: string | null
          address4?: string | null
          city?: string | null
          company_id?: string | null
          country?: string | null
          customer_account_no?: string | null
          customer_id?: string | null
          customer_name?: string | null
          DATE?: string | null
          dea_license_no?: string | null
          division_id?: string | null
          id: number
          insert_date?: string | null
          order_id?: string | null
          po_number?: string | null
          postal_code?: string | null
          reference?: string | null
          ship_to_id?: string | null
          state?: string | null
          status?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          address3?: string | null
          address4?: string | null
          city?: string | null
          company_id?: string | null
          country?: string | null
          customer_account_no?: string | null
          customer_id?: string | null
          customer_name?: string | null
          DATE?: string | null
          dea_license_no?: string | null
          division_id?: string | null
          id?: number
          insert_date?: string | null
          order_id?: string | null
          po_number?: string | null
          postal_code?: string | null
          reference?: string | null
          ship_to_id?: string | null
          state?: string | null
          status?: string | null
        }
        Relationships: []
      }
      df002_order_details: {
        Row: {
          active_ingredient_qty: number | null
          active_ingredient_uom: string | null
          analysed_qty: number
          controlled_substance: string | null
          customer_item_number: string | null
          df001_id: number
          id: number
          item_description: string | null
          item_family_id: string | null
          item_id: string | null
          line_no: number | null
          no_of_bottles: number | null
          no_of_cases: number | null
          no_of_tablets: number | null
          order_id: string | null
          ordered_qty: number | null
          price: unknown | null
          shipped_qty: number | null
        }
        Insert: {
          active_ingredient_qty?: number | null
          active_ingredient_uom?: string | null
          analysed_qty: number
          controlled_substance?: string | null
          customer_item_number?: string | null
          df001_id: number
          id: number
          item_description?: string | null
          item_family_id?: string | null
          item_id?: string | null
          line_no?: number | null
          no_of_bottles?: number | null
          no_of_cases?: number | null
          no_of_tablets?: number | null
          order_id?: string | null
          ordered_qty?: number | null
          price?: unknown | null
          shipped_qty?: number | null
        }
        Update: {
          active_ingredient_qty?: number | null
          active_ingredient_uom?: string | null
          analysed_qty?: number
          controlled_substance?: string | null
          customer_item_number?: string | null
          df001_id?: number
          id?: number
          item_description?: string | null
          item_family_id?: string | null
          item_id?: string | null
          line_no?: number | null
          no_of_bottles?: number | null
          no_of_cases?: number | null
          no_of_tablets?: number | null
          order_id?: string | null
          ordered_qty?: number | null
          price?: unknown | null
          shipped_qty?: number | null
        }
        Relationships: []
      }
      doc_details: {
        Row: {
          agent_code: string | null
          back_end_item: string | null
          back_end_order: string | null
          backend_orno: string | null
          batch_no: string | null
          class2: string | null
          collect_no: string | null
          commit_price: number | null
          commited_qty: number | null
          create_userid: string | null
          creation_date: string
          currency: string | null
          customer_mat: string | null
          desired_price: number | null
          desired_qty: number | null
          discount_cash: number | null
          discount_percentage: number | null
          distr_chan: string | null
          division: string | null
          doc_currency: string | null
          esdh_cust_grp5: string | null
          esdh_ref_1: string | null
          esdh_req_date_h: string | null
          esdi_notes: string | null
          foc: number | null
          freight: string | null
          inco_terms1: string | null
          inco_terms2: string | null
          incoterms1: string | null
          incoterms2: string | null
          invoice: string | null
          item_category: string | null
          item_net_value: number | null
          l_ship_to: string | null
          last_mod_date: string | null
          material_group: string | null
          mod_id: string | null
          net_value: number | null
          ord_reason: string | null
          order_date: string | null
          payment_terms: string | null
          plant: string | null
          po_no: string | null
          prod_code: string | null
          prod_desc: string | null
          promise_full_date: string | null
          purch_date: string | null
          ref_doc_item: number | null
          ref_doc_no: string | null
          ref_doc_nr: string | null
          ref_doc_type: string | null
          req_date: string | null
          res1: string | null
          res2: string | null
          sales_area_code: string | null
          sales_org: string | null
          ship_to_code: string | null
          shto_addr1: string | null
          so_line_no: number | null
          sold_to_code: string | null
          soto_addr1: string | null
          status: string | null
          status_date: string | null
          sys_key: string | null
          text1: string | null
          text2: string | null
          text3: string | null
          text4: string | null
          transfer_date: string | null
          uom: string | null
          uom_qty: number | null
          web_orno: string | null
        }
        Insert: {
          agent_code?: string | null
          back_end_item?: string | null
          back_end_order?: string | null
          backend_orno?: string | null
          batch_no?: string | null
          class2?: string | null
          collect_no?: string | null
          commit_price?: number | null
          commited_qty?: number | null
          create_userid?: string | null
          creation_date: string
          currency?: string | null
          customer_mat?: string | null
          desired_price?: number | null
          desired_qty?: number | null
          discount_cash?: number | null
          discount_percentage?: number | null
          distr_chan?: string | null
          division?: string | null
          doc_currency?: string | null
          esdh_cust_grp5?: string | null
          esdh_ref_1?: string | null
          esdh_req_date_h?: string | null
          esdi_notes?: string | null
          foc?: number | null
          freight?: string | null
          inco_terms1?: string | null
          inco_terms2?: string | null
          incoterms1?: string | null
          incoterms2?: string | null
          invoice?: string | null
          item_category?: string | null
          item_net_value?: number | null
          l_ship_to?: string | null
          last_mod_date?: string | null
          material_group?: string | null
          mod_id?: string | null
          net_value?: number | null
          ord_reason?: string | null
          order_date?: string | null
          payment_terms?: string | null
          plant?: string | null
          po_no?: string | null
          prod_code?: string | null
          prod_desc?: string | null
          promise_full_date?: string | null
          purch_date?: string | null
          ref_doc_item?: number | null
          ref_doc_no?: string | null
          ref_doc_nr?: string | null
          ref_doc_type?: string | null
          req_date?: string | null
          res1?: string | null
          res2?: string | null
          sales_area_code?: string | null
          sales_org?: string | null
          ship_to_code?: string | null
          shto_addr1?: string | null
          so_line_no?: number | null
          sold_to_code?: string | null
          soto_addr1?: string | null
          status?: string | null
          status_date?: string | null
          sys_key?: string | null
          text1?: string | null
          text2?: string | null
          text3?: string | null
          text4?: string | null
          transfer_date?: string | null
          uom?: string | null
          uom_qty?: number | null
          web_orno?: string | null
        }
        Update: {
          agent_code?: string | null
          back_end_item?: string | null
          back_end_order?: string | null
          backend_orno?: string | null
          batch_no?: string | null
          class2?: string | null
          collect_no?: string | null
          commit_price?: number | null
          commited_qty?: number | null
          create_userid?: string | null
          creation_date?: string
          currency?: string | null
          customer_mat?: string | null
          desired_price?: number | null
          desired_qty?: number | null
          discount_cash?: number | null
          discount_percentage?: number | null
          distr_chan?: string | null
          division?: string | null
          doc_currency?: string | null
          esdh_cust_grp5?: string | null
          esdh_ref_1?: string | null
          esdh_req_date_h?: string | null
          esdi_notes?: string | null
          foc?: number | null
          freight?: string | null
          inco_terms1?: string | null
          inco_terms2?: string | null
          incoterms1?: string | null
          incoterms2?: string | null
          invoice?: string | null
          item_category?: string | null
          item_net_value?: number | null
          l_ship_to?: string | null
          last_mod_date?: string | null
          material_group?: string | null
          mod_id?: string | null
          net_value?: number | null
          ord_reason?: string | null
          order_date?: string | null
          payment_terms?: string | null
          plant?: string | null
          po_no?: string | null
          prod_code?: string | null
          prod_desc?: string | null
          promise_full_date?: string | null
          purch_date?: string | null
          ref_doc_item?: number | null
          ref_doc_no?: string | null
          ref_doc_nr?: string | null
          ref_doc_type?: string | null
          req_date?: string | null
          res1?: string | null
          res2?: string | null
          sales_area_code?: string | null
          sales_org?: string | null
          ship_to_code?: string | null
          shto_addr1?: string | null
          so_line_no?: number | null
          sold_to_code?: string | null
          soto_addr1?: string | null
          status?: string | null
          status_date?: string | null
          sys_key?: string | null
          text1?: string | null
          text2?: string | null
          text3?: string | null
          text4?: string | null
          transfer_date?: string | null
          uom?: string | null
          uom_qty?: number | null
          web_orno?: string | null
        }
        Relationships: []
      }
      dual: {
        Row: {
          flag: string | null
        }
        Insert: {
          flag?: string | null
        }
        Update: {
          flag?: string | null
        }
        Relationships: []
      }
      ezc_access_request_dtls: {
        Row: {
          eard_company_name: string | null
          eard_created_on: string | null
          eard_email_address: string | null
          eard_modified_on: string | null
          eard_phone_number: string | null
          eard_request_id: number
          eard_role_dept: string | null
          eard_sold_to: string | null
          eard_status: string | null
          eard_user_name: string | null
          eard_vendor_no: string | null
          eart_ext1: string | null
          eart_ext2: string | null
        }
        Insert: {
          eard_company_name?: string | null
          eard_created_on?: string | null
          eard_email_address?: string | null
          eard_modified_on?: string | null
          eard_phone_number?: string | null
          eard_request_id: number
          eard_role_dept?: string | null
          eard_sold_to?: string | null
          eard_status?: string | null
          eard_user_name?: string | null
          eard_vendor_no?: string | null
          eart_ext1?: string | null
          eart_ext2?: string | null
        }
        Update: {
          eard_company_name?: string | null
          eard_created_on?: string | null
          eard_email_address?: string | null
          eard_modified_on?: string | null
          eard_phone_number?: string | null
          eard_request_id?: number
          eard_role_dept?: string | null
          eard_sold_to?: string | null
          eard_status?: string | null
          eard_user_name?: string | null
          eard_vendor_no?: string | null
          eart_ext1?: string | null
          eart_ext2?: string | null
        }
        Relationships: []
      }
      ezc_act_stat_by_auth: {
        Row: {
          easba_action: number | null
          easba_auth_key: string | null
          easba_result_status: number | null
        }
        Insert: {
          easba_action?: number | null
          easba_auth_key?: string | null
          easba_result_status?: number | null
        }
        Update: {
          easba_action?: number | null
          easba_auth_key?: string | null
          easba_result_status?: number | null
        }
        Relationships: []
      }
      ezc_address: {
        Row: {
          ea_addr_1: string | null
          ea_addr_2: string | null
          ea_addr_3: string | null
          ea_address_code: string | null
          ea_city: string | null
          ea_contact_person: string | null
          ea_country: string | null
          ea_district: string | null
          ea_email: string | null
          ea_fax: string | null
          ea_phone: string | null
          ea_pin: string | null
          ea_postal_code: string | null
          ea_state: string | null
          ea_street: string | null
          ea_tel1: string | null
          ea_tel2: string | null
        }
        Insert: {
          ea_addr_1?: string | null
          ea_addr_2?: string | null
          ea_addr_3?: string | null
          ea_address_code?: string | null
          ea_city?: string | null
          ea_contact_person?: string | null
          ea_country?: string | null
          ea_district?: string | null
          ea_email?: string | null
          ea_fax?: string | null
          ea_phone?: string | null
          ea_pin?: string | null
          ea_postal_code?: string | null
          ea_state?: string | null
          ea_street?: string | null
          ea_tel1?: string | null
          ea_tel2?: string | null
        }
        Update: {
          ea_addr_1?: string | null
          ea_addr_2?: string | null
          ea_addr_3?: string | null
          ea_address_code?: string | null
          ea_city?: string | null
          ea_contact_person?: string | null
          ea_country?: string | null
          ea_district?: string | null
          ea_email?: string | null
          ea_fax?: string | null
          ea_phone?: string | null
          ea_pin?: string | null
          ea_postal_code?: string | null
          ea_state?: string | null
          ea_street?: string | null
          ea_tel1?: string | null
          ea_tel2?: string | null
        }
        Relationships: []
      }
      ezc_address_info: {
        Row: {
          ea_address1: string | null
          ea_address2: string | null
          ea_bus_domain: string | null
          ea_city: string | null
          ea_company_name: string | null
          ea_country: string | null
          ea_district: string | null
          ea_email: string | null
          ea_ext1: string | null
          ea_ext2: string | null
          ea_ext3: string | null
          ea_fax: string | null
          ea_lang: string | null
          ea_mobile: string | null
          ea_no: number | null
          ea_phone1: string | null
          ea_phone2: string | null
          ea_state: string | null
          ea_type: string | null
          ea_url: string | null
          ea_zipcode: string | null
        }
        Insert: {
          ea_address1?: string | null
          ea_address2?: string | null
          ea_bus_domain?: string | null
          ea_city?: string | null
          ea_company_name?: string | null
          ea_country?: string | null
          ea_district?: string | null
          ea_email?: string | null
          ea_ext1?: string | null
          ea_ext2?: string | null
          ea_ext3?: string | null
          ea_fax?: string | null
          ea_lang?: string | null
          ea_mobile?: string | null
          ea_no?: number | null
          ea_phone1?: string | null
          ea_phone2?: string | null
          ea_state?: string | null
          ea_type?: string | null
          ea_url?: string | null
          ea_zipcode?: string | null
        }
        Update: {
          ea_address1?: string | null
          ea_address2?: string | null
          ea_bus_domain?: string | null
          ea_city?: string | null
          ea_company_name?: string | null
          ea_country?: string | null
          ea_district?: string | null
          ea_email?: string | null
          ea_ext1?: string | null
          ea_ext2?: string | null
          ea_ext3?: string | null
          ea_fax?: string | null
          ea_lang?: string | null
          ea_mobile?: string | null
          ea_no?: number | null
          ea_phone1?: string | null
          ea_phone2?: string | null
          ea_state?: string | null
          ea_type?: string | null
          ea_url?: string | null
          ea_zipcode?: string | null
        }
        Relationships: []
      }
      ezc_adverse_event_info: {
        Row: {
          eaei_administered_by_address1: string | null
          eaei_administered_by_address2: string | null
          eaei_administered_by_city: string | null
          eaei_administered_by_name: string | null
          eaei_administered_by_state: string | null
          eaei_administered_by_telno: string | null
          eaei_administered_by_zip: string | null
          eaei_administered_country: string | null
          eaei_administered_state: string | null
          eaei_adverse_event: string | null
          eaei_adverse_event_id: number | null
          eaei_adverse_event_onset: string | null
          eaei_adverse_events_description: string | null
          eaei_age_at_vaccination_in_months: number | null
          eaei_assigned_to: string | null
          eaei_changed_by: string | null
          eaei_changed_date: string | null
          eaei_created_by: string | null
          eaei_creation_date: string | null
          eaei_date_received: string | null
          eaei_diag_tests_lab_data: string | null
          eaei_dob: string | null
          eaei_form_completed_date: string | null
          eaei_form_filled_by_address1: string | null
          eaei_form_filled_by_address2: string | null
          eaei_form_filled_by_city: string | null
          eaei_form_filled_by_name: string | null
          eaei_form_filled_by_occupation: string | null
          eaei_form_filled_by_state: string | null
          eaei_form_filled_by_telno: string | null
          eaei_form_filled_by_zip: string | null
          eaei_hospitalization_days: number | null
          eaei_illness_at_vaccination_time: string | null
          eaei_is_15_day_report: string | null
          eaei_is_emergency_room_or_dr_visit_reqd: string | null
          eaei_is_life_threat_illness: string | null
          eaei_linked_sr_id: number | null
          eaei_mfr_immn_proj_recd_date: string | null
          eaei_mfr_immn_proj_report_no: number | null
          eaei_no_of_bro_and_sis: number | null
          eaei_other_medications: string | null
          eaei_patient_address1: string | null
          eaei_patient_address2: string | null
          eaei_patient_city: string | null
          eaei_patient_died_date: string | null
          eaei_patient_first_name: string | null
          eaei_patient_last_name: string | null
          eaei_patient_middle_initial: string | null
          eaei_patient_recovered: string | null
          eaei_patient_state: string | null
          eaei_patient_telno: string | null
          eaei_patient_zip: string | null
          eaei_pre_conditions: string | null
          eaei_pvn_or_alternative_no: number | null
          eaei_relation_to_patient: string | null
          eaei_report_type: string | null
          eaei_reported_previously_to: string | null
          eaei_resp_physician: string | null
          eaei_result_permanent_disability: string | null
          eaei_result_prolong_hospitalization: string | null
          eaei_sex: string | null
          eaei_status: string | null
          eaei_suggestions_to_cust: string | null
          eaei_vaccinated_at: string | null
          eaei_vaccination_date: string | null
          eaei_vaccine_purchased_with: string | null
          eaei_weight_at_birth: number | null
        }
        Insert: {
          eaei_administered_by_address1?: string | null
          eaei_administered_by_address2?: string | null
          eaei_administered_by_city?: string | null
          eaei_administered_by_name?: string | null
          eaei_administered_by_state?: string | null
          eaei_administered_by_telno?: string | null
          eaei_administered_by_zip?: string | null
          eaei_administered_country?: string | null
          eaei_administered_state?: string | null
          eaei_adverse_event?: string | null
          eaei_adverse_event_id?: number | null
          eaei_adverse_event_onset?: string | null
          eaei_adverse_events_description?: string | null
          eaei_age_at_vaccination_in_months?: number | null
          eaei_assigned_to?: string | null
          eaei_changed_by?: string | null
          eaei_changed_date?: string | null
          eaei_created_by?: string | null
          eaei_creation_date?: string | null
          eaei_date_received?: string | null
          eaei_diag_tests_lab_data?: string | null
          eaei_dob?: string | null
          eaei_form_completed_date?: string | null
          eaei_form_filled_by_address1?: string | null
          eaei_form_filled_by_address2?: string | null
          eaei_form_filled_by_city?: string | null
          eaei_form_filled_by_name?: string | null
          eaei_form_filled_by_occupation?: string | null
          eaei_form_filled_by_state?: string | null
          eaei_form_filled_by_telno?: string | null
          eaei_form_filled_by_zip?: string | null
          eaei_hospitalization_days?: number | null
          eaei_illness_at_vaccination_time?: string | null
          eaei_is_15_day_report?: string | null
          eaei_is_emergency_room_or_dr_visit_reqd?: string | null
          eaei_is_life_threat_illness?: string | null
          eaei_linked_sr_id?: number | null
          eaei_mfr_immn_proj_recd_date?: string | null
          eaei_mfr_immn_proj_report_no?: number | null
          eaei_no_of_bro_and_sis?: number | null
          eaei_other_medications?: string | null
          eaei_patient_address1?: string | null
          eaei_patient_address2?: string | null
          eaei_patient_city?: string | null
          eaei_patient_died_date?: string | null
          eaei_patient_first_name?: string | null
          eaei_patient_last_name?: string | null
          eaei_patient_middle_initial?: string | null
          eaei_patient_recovered?: string | null
          eaei_patient_state?: string | null
          eaei_patient_telno?: string | null
          eaei_patient_zip?: string | null
          eaei_pre_conditions?: string | null
          eaei_pvn_or_alternative_no?: number | null
          eaei_relation_to_patient?: string | null
          eaei_report_type?: string | null
          eaei_reported_previously_to?: string | null
          eaei_resp_physician?: string | null
          eaei_result_permanent_disability?: string | null
          eaei_result_prolong_hospitalization?: string | null
          eaei_sex?: string | null
          eaei_status?: string | null
          eaei_suggestions_to_cust?: string | null
          eaei_vaccinated_at?: string | null
          eaei_vaccination_date?: string | null
          eaei_vaccine_purchased_with?: string | null
          eaei_weight_at_birth?: number | null
        }
        Update: {
          eaei_administered_by_address1?: string | null
          eaei_administered_by_address2?: string | null
          eaei_administered_by_city?: string | null
          eaei_administered_by_name?: string | null
          eaei_administered_by_state?: string | null
          eaei_administered_by_telno?: string | null
          eaei_administered_by_zip?: string | null
          eaei_administered_country?: string | null
          eaei_administered_state?: string | null
          eaei_adverse_event?: string | null
          eaei_adverse_event_id?: number | null
          eaei_adverse_event_onset?: string | null
          eaei_adverse_events_description?: string | null
          eaei_age_at_vaccination_in_months?: number | null
          eaei_assigned_to?: string | null
          eaei_changed_by?: string | null
          eaei_changed_date?: string | null
          eaei_created_by?: string | null
          eaei_creation_date?: string | null
          eaei_date_received?: string | null
          eaei_diag_tests_lab_data?: string | null
          eaei_dob?: string | null
          eaei_form_completed_date?: string | null
          eaei_form_filled_by_address1?: string | null
          eaei_form_filled_by_address2?: string | null
          eaei_form_filled_by_city?: string | null
          eaei_form_filled_by_name?: string | null
          eaei_form_filled_by_occupation?: string | null
          eaei_form_filled_by_state?: string | null
          eaei_form_filled_by_telno?: string | null
          eaei_form_filled_by_zip?: string | null
          eaei_hospitalization_days?: number | null
          eaei_illness_at_vaccination_time?: string | null
          eaei_is_15_day_report?: string | null
          eaei_is_emergency_room_or_dr_visit_reqd?: string | null
          eaei_is_life_threat_illness?: string | null
          eaei_linked_sr_id?: number | null
          eaei_mfr_immn_proj_recd_date?: string | null
          eaei_mfr_immn_proj_report_no?: number | null
          eaei_no_of_bro_and_sis?: number | null
          eaei_other_medications?: string | null
          eaei_patient_address1?: string | null
          eaei_patient_address2?: string | null
          eaei_patient_city?: string | null
          eaei_patient_died_date?: string | null
          eaei_patient_first_name?: string | null
          eaei_patient_last_name?: string | null
          eaei_patient_middle_initial?: string | null
          eaei_patient_recovered?: string | null
          eaei_patient_state?: string | null
          eaei_patient_telno?: string | null
          eaei_patient_zip?: string | null
          eaei_pre_conditions?: string | null
          eaei_pvn_or_alternative_no?: number | null
          eaei_relation_to_patient?: string | null
          eaei_report_type?: string | null
          eaei_reported_previously_to?: string | null
          eaei_resp_physician?: string | null
          eaei_result_permanent_disability?: string | null
          eaei_result_prolong_hospitalization?: string | null
          eaei_sex?: string | null
          eaei_status?: string | null
          eaei_suggestions_to_cust?: string | null
          eaei_vaccinated_at?: string | null
          eaei_vaccination_date?: string | null
          eaei_vaccine_purchased_with?: string | null
          eaei_weight_at_birth?: number | null
        }
        Relationships: []
      }
      ezc_agreement_header: {
        Row: {
          eah_current_status: number | null
          eah_desc: string | null
          eah_duration: number | null
          eah_duration_unit: string | null
          eah_end_date: string | null
          eah_intimation_period: number | null
          eah_main_template_version: number | null
          eah_maintenance_template: number | null
          eah_model: string | null
          eah_printable_text: string | null
          eah_renewal_amount: number | null
          eah_renewal_method: string | null
          eah_renewal_percentage: number | null
          eah_renewal_type: number | null
          eah_start_date: string | null
          eah_template_code: number | null
          eah_template_info: string | null
          eah_template_type: string | null
          eah_term_id: number | null
        }
        Insert: {
          eah_current_status?: number | null
          eah_desc?: string | null
          eah_duration?: number | null
          eah_duration_unit?: string | null
          eah_end_date?: string | null
          eah_intimation_period?: number | null
          eah_main_template_version?: number | null
          eah_maintenance_template?: number | null
          eah_model?: string | null
          eah_printable_text?: string | null
          eah_renewal_amount?: number | null
          eah_renewal_method?: string | null
          eah_renewal_percentage?: number | null
          eah_renewal_type?: number | null
          eah_start_date?: string | null
          eah_template_code?: number | null
          eah_template_info?: string | null
          eah_template_type?: string | null
          eah_term_id?: number | null
        }
        Update: {
          eah_current_status?: number | null
          eah_desc?: string | null
          eah_duration?: number | null
          eah_duration_unit?: string | null
          eah_end_date?: string | null
          eah_intimation_period?: number | null
          eah_main_template_version?: number | null
          eah_maintenance_template?: number | null
          eah_model?: string | null
          eah_printable_text?: string | null
          eah_renewal_amount?: number | null
          eah_renewal_method?: string | null
          eah_renewal_percentage?: number | null
          eah_renewal_type?: number | null
          eah_start_date?: string | null
          eah_template_code?: number | null
          eah_template_info?: string | null
          eah_template_type?: string | null
          eah_term_id?: number | null
        }
        Relationships: []
      }
      ezc_ams_split_overrides: {
        Row: {
          eao_based_on: string | null
          eao_override_type: string | null
          eao_value: string | null
          eao_value_basis: string | null
        }
        Insert: {
          eao_based_on?: string | null
          eao_override_type?: string | null
          eao_value?: string | null
          eao_value_basis?: string | null
        }
        Update: {
          eao_based_on?: string | null
          eao_override_type?: string | null
          eao_value?: string | null
          eao_value_basis?: string | null
        }
        Relationships: []
      }
      ezc_analytical_report_header: {
        Row: {
          earh_assign_to: string | null
          earh_auth_key: string | null
          earh_business_area: string | null
          earh_default_graph: string | null
          earh_gadget_desc: string | null
          earh_prod_group: string | null
          earh_query_name: string | null
          earh_query_text: string | null
          earh_report_desc: string | null
          earh_report_id: number | null
          earh_report_type: string | null
          earh_state: string | null
          earh_x_axis: string | null
          earh_x_axis_desc: string | null
          earh_y_axis: string | null
          earh_y_axis_desc: string | null
        }
        Insert: {
          earh_assign_to?: string | null
          earh_auth_key?: string | null
          earh_business_area?: string | null
          earh_default_graph?: string | null
          earh_gadget_desc?: string | null
          earh_prod_group?: string | null
          earh_query_name?: string | null
          earh_query_text?: string | null
          earh_report_desc?: string | null
          earh_report_id?: number | null
          earh_report_type?: string | null
          earh_state?: string | null
          earh_x_axis?: string | null
          earh_x_axis_desc?: string | null
          earh_y_axis?: string | null
          earh_y_axis_desc?: string | null
        }
        Update: {
          earh_assign_to?: string | null
          earh_auth_key?: string | null
          earh_business_area?: string | null
          earh_default_graph?: string | null
          earh_gadget_desc?: string | null
          earh_prod_group?: string | null
          earh_query_name?: string | null
          earh_query_text?: string | null
          earh_report_desc?: string | null
          earh_report_id?: number | null
          earh_report_type?: string | null
          earh_state?: string | null
          earh_x_axis?: string | null
          earh_x_axis_desc?: string | null
          earh_y_axis?: string | null
          earh_y_axis_desc?: string | null
        }
        Relationships: []
      }
      ezc_asb_point_groups: {
        Row: {
          epg_group_id: string | null
          epg_group_name: string | null
          epg_group_type: string | null
          epg_site_id: number | null
        }
        Insert: {
          epg_group_id?: string | null
          epg_group_name?: string | null
          epg_group_type?: string | null
          epg_site_id?: number | null
        }
        Update: {
          epg_group_id?: string | null
          epg_group_name?: string | null
          epg_group_type?: string | null
          epg_site_id?: number | null
        }
        Relationships: []
      }
      ezc_assets: {
        Row: {
          eza_asset_id: string | null
          eza_content: string | null
          eza_link: string | null
          eza_mime_type: string | null
        }
        Insert: {
          eza_asset_id?: string | null
          eza_content?: string | null
          eza_link?: string | null
          eza_mime_type?: string | null
        }
        Update: {
          eza_asset_id?: string | null
          eza_content?: string | null
          eza_link?: string | null
          eza_mime_type?: string | null
        }
        Relationships: []
      }
      ezc_attribute_set: {
        Row: {
          eas_desc: string | null
          eas_id: string | null
          eas_status: string | null
        }
        Insert: {
          eas_desc?: string | null
          eas_id?: string | null
          eas_status?: string | null
        }
        Update: {
          eas_desc?: string | null
          eas_id?: string | null
          eas_status?: string | null
        }
        Relationships: []
      }
      ezc_attribute_set_attr: {
        Row: {
          easa_attr_id: string | null
          easa_set_id: string | null
        }
        Insert: {
          easa_attr_id?: string | null
          easa_set_id?: string | null
        }
        Update: {
          easa_attr_id?: string | null
          easa_set_id?: string | null
        }
        Relationships: []
      }
      ezc_attribute_values: {
        Row: {
          eav_id: string | null
          eav_lang: string | null
          eav_values: string | null
        }
        Insert: {
          eav_id?: string | null
          eav_lang?: string | null
          eav_values?: string | null
        }
        Update: {
          eav_id?: string | null
          eav_lang?: string | null
          eav_values?: string | null
        }
        Relationships: []
      }
      ezc_attributes: {
        Row: {
          ea_attrib_id: number | null
          ea_container: string | null
          ea_description: string | null
          ea_ezc_struct_field: string | null
          ea_lang: string | null
          ea_role_no: string | null
          ea_type: string | null
        }
        Insert: {
          ea_attrib_id?: number | null
          ea_container?: string | null
          ea_description?: string | null
          ea_ezc_struct_field?: string | null
          ea_lang?: string | null
          ea_role_no?: string | null
          ea_type?: string | null
        }
        Update: {
          ea_attrib_id?: number | null
          ea_container?: string | null
          ea_description?: string | null
          ea_ezc_struct_field?: string | null
          ea_lang?: string | null
          ea_role_no?: string | null
          ea_type?: string | null
        }
        Relationships: []
      }
      ezc_attributes_config: {
        Row: {
          eac_autocomplete: string | null
          eac_desc: string | null
          eac_filterable: string | null
          eac_id: string | null
          eac_lang_dep: string | null
          eac_multival: string | null
          eac_status: string | null
          eac_type: string | null
        }
        Insert: {
          eac_autocomplete?: string | null
          eac_desc?: string | null
          eac_filterable?: string | null
          eac_id?: string | null
          eac_lang_dep?: string | null
          eac_multival?: string | null
          eac_status?: string | null
          eac_type?: string | null
        }
        Update: {
          eac_autocomplete?: string | null
          eac_desc?: string | null
          eac_filterable?: string | null
          eac_id?: string | null
          eac_lang_dep?: string | null
          eac_multival?: string | null
          eac_status?: string | null
          eac_type?: string | null
        }
        Relationships: []
      }
      ezc_audit_log: {
        Row: {
          els_changed_by: string | null
          els_changed_value: string | null
          els_date: string | null
          els_key: string | null
          els_old_value: string | null
          els_operatiion_type: string | null
          els_record_failed_flag: string | null
          els_sys_no: number | null
          els_table_name: string | null
          els_time: string | null
          els_transaction: string | null
        }
        Insert: {
          els_changed_by?: string | null
          els_changed_value?: string | null
          els_date?: string | null
          els_key?: string | null
          els_old_value?: string | null
          els_operatiion_type?: string | null
          els_record_failed_flag?: string | null
          els_sys_no?: number | null
          els_table_name?: string | null
          els_time?: string | null
          els_transaction?: string | null
        }
        Update: {
          els_changed_by?: string | null
          els_changed_value?: string | null
          els_date?: string | null
          els_key?: string | null
          els_old_value?: string | null
          els_operatiion_type?: string | null
          els_record_failed_flag?: string | null
          els_sys_no?: number | null
          els_table_name?: string | null
          els_time?: string | null
          els_transaction?: string | null
        }
        Relationships: []
      }
      ezc_audit_table_list: {
        Row: {
          eatl_sys_no: number | null
          eatl_table_name: string | null
        }
        Insert: {
          eatl_sys_no?: number | null
          eatl_table_name?: string | null
        }
        Update: {
          eatl_sys_no?: number | null
          eatl_table_name?: string | null
        }
        Relationships: []
      }
      ezc_auth_desc: {
        Row: {
          euad_auth_desc: string | null
          euad_auth_key: string | null
          euad_business_domain: string | null
          euad_component: string | null
          euad_deletion_flag: string | null
          euad_is_sys_auth: string | null
          euad_is_wf_enabled: string | null
          euad_lang: string | null
          euad_type_of_trans: string | null
        }
        Insert: {
          euad_auth_desc?: string | null
          euad_auth_key?: string | null
          euad_business_domain?: string | null
          euad_component?: string | null
          euad_deletion_flag?: string | null
          euad_is_sys_auth?: string | null
          euad_is_wf_enabled?: string | null
          euad_lang?: string | null
          euad_type_of_trans?: string | null
        }
        Update: {
          euad_auth_desc?: string | null
          euad_auth_key?: string | null
          euad_business_domain?: string | null
          euad_component?: string | null
          euad_deletion_flag?: string | null
          euad_is_sys_auth?: string | null
          euad_is_wf_enabled?: string | null
          euad_lang?: string | null
          euad_type_of_trans?: string | null
        }
        Relationships: []
      }
      ezc_blob_triggers: {
        Row: {
          blob_data: string | null
          trigger_group: string | null
          trigger_name: string | null
        }
        Insert: {
          blob_data?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Update: {
          blob_data?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      ezc_blocked_users: {
        Row: {
          ebu_blocked_on: string | null
          ebu_ext1: string | null
          ebu_ext2: string | null
          ebu_ext3: string | null
          ebu_reason: string | null
          ebu_status: string | null
          ebu_un_blocked_on: string | null
          ebu_user_id: string | null
        }
        Insert: {
          ebu_blocked_on?: string | null
          ebu_ext1?: string | null
          ebu_ext2?: string | null
          ebu_ext3?: string | null
          ebu_reason?: string | null
          ebu_status?: string | null
          ebu_un_blocked_on?: string | null
          ebu_user_id?: string | null
        }
        Update: {
          ebu_blocked_on?: string | null
          ebu_ext1?: string | null
          ebu_ext2?: string | null
          ebu_ext3?: string | null
          ebu_reason?: string | null
          ebu_status?: string | null
          ebu_un_blocked_on?: string | null
          ebu_user_id?: string | null
        }
        Relationships: []
      }
      ezc_bp_level_workflow: {
        Row: {
          ebp_business_partner: string | null
          ebp_cc_to: string | null
          ebp_procedure_type: string | null
          ebp_sequence_number: number | null
          ebp_step_number: number | null
          ebp_user_id: string | null
        }
        Insert: {
          ebp_business_partner?: string | null
          ebp_cc_to?: string | null
          ebp_procedure_type?: string | null
          ebp_sequence_number?: number | null
          ebp_step_number?: number | null
          ebp_user_id?: string | null
        }
        Update: {
          ebp_business_partner?: string | null
          ebp_cc_to?: string | null
          ebp_procedure_type?: string | null
          ebp_sequence_number?: number | null
          ebp_step_number?: number | null
          ebp_user_id?: string | null
        }
        Relationships: []
      }
      ezc_brand_site_defaults: {
        Row: {
          ebsd_client: string | null
          ebsd_key: string | null
          ebsd_site_id: number
          ebsd_value: string | null
        }
        Insert: {
          ebsd_client?: string | null
          ebsd_key?: string | null
          ebsd_site_id: number
          ebsd_value?: string | null
        }
        Update: {
          ebsd_client?: string | null
          ebsd_key?: string | null
          ebsd_site_id?: number
          ebsd_value?: string | null
        }
        Relationships: []
      }
      ezc_brand_sites: {
        Row: {
          ebs_client: string | null
          ebs_lang: string | null
          ebs_site_desc: string | null
          ebs_site_id: number
          ebs_site_url: string | null
        }
        Insert: {
          ebs_client?: string | null
          ebs_lang?: string | null
          ebs_site_desc?: string | null
          ebs_site_id: number
          ebs_site_url?: string | null
        }
        Update: {
          ebs_client?: string | null
          ebs_lang?: string | null
          ebs_site_desc?: string | null
          ebs_site_id?: number
          ebs_site_url?: string | null
        }
        Relationships: []
      }
      ezc_buss_partner_areas: {
        Row: {
          ebpa_area_flag: string | null
          ebpa_buss_partner: string | null
          ebpa_client: number | null
          ebpa_sys_key: string | null
          ebpa_user_id: string | null
        }
        Insert: {
          ebpa_area_flag?: string | null
          ebpa_buss_partner?: string | null
          ebpa_client?: number | null
          ebpa_sys_key?: string | null
          ebpa_user_id?: string | null
        }
        Update: {
          ebpa_area_flag?: string | null
          ebpa_buss_partner?: string | null
          ebpa_client?: number | null
          ebpa_sys_key?: string | null
          ebpa_user_id?: string | null
        }
        Relationships: []
      }
      ezc_buss_partner_auth: {
        Row: {
          ebpa_auth_key: string | null
          ebpa_auth_value: string | null
          ebpa_buss_partner: string | null
          ebpa_role_or_auth: string | null
          ebpa_sys_no: number | null
        }
        Insert: {
          ebpa_auth_key?: string | null
          ebpa_auth_value?: string | null
          ebpa_buss_partner?: string | null
          ebpa_role_or_auth?: string | null
          ebpa_sys_no?: number | null
        }
        Update: {
          ebpa_auth_key?: string | null
          ebpa_auth_value?: string | null
          ebpa_buss_partner?: string | null
          ebpa_role_or_auth?: string | null
          ebpa_sys_no?: number | null
        }
        Relationships: []
      }
      ezc_buss_partner_config: {
        Row: {
          ebpc_buss_partner: string | null
          ebpc_catalog_no: number | null
          ebpc_multiple_sales_areas: string | null
          ebpc_number_of_users: number | null
          ebpc_price_selection_flag: string | null
          ebpc_unlimited_users: string | null
          epbc_intranet_flag: string | null
        }
        Insert: {
          ebpc_buss_partner?: string | null
          ebpc_catalog_no?: number | null
          ebpc_multiple_sales_areas?: string | null
          ebpc_number_of_users?: number | null
          ebpc_price_selection_flag?: string | null
          ebpc_unlimited_users?: string | null
          epbc_intranet_flag?: string | null
        }
        Update: {
          ebpc_buss_partner?: string | null
          ebpc_catalog_no?: number | null
          ebpc_multiple_sales_areas?: string | null
          ebpc_number_of_users?: number | null
          ebpc_price_selection_flag?: string | null
          ebpc_unlimited_users?: string | null
          epbc_intranet_flag?: string | null
        }
        Relationships: []
      }
      ezc_buss_partner_params: {
        Row: {
          ebpp_buss_partner: string | null
          ebpp_key: string | null
          ebpp_value: string | null
        }
        Insert: {
          ebpp_buss_partner?: string | null
          ebpp_key?: string | null
          ebpp_value?: string | null
        }
        Update: {
          ebpp_buss_partner?: string | null
          ebpp_key?: string | null
          ebpp_value?: string | null
        }
        Relationships: []
      }
      ezc_buss_partner_xml_params: {
        Row: {
          ebpx_buss_partner: string | null
          ebpx_client: number | null
          ebpx_xml_standard_in: string | null
          ebpx_xml_standard_out: string | null
          ebpx_xml_transaction_id: string | null
        }
        Insert: {
          ebpx_buss_partner?: string | null
          ebpx_client?: number | null
          ebpx_xml_standard_in?: string | null
          ebpx_xml_standard_out?: string | null
          ebpx_xml_transaction_id?: string | null
        }
        Update: {
          ebpx_buss_partner?: string | null
          ebpx_client?: number | null
          ebpx_xml_standard_in?: string | null
          ebpx_xml_standard_out?: string | null
          ebpx_xml_transaction_id?: string | null
        }
        Relationships: []
      }
      ezc_calendar: {
        Row: {
          ecal_active_yes_or_no: string | null
          ecal_break_end: string | null
          ecal_break_time: string | null
          ecal_calendar_code: string | null
          ecal_effective_from: string
          ecal_effective_to: string | null
          ecal_non_working_days: string | null
          ecal_number_hours_day: number | null
          ecal_start_time: string | null
          ecal_work_week: string | null
        }
        Insert: {
          ecal_active_yes_or_no?: string | null
          ecal_break_end?: string | null
          ecal_break_time?: string | null
          ecal_calendar_code?: string | null
          ecal_effective_from: string
          ecal_effective_to?: string | null
          ecal_non_working_days?: string | null
          ecal_number_hours_day?: number | null
          ecal_start_time?: string | null
          ecal_work_week?: string | null
        }
        Update: {
          ecal_active_yes_or_no?: string | null
          ecal_break_end?: string | null
          ecal_break_time?: string | null
          ecal_calendar_code?: string | null
          ecal_effective_from?: string
          ecal_effective_to?: string | null
          ecal_non_working_days?: string | null
          ecal_number_hours_day?: number | null
          ecal_start_time?: string | null
          ecal_work_week?: string | null
        }
        Relationships: []
      }
      ezc_card_transactions: {
        Row: {
          ect_amount: string | null
          ect_po_no: string | null
          ect_ship_to: string | null
          ect_sold_to: string | null
          ect_status_code: string | null
          ect_tr_date: string | null
          ect_tr_ext1: string | null
          ect_tr_ext2: string | null
          ect_tr_ext3: string | null
          ect_tr_id: string | null
          ect_tr_message: string | null
          ect_user_id: string | null
        }
        Insert: {
          ect_amount?: string | null
          ect_po_no?: string | null
          ect_ship_to?: string | null
          ect_sold_to?: string | null
          ect_status_code?: string | null
          ect_tr_date?: string | null
          ect_tr_ext1?: string | null
          ect_tr_ext2?: string | null
          ect_tr_ext3?: string | null
          ect_tr_id?: string | null
          ect_tr_message?: string | null
          ect_user_id?: string | null
        }
        Update: {
          ect_amount?: string | null
          ect_po_no?: string | null
          ect_ship_to?: string | null
          ect_sold_to?: string | null
          ect_status_code?: string | null
          ect_tr_date?: string | null
          ect_tr_ext1?: string | null
          ect_tr_ext2?: string | null
          ect_tr_ext3?: string | null
          ect_tr_id?: string | null
          ect_tr_message?: string | null
          ect_user_id?: string | null
        }
        Relationships: []
      }
      ezc_cat_area_defaults: {
        Row: {
          ecad_client: string | null
          ecad_key: string | null
          ecad_sys_key: string | null
          ecad_value: string | null
        }
        Insert: {
          ecad_client?: string | null
          ecad_key?: string | null
          ecad_sys_key?: string | null
          ecad_value?: string | null
        }
        Update: {
          ecad_client?: string | null
          ecad_key?: string | null
          ecad_sys_key?: string | null
          ecad_value?: string | null
        }
        Relationships: []
      }
      ezc_cat_attr_set: {
        Row: {
          ecas_attr_set: string | null
          ecas_category_code: string | null
        }
        Insert: {
          ecas_attr_set?: string | null
          ecas_category_code?: string | null
        }
        Update: {
          ecas_attr_set?: string | null
          ecas_category_code?: string | null
        }
        Relationships: []
      }
      ezc_catalog_categories: {
        Row: {
          ecc_catalog_id: string | null
          ecc_category_id: string | null
        }
        Insert: {
          ecc_catalog_id?: string | null
          ecc_category_id?: string | null
        }
        Update: {
          ecc_catalog_id?: string | null
          ecc_category_id?: string | null
        }
        Relationships: []
      }
      ezc_catalog_group: {
        Row: {
          ecg_catalog_no: number | null
          ecg_index_indicator: string | null
          ecg_product_group: string | null
          ecg_sys_key: string | null
        }
        Insert: {
          ecg_catalog_no?: number | null
          ecg_index_indicator?: string | null
          ecg_product_group?: string | null
          ecg_sys_key?: string | null
        }
        Update: {
          ecg_catalog_no?: number | null
          ecg_index_indicator?: string | null
          ecg_product_group?: string | null
          ecg_sys_key?: string | null
        }
        Relationships: []
      }
      ezc_categories: {
        Row: {
          ec_catalog_id: string | null
          ec_code: string | null
          ec_image: string | null
          ec_mat_count: string | null
          ec_parent: string | null
          ec_sort: number | null
          ec_status: string | null
          ec_thumb: string | null
          ec_visible: string | null
        }
        Insert: {
          ec_catalog_id?: string | null
          ec_code?: string | null
          ec_image?: string | null
          ec_mat_count?: string | null
          ec_parent?: string | null
          ec_sort?: number | null
          ec_status?: string | null
          ec_thumb?: string | null
          ec_visible?: string | null
        }
        Update: {
          ec_catalog_id?: string | null
          ec_code?: string | null
          ec_image?: string | null
          ec_mat_count?: string | null
          ec_parent?: string | null
          ec_sort?: number | null
          ec_status?: string | null
          ec_thumb?: string | null
          ec_visible?: string | null
        }
        Relationships: []
      }
      ezc_category_assets: {
        Row: {
          eca_asset_id: string | null
          eca_catalog_id: string | null
          eca_category_code: string | null
          eca_image_type: string | null
          eca_screen_name: string | null
        }
        Insert: {
          eca_asset_id?: string | null
          eca_catalog_id?: string | null
          eca_category_code?: string | null
          eca_image_type?: string | null
          eca_screen_name?: string | null
        }
        Update: {
          eca_asset_id?: string | null
          eca_catalog_id?: string | null
          eca_category_code?: string | null
          eca_image_type?: string | null
          eca_screen_name?: string | null
        }
        Relationships: []
      }
      ezc_category_description: {
        Row: {
          ecd_catalog_id: string | null
          ecd_code: string | null
          ecd_desc: string | null
          ecd_lang: string | null
          ecd_profit_center: string | null
          ecd_text: string | null
        }
        Insert: {
          ecd_catalog_id?: string | null
          ecd_code?: string | null
          ecd_desc?: string | null
          ecd_lang?: string | null
          ecd_profit_center?: string | null
          ecd_text?: string | null
        }
        Update: {
          ecd_catalog_id?: string | null
          ecd_code?: string | null
          ecd_desc?: string | null
          ecd_lang?: string | null
          ecd_profit_center?: string | null
          ecd_text?: string | null
        }
        Relationships: []
      }
      ezc_category_products: {
        Row: {
          ecp_catalog_id: string | null
          ecp_category_code: string | null
          ecp_product_code: string | null
          ecp_sort: number | null
        }
        Insert: {
          ecp_catalog_id?: string | null
          ecp_category_code?: string | null
          ecp_product_code?: string | null
          ecp_sort?: number | null
        }
        Update: {
          ecp_catalog_id?: string | null
          ecp_category_code?: string | null
          ecp_product_code?: string | null
          ecp_sort?: number | null
        }
        Relationships: []
      }
      ezc_certificate_of_analysis: {
        Row: {
          ezca_arno: string | null
          ezca_boxes: string | null
          ezca_doa: string | null
          ezca_document_no: string | null
          ezca_domfg: string | null
          ezca_ext1: string | null
          ezca_ext2: string | null
          ezca_item_no: string | null
          ezca_line_no: string | null
          ezca_spec_no: string | null
        }
        Insert: {
          ezca_arno?: string | null
          ezca_boxes?: string | null
          ezca_doa?: string | null
          ezca_document_no?: string | null
          ezca_domfg?: string | null
          ezca_ext1?: string | null
          ezca_ext2?: string | null
          ezca_item_no?: string | null
          ezca_line_no?: string | null
          ezca_spec_no?: string | null
        }
        Update: {
          ezca_arno?: string | null
          ezca_boxes?: string | null
          ezca_doa?: string | null
          ezca_document_no?: string | null
          ezca_domfg?: string | null
          ezca_ext1?: string | null
          ezca_ext2?: string | null
          ezca_item_no?: string | null
          ezca_line_no?: string | null
          ezca_spec_no?: string | null
        }
        Relationships: []
      }
      ezc_change_order_header: {
        Row: {
          ecoh_csr_email: string | null
          ecoh_csr_name: string | null
          ecoh_doc_id: number
          ecoh_ext1: string | null
          ecoh_ext2: string | null
          ecoh_ext3: string | null
          ecoh_modified_by: string | null
          ecoh_modified_on: string | null
          ecoh_order_ref: string | null
          ecoh_po_ref: string | null
          ecoh_status: string | null
        }
        Insert: {
          ecoh_csr_email?: string | null
          ecoh_csr_name?: string | null
          ecoh_doc_id: number
          ecoh_ext1?: string | null
          ecoh_ext2?: string | null
          ecoh_ext3?: string | null
          ecoh_modified_by?: string | null
          ecoh_modified_on?: string | null
          ecoh_order_ref?: string | null
          ecoh_po_ref?: string | null
          ecoh_status?: string | null
        }
        Update: {
          ecoh_csr_email?: string | null
          ecoh_csr_name?: string | null
          ecoh_doc_id?: number
          ecoh_ext1?: string | null
          ecoh_ext2?: string | null
          ecoh_ext3?: string | null
          ecoh_modified_by?: string | null
          ecoh_modified_on?: string | null
          ecoh_order_ref?: string | null
          ecoh_po_ref?: string | null
          ecoh_status?: string | null
        }
        Relationships: []
      }
      ezc_change_order_items: {
        Row: {
          ecoi_cancel_reason: string | null
          ecoi_change_type: string | null
          ecoi_changed_customer_sku: string | null
          ecoi_changed_quantity: string | null
          ecoi_changed_sku: string | null
          ecoi_changed_uom: string | null
          ecoi_doc_id: number | null
          ecoi_ext1: string | null
          ecoi_ext2: string | null
          ecoi_ext3: string | null
          ecoi_line_item: string | null
          ecoi_order_ref: string | null
          ecoi_quantity: string | null
          ecoi_sku: string | null
          ecoi_uom: string | null
        }
        Insert: {
          ecoi_cancel_reason?: string | null
          ecoi_change_type?: string | null
          ecoi_changed_customer_sku?: string | null
          ecoi_changed_quantity?: string | null
          ecoi_changed_sku?: string | null
          ecoi_changed_uom?: string | null
          ecoi_doc_id?: number | null
          ecoi_ext1?: string | null
          ecoi_ext2?: string | null
          ecoi_ext3?: string | null
          ecoi_line_item?: string | null
          ecoi_order_ref?: string | null
          ecoi_quantity?: string | null
          ecoi_sku?: string | null
          ecoi_uom?: string | null
        }
        Update: {
          ecoi_cancel_reason?: string | null
          ecoi_change_type?: string | null
          ecoi_changed_customer_sku?: string | null
          ecoi_changed_quantity?: string | null
          ecoi_changed_sku?: string | null
          ecoi_changed_uom?: string | null
          ecoi_doc_id?: number | null
          ecoi_ext1?: string | null
          ecoi_ext2?: string | null
          ecoi_ext3?: string | null
          ecoi_line_item?: string | null
          ecoi_order_ref?: string | null
          ecoi_quantity?: string | null
          ecoi_sku?: string | null
          ecoi_uom?: string | null
        }
        Relationships: []
      }
      ezc_claim_policies: {
        Row: {
          ecp_brand_id: number | null
          ecp_category: string | null
          ecp_created_at: string
          ecp_id: number | null
          ecp_pdf_ind: unknown
          ecp_title: string | null
          ecp_updated_at: string
          ecp_xls_ind: unknown
        }
        Insert: {
          ecp_brand_id?: number | null
          ecp_category?: string | null
          ecp_created_at: string
          ecp_id?: number | null
          ecp_pdf_ind: unknown
          ecp_title?: string | null
          ecp_updated_at: string
          ecp_xls_ind: unknown
        }
        Update: {
          ecp_brand_id?: number | null
          ecp_category?: string | null
          ecp_created_at?: string
          ecp_id?: number | null
          ecp_pdf_ind?: unknown
          ecp_title?: string | null
          ecp_updated_at?: string
          ecp_xls_ind?: unknown
        }
        Relationships: []
      }
      ezc_classification_assets: {
        Row: {
          eca_asset_id: string | null
          eca_classification_code: string | null
          eca_image_type: string | null
          eca_screen_name: string | null
        }
        Insert: {
          eca_asset_id?: string | null
          eca_classification_code?: string | null
          eca_image_type?: string | null
          eca_screen_name?: string | null
        }
        Update: {
          eca_asset_id?: string | null
          eca_classification_code?: string | null
          eca_image_type?: string | null
          eca_screen_name?: string | null
        }
        Relationships: []
      }
      ezc_classification_description: {
        Row: {
          ecld_code: string | null
          ecld_desc: string | null
          ecld_lang: string | null
          ecld_text: string | null
        }
        Insert: {
          ecld_code?: string | null
          ecld_desc?: string | null
          ecld_lang?: string | null
          ecld_text?: string | null
        }
        Update: {
          ecld_code?: string | null
          ecld_desc?: string | null
          ecld_lang?: string | null
          ecld_text?: string | null
        }
        Relationships: []
      }
      ezc_classification_products: {
        Row: {
          ecp_classification_code: string | null
          ecp_product_code: string | null
        }
        Insert: {
          ecp_classification_code?: string | null
          ecp_product_code?: string | null
        }
        Update: {
          ecp_classification_code?: string | null
          ecp_product_code?: string | null
        }
        Relationships: []
      }
      ezc_cnet_price: {
        Row: {
          ecp_date: string | null
          ecp_effective_date: string | null
          ecp_future_price: number | null
          ecp_material: string | null
          ecp_mfr_name: string | null
          ecp_mfr_no: string | null
          ecp_price: number | null
        }
        Insert: {
          ecp_date?: string | null
          ecp_effective_date?: string | null
          ecp_future_price?: number | null
          ecp_material?: string | null
          ecp_mfr_name?: string | null
          ecp_mfr_no?: string | null
          ecp_price?: number | null
        }
        Update: {
          ecp_date?: string | null
          ecp_effective_date?: string | null
          ecp_future_price?: number | null
          ecp_material?: string | null
          ecp_mfr_name?: string | null
          ecp_mfr_no?: string | null
          ecp_price?: number | null
        }
        Relationships: []
      }
      ezc_comm_archives: {
        Row: {
          eca_brand_id: number
          eca_category: string | null
          eca_created_at: string
          eca_id: number
          eca_pdf_ind: unknown
          eca_title: string | null
          eca_updated_at: string
        }
        Insert: {
          eca_brand_id: number
          eca_category?: string | null
          eca_created_at: string
          eca_id: number
          eca_pdf_ind: unknown
          eca_title?: string | null
          eca_updated_at: string
        }
        Update: {
          eca_brand_id?: number
          eca_category?: string | null
          eca_created_at?: string
          eca_id?: number
          eca_pdf_ind?: unknown
          eca_title?: string | null
          eca_updated_at?: string
        }
        Relationships: []
      }
      ezc_components: {
        Row: {
          ec_component_code: string | null
          ec_component_model_code: number | null
          ec_expiry_date: string | null
          ec_incld_in_par_warr: string | null
          ec_installed_date: string | null
          ec_instrument_code: string | null
          ec_life_time: number | null
          ec_life_time_unit: string | null
          ec_manufacturer_id: string | null
          ec_oem_slno: string | null
          ec_parent_comp_code: string | null
          ec_warr_eff_date: string | null
          ec_warr_exp_date: string | null
        }
        Insert: {
          ec_component_code?: string | null
          ec_component_model_code?: number | null
          ec_expiry_date?: string | null
          ec_incld_in_par_warr?: string | null
          ec_installed_date?: string | null
          ec_instrument_code?: string | null
          ec_life_time?: number | null
          ec_life_time_unit?: string | null
          ec_manufacturer_id?: string | null
          ec_oem_slno?: string | null
          ec_parent_comp_code?: string | null
          ec_warr_eff_date?: string | null
          ec_warr_exp_date?: string | null
        }
        Update: {
          ec_component_code?: string | null
          ec_component_model_code?: number | null
          ec_expiry_date?: string | null
          ec_incld_in_par_warr?: string | null
          ec_installed_date?: string | null
          ec_instrument_code?: string | null
          ec_life_time?: number | null
          ec_life_time_unit?: string | null
          ec_manufacturer_id?: string | null
          ec_oem_slno?: string | null
          ec_parent_comp_code?: string | null
          ec_warr_eff_date?: string | null
          ec_warr_exp_date?: string | null
        }
        Relationships: []
      }
      ezc_components_models: {
        Row: {
          ecm_binno: string | null
          ecm_component_model_code: number | null
          ecm_description: string | null
          ecm_enterprise_code: string | null
          ecm_incl_in_parent_warranty: string | null
          ecm_lang: string | null
          ecm_life_time: number | null
          ecm_life_time_units: string | null
          ecm_manufacturer_id: string | null
          ecm_type: string | null
          ecm_warranty_template_code: string | null
        }
        Insert: {
          ecm_binno?: string | null
          ecm_component_model_code?: number | null
          ecm_description?: string | null
          ecm_enterprise_code?: string | null
          ecm_incl_in_parent_warranty?: string | null
          ecm_lang?: string | null
          ecm_life_time?: number | null
          ecm_life_time_units?: string | null
          ecm_manufacturer_id?: string | null
          ecm_type?: string | null
          ecm_warranty_template_code?: string | null
        }
        Update: {
          ecm_binno?: string | null
          ecm_component_model_code?: number | null
          ecm_description?: string | null
          ecm_enterprise_code?: string | null
          ecm_incl_in_parent_warranty?: string | null
          ecm_lang?: string | null
          ecm_life_time?: number | null
          ecm_life_time_units?: string | null
          ecm_manufacturer_id?: string | null
          ecm_type?: string | null
          ecm_warranty_template_code?: string | null
        }
        Relationships: []
      }
      ezc_condition_master: {
        Row: {
          ecm_attribute: number | null
          ecm_cond_id: number | null
          ecm_cond_value1: string | null
          ecm_cond_value2: string | null
          ecm_condition_operator: string | null
          ecm_rule_id: number | null
          ezc_condition_type: string | null
        }
        Insert: {
          ecm_attribute?: number | null
          ecm_cond_id?: number | null
          ecm_cond_value1?: string | null
          ecm_cond_value2?: string | null
          ecm_condition_operator?: string | null
          ecm_rule_id?: number | null
          ezc_condition_type?: string | null
        }
        Update: {
          ecm_attribute?: number | null
          ecm_cond_id?: number | null
          ecm_cond_value1?: string | null
          ecm_cond_value2?: string | null
          ecm_condition_operator?: string | null
          ecm_rule_id?: number | null
          ezc_condition_type?: string | null
        }
        Relationships: []
      }
      ezc_consolidate_terms: {
        Row: {
          ect_act_cost_amt: number | null
          ect_act_sales_amt: number | null
          ect_budg_cost_amt: number | null
          ect_budg_sales_amt: number | null
          ect_cost_amt: number | null
          ect_sales_amt: number | null
          ect_service_category: number | null
          ect_term_id: number | null
        }
        Insert: {
          ect_act_cost_amt?: number | null
          ect_act_sales_amt?: number | null
          ect_budg_cost_amt?: number | null
          ect_budg_sales_amt?: number | null
          ect_cost_amt?: number | null
          ect_sales_amt?: number | null
          ect_service_category?: number | null
          ect_term_id?: number | null
        }
        Update: {
          ect_act_cost_amt?: number | null
          ect_act_sales_amt?: number | null
          ect_budg_cost_amt?: number | null
          ect_budg_sales_amt?: number | null
          ect_cost_amt?: number | null
          ect_sales_amt?: number | null
          ect_service_category?: number | null
          ect_term_id?: number | null
        }
        Relationships: []
      }
      ezc_contract: {
        Row: {
          ec_cancel_date: string | null
          ec_cancel_reason: string | null
          ec_contract_code: number | null
          ec_contract_template: number | null
          ec_contract_text: string | null
          ec_created_on: string | null
          ec_current_status: number | null
          ec_desc: string | null
          ec_end_date: string | null
          ec_internal_text: string | null
          ec_intimation_period: number | null
          ec_invoiceto_city: string | null
          ec_invoiceto_contact_person: string | null
          ec_invoiceto_country: string | null
          ec_invoiceto_cust: string | null
          ec_invoiceto_cust_add1: string | null
          ec_invoiceto_cust_add2: string | null
          ec_invoiceto_cust_add3: string | null
          ec_invoiceto_email: string | null
          ec_invoiceto_state: string | null
          ec_invoiceto_telno: string | null
          ec_invoiceto_zipcode: string | null
          ec_modified_on: string | null
          ec_renewal_amt: number | null
          ec_renewal_method: string | null
          ec_renewal_percentage: number | null
          ec_renewal_type: number | null
          ec_schedule_code: number | null
          ec_soldto_city: string | null
          ec_soldto_contact_person: string | null
          ec_soldto_country: string | null
          ec_soldto_cust: string | null
          ec_soldto_cust_add1: string | null
          ec_soldto_cust_add2: string | null
          ec_soldto_cust_add3: string | null
          ec_soldto_email: string | null
          ec_soldto_state: string | null
          ec_soldto_telno: string | null
          ec_soldto_zipcode: string | null
          ec_start_date: string | null
          ec_term_id: number | null
          ec_value: number | null
        }
        Insert: {
          ec_cancel_date?: string | null
          ec_cancel_reason?: string | null
          ec_contract_code?: number | null
          ec_contract_template?: number | null
          ec_contract_text?: string | null
          ec_created_on?: string | null
          ec_current_status?: number | null
          ec_desc?: string | null
          ec_end_date?: string | null
          ec_internal_text?: string | null
          ec_intimation_period?: number | null
          ec_invoiceto_city?: string | null
          ec_invoiceto_contact_person?: string | null
          ec_invoiceto_country?: string | null
          ec_invoiceto_cust?: string | null
          ec_invoiceto_cust_add1?: string | null
          ec_invoiceto_cust_add2?: string | null
          ec_invoiceto_cust_add3?: string | null
          ec_invoiceto_email?: string | null
          ec_invoiceto_state?: string | null
          ec_invoiceto_telno?: string | null
          ec_invoiceto_zipcode?: string | null
          ec_modified_on?: string | null
          ec_renewal_amt?: number | null
          ec_renewal_method?: string | null
          ec_renewal_percentage?: number | null
          ec_renewal_type?: number | null
          ec_schedule_code?: number | null
          ec_soldto_city?: string | null
          ec_soldto_contact_person?: string | null
          ec_soldto_country?: string | null
          ec_soldto_cust?: string | null
          ec_soldto_cust_add1?: string | null
          ec_soldto_cust_add2?: string | null
          ec_soldto_cust_add3?: string | null
          ec_soldto_email?: string | null
          ec_soldto_state?: string | null
          ec_soldto_telno?: string | null
          ec_soldto_zipcode?: string | null
          ec_start_date?: string | null
          ec_term_id?: number | null
          ec_value?: number | null
        }
        Update: {
          ec_cancel_date?: string | null
          ec_cancel_reason?: string | null
          ec_contract_code?: number | null
          ec_contract_template?: number | null
          ec_contract_text?: string | null
          ec_created_on?: string | null
          ec_current_status?: number | null
          ec_desc?: string | null
          ec_end_date?: string | null
          ec_internal_text?: string | null
          ec_intimation_period?: number | null
          ec_invoiceto_city?: string | null
          ec_invoiceto_contact_person?: string | null
          ec_invoiceto_country?: string | null
          ec_invoiceto_cust?: string | null
          ec_invoiceto_cust_add1?: string | null
          ec_invoiceto_cust_add2?: string | null
          ec_invoiceto_cust_add3?: string | null
          ec_invoiceto_email?: string | null
          ec_invoiceto_state?: string | null
          ec_invoiceto_telno?: string | null
          ec_invoiceto_zipcode?: string | null
          ec_modified_on?: string | null
          ec_renewal_amt?: number | null
          ec_renewal_method?: string | null
          ec_renewal_percentage?: number | null
          ec_renewal_type?: number | null
          ec_schedule_code?: number | null
          ec_soldto_city?: string | null
          ec_soldto_contact_person?: string | null
          ec_soldto_country?: string | null
          ec_soldto_cust?: string | null
          ec_soldto_cust_add1?: string | null
          ec_soldto_cust_add2?: string | null
          ec_soldto_cust_add3?: string | null
          ec_soldto_email?: string | null
          ec_soldto_state?: string | null
          ec_soldto_telno?: string | null
          ec_soldto_zipcode?: string | null
          ec_start_date?: string | null
          ec_term_id?: number | null
          ec_value?: number | null
        }
        Relationships: []
      }
      ezc_conversion_factors: {
        Row: {
          ecfa_base_unit: string | null
          ecfa_conv_factor: number | null
          ecfa_trans_unit: string | null
        }
        Insert: {
          ecfa_base_unit?: string | null
          ecfa_conv_factor?: number | null
          ecfa_trans_unit?: string | null
        }
        Update: {
          ecfa_base_unit?: string | null
          ecfa_conv_factor?: number | null
          ecfa_trans_unit?: string | null
        }
        Relationships: []
      }
      ezc_country_region_mapping: {
        Row: {
          country_code: string | null
          LANGUAGE: string | null
          region_code: string | null
          region_desc: string | null
        }
        Insert: {
          country_code?: string | null
          LANGUAGE?: string | null
          region_code?: string | null
          region_desc?: string | null
        }
        Update: {
          country_code?: string | null
          LANGUAGE?: string | null
          region_code?: string | null
          region_desc?: string | null
        }
        Relationships: []
      }
      ezc_coverage_terms: {
        Row: {
          ect_act_cost_amt: number | null
          ect_act_sales_amt: number | null
          ect_budg_cost_amt: number | null
          ect_budg_sales_amt: number | null
          ect_cost_amt: number | null
          ect_cost_type: string | null
          ect_coverage_amt: number | null
          ect_coverage_percentage: number | null
          ect_coverage_type: string | null
          ect_desc: string | null
          ect_end_date: string | null
          ect_sales_amt: number | null
          ect_sequence: number | null
          ect_service_category: number | null
          ect_start_date: string | null
          ect_term_id: number | null
        }
        Insert: {
          ect_act_cost_amt?: number | null
          ect_act_sales_amt?: number | null
          ect_budg_cost_amt?: number | null
          ect_budg_sales_amt?: number | null
          ect_cost_amt?: number | null
          ect_cost_type?: string | null
          ect_coverage_amt?: number | null
          ect_coverage_percentage?: number | null
          ect_coverage_type?: string | null
          ect_desc?: string | null
          ect_end_date?: string | null
          ect_sales_amt?: number | null
          ect_sequence?: number | null
          ect_service_category?: number | null
          ect_start_date?: string | null
          ect_term_id?: number | null
        }
        Update: {
          ect_act_cost_amt?: number | null
          ect_act_sales_amt?: number | null
          ect_budg_cost_amt?: number | null
          ect_budg_sales_amt?: number | null
          ect_cost_amt?: number | null
          ect_cost_type?: string | null
          ect_coverage_amt?: number | null
          ect_coverage_percentage?: number | null
          ect_coverage_type?: string | null
          ect_desc?: string | null
          ect_end_date?: string | null
          ect_sales_amt?: number | null
          ect_sequence?: number | null
          ect_service_category?: number | null
          ect_start_date?: string | null
          ect_term_id?: number | null
        }
        Relationships: []
      }
      ezc_covered_products: {
        Row: {
          ecp_coverage_end_date: string | null
          ecp_coverage_start_date: string | null
          ecp_header_code: string | null
          ecp_header_type: string | null
          ecp_product_code: string | null
          ecp_product_type: string | null
        }
        Insert: {
          ecp_coverage_end_date?: string | null
          ecp_coverage_start_date?: string | null
          ecp_header_code?: string | null
          ecp_header_type?: string | null
          ecp_product_code?: string | null
          ecp_product_type?: string | null
        }
        Update: {
          ecp_coverage_end_date?: string | null
          ecp_coverage_start_date?: string | null
          ecp_header_code?: string | null
          ecp_header_type?: string | null
          ecp_product_code?: string | null
          ecp_product_type?: string | null
        }
        Relationships: []
      }
      ezc_cron_triggers: {
        Row: {
          cron_expression: string | null
          time_zone_id: string | null
          trigger_group: string | null
          trigger_name: string | null
        }
        Insert: {
          cron_expression?: string | null
          time_zone_id?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Update: {
          cron_expression?: string | null
          time_zone_id?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      ezc_currency: {
        Row: {
          ec_alternate_key: string | null
          ec_curr_key: string | null
          ec_iso_curr_key: string | null
          ec_valid_to_date: string | null
        }
        Insert: {
          ec_alternate_key?: string | null
          ec_curr_key?: string | null
          ec_iso_curr_key?: string | null
          ec_valid_to_date?: string | null
        }
        Update: {
          ec_alternate_key?: string | null
          ec_curr_key?: string | null
          ec_iso_curr_key?: string | null
          ec_valid_to_date?: string | null
        }
        Relationships: []
      }
      ezc_currency_conversion: {
        Row: {
          ecc_conversion_rate: number | null
          ecc_exchange_type: string | null
          ecc_from_iso_curr_key: string | null
          ecc_to_iso_curr_key: string | null
          ecc_update_date: string | null
          ecc_update_time: string | null
        }
        Insert: {
          ecc_conversion_rate?: number | null
          ecc_exchange_type?: string | null
          ecc_from_iso_curr_key?: string | null
          ecc_to_iso_curr_key?: string | null
          ecc_update_date?: string | null
          ecc_update_time?: string | null
        }
        Update: {
          ecc_conversion_rate?: number | null
          ecc_exchange_type?: string | null
          ecc_from_iso_curr_key?: string | null
          ecc_to_iso_curr_key?: string | null
          ecc_update_date?: string | null
          ecc_update_time?: string | null
        }
        Relationships: []
      }
      ezc_currency_desc: {
        Row: {
          ecd_curr_key: string | null
          ecd_lang: string | null
          ecd_long_desc: string | null
          ecd_short_desc: string | null
        }
        Insert: {
          ecd_curr_key?: string | null
          ecd_lang?: string | null
          ecd_long_desc?: string | null
          ecd_short_desc?: string | null
        }
        Update: {
          ecd_curr_key?: string | null
          ecd_lang?: string | null
          ecd_long_desc?: string | null
          ecd_short_desc?: string | null
        }
        Relationships: []
      }
      ezc_customer: {
        Row: {
          ec_business_partner: string | null
          ec_deletion_flag: string | null
          ec_erp_cust_no: string | null
          ec_no: string | null
          ec_partner_function: string | null
          ec_partner_no: string | null
          ec_sys_key: string | null
        }
        Insert: {
          ec_business_partner?: string | null
          ec_deletion_flag?: string | null
          ec_erp_cust_no?: string | null
          ec_no?: string | null
          ec_partner_function?: string | null
          ec_partner_no?: string | null
          ec_sys_key?: string | null
        }
        Update: {
          ec_business_partner?: string | null
          ec_deletion_flag?: string | null
          ec_erp_cust_no?: string | null
          ec_no?: string | null
          ec_partner_function?: string | null
          ec_partner_no?: string | null
          ec_sys_key?: string | null
        }
        Relationships: []
      }
      ezc_customer_addr: {
        Row: {
          eca_account_group: string | null
          eca_addr_1: string | null
          eca_addr_2: string | null
          eca_addr_3: string | null
          eca_addr_4: string | null
          eca_block_code: string | null
          eca_city: string | null
          eca_company_name: string | null
          eca_country: string | null
          eca_country_code: string | null
          eca_country1: string | null
          eca_deletion_flag: string | null
          eca_district: string | null
          eca_email: string | null
          eca_erp_update_flag: string | null
          eca_ext1: string | null
          eca_ext2: string | null
          eca_ext3: string | null
          eca_fax1: string | null
          eca_incoterms: string | null
          eca_is_business_partner: string | null
          eca_jurisdiction_code: string | null
          eca_lang: string | null
          eca_name: string | null
          eca_no: string | null
          eca_partner_listbox_desc: string | null
          eca_payment_terms: string | null
          eca_phone: string | null
          eca_pin: string | null
          eca_pobox: string | null
          eca_pobox_city: string | null
          eca_postal_code: string | null
          eca_prod_attrs: string | null
          eca_reference_no: number | null
          eca_ship_addr_1: string | null
          eca_ship_addr_2: string | null
          eca_ship_city: string | null
          eca_ship_cond: string | null
          eca_ship_country: string | null
          eca_ship_pin: string | null
          eca_ship_state: string | null
          eca_so_dyn_addr_flag: string | null
          eca_state: string | null
          eca_street: string | null
          eca_street2: string | null
          eca_tel1: string | null
          eca_tel2: string | null
          eca_telebox_no: string | null
          eca_teletex: string | null
          eca_telex: string | null
          eca_title: string | null
          eca_transort_zone: string | null
          eca_unloading_indicator: string | null
          eca_web_addr: string | null
        }
        Insert: {
          eca_account_group?: string | null
          eca_addr_1?: string | null
          eca_addr_2?: string | null
          eca_addr_3?: string | null
          eca_addr_4?: string | null
          eca_block_code?: string | null
          eca_city?: string | null
          eca_company_name?: string | null
          eca_country?: string | null
          eca_country_code?: string | null
          eca_country1?: string | null
          eca_deletion_flag?: string | null
          eca_district?: string | null
          eca_email?: string | null
          eca_erp_update_flag?: string | null
          eca_ext1?: string | null
          eca_ext2?: string | null
          eca_ext3?: string | null
          eca_fax1?: string | null
          eca_incoterms?: string | null
          eca_is_business_partner?: string | null
          eca_jurisdiction_code?: string | null
          eca_lang?: string | null
          eca_name?: string | null
          eca_no?: string | null
          eca_partner_listbox_desc?: string | null
          eca_payment_terms?: string | null
          eca_phone?: string | null
          eca_pin?: string | null
          eca_pobox?: string | null
          eca_pobox_city?: string | null
          eca_postal_code?: string | null
          eca_prod_attrs?: string | null
          eca_reference_no?: number | null
          eca_ship_addr_1?: string | null
          eca_ship_addr_2?: string | null
          eca_ship_city?: string | null
          eca_ship_cond?: string | null
          eca_ship_country?: string | null
          eca_ship_pin?: string | null
          eca_ship_state?: string | null
          eca_so_dyn_addr_flag?: string | null
          eca_state?: string | null
          eca_street?: string | null
          eca_street2?: string | null
          eca_tel1?: string | null
          eca_tel2?: string | null
          eca_telebox_no?: string | null
          eca_teletex?: string | null
          eca_telex?: string | null
          eca_title?: string | null
          eca_transort_zone?: string | null
          eca_unloading_indicator?: string | null
          eca_web_addr?: string | null
        }
        Update: {
          eca_account_group?: string | null
          eca_addr_1?: string | null
          eca_addr_2?: string | null
          eca_addr_3?: string | null
          eca_addr_4?: string | null
          eca_block_code?: string | null
          eca_city?: string | null
          eca_company_name?: string | null
          eca_country?: string | null
          eca_country_code?: string | null
          eca_country1?: string | null
          eca_deletion_flag?: string | null
          eca_district?: string | null
          eca_email?: string | null
          eca_erp_update_flag?: string | null
          eca_ext1?: string | null
          eca_ext2?: string | null
          eca_ext3?: string | null
          eca_fax1?: string | null
          eca_incoterms?: string | null
          eca_is_business_partner?: string | null
          eca_jurisdiction_code?: string | null
          eca_lang?: string | null
          eca_name?: string | null
          eca_no?: string | null
          eca_partner_listbox_desc?: string | null
          eca_payment_terms?: string | null
          eca_phone?: string | null
          eca_pin?: string | null
          eca_pobox?: string | null
          eca_pobox_city?: string | null
          eca_postal_code?: string | null
          eca_prod_attrs?: string | null
          eca_reference_no?: number | null
          eca_ship_addr_1?: string | null
          eca_ship_addr_2?: string | null
          eca_ship_city?: string | null
          eca_ship_cond?: string | null
          eca_ship_country?: string | null
          eca_ship_pin?: string | null
          eca_ship_state?: string | null
          eca_so_dyn_addr_flag?: string | null
          eca_state?: string | null
          eca_street?: string | null
          eca_street2?: string | null
          eca_tel1?: string | null
          eca_tel2?: string | null
          eca_telebox_no?: string | null
          eca_teletex?: string | null
          eca_telex?: string | null
          eca_title?: string | null
          eca_transort_zone?: string | null
          eca_unloading_indicator?: string | null
          eca_web_addr?: string | null
        }
        Relationships: []
      }
      ezc_customer_itemcat: {
        Row: {
          eci_created_by: string | null
          eci_created_on: string | null
          eci_customer: string | null
          eci_ext1: string | null
          eci_ext2: string | null
          eci_ext3: string | null
          eci_itemcat: string | null
        }
        Insert: {
          eci_created_by?: string | null
          eci_created_on?: string | null
          eci_customer?: string | null
          eci_ext1?: string | null
          eci_ext2?: string | null
          eci_ext3?: string | null
          eci_itemcat?: string | null
        }
        Update: {
          eci_created_by?: string | null
          eci_created_on?: string | null
          eci_customer?: string | null
          eci_ext1?: string | null
          eci_ext2?: string | null
          eci_ext3?: string | null
          eci_itemcat?: string | null
        }
        Relationships: []
      }
      ezc_dataconv_productdetailcategorylist: {
        Row: {
          brandid: number | null
          brandname: string | null
          categoryid: number
          categoryname: string | null
          categorysort: number | null
          cleanpath: string | null
          dirtypath: string | null
          divisionid: number
          logtime: string
          productid: number
        }
        Insert: {
          brandid?: number | null
          brandname?: string | null
          categoryid: number
          categoryname?: string | null
          categorysort?: number | null
          cleanpath?: string | null
          dirtypath?: string | null
          divisionid: number
          logtime: string
          productid: number
        }
        Update: {
          brandid?: number | null
          brandname?: string | null
          categoryid?: number
          categoryname?: string | null
          categorysort?: number | null
          cleanpath?: string | null
          dirtypath?: string | null
          divisionid?: number
          logtime?: string
          productid?: number
        }
        Relationships: []
      }
      ezc_dataconv_sapmatdataholder: {
        Row: {
          currency: string | null
          def_del_plant: string | null
          delflag: string | null
          dist_channel: string | null
          division: string | null
          HIERARCHY: string | null
          item_cat_group: string | null
          logged_on: string
          mat_pric_group: string | null
          matdesc: string | null
          material: string | null
          material_group1: string | null
          material_group2: string | null
          material_group3: string | null
          material_group4: string | null
          material_group5: string | null
          quantity: number | null
          reserved_1: string | null
          reserved_10: string | null
          reserved_11: string | null
          reserved_2: string | null
          reserved_3: string | null
          reserved_4: string | null
          reserved_5: string | null
          reserved_6: string | null
          reserved_7: string | null
          reserved_8: string | null
          reserved_9: string | null
          sales_org: string | null
          sap_comm_group: string | null
          soip_category: string | null
          specs: string | null
          stdprice: number | null
          uofmeasure: string | null
          upcno: string | null
          volum: number | null
          xdch_status: string | null
        }
        Insert: {
          currency?: string | null
          def_del_plant?: string | null
          delflag?: string | null
          dist_channel?: string | null
          division?: string | null
          HIERARCHY?: string | null
          item_cat_group?: string | null
          logged_on: string
          mat_pric_group?: string | null
          matdesc?: string | null
          material?: string | null
          material_group1?: string | null
          material_group2?: string | null
          material_group3?: string | null
          material_group4?: string | null
          material_group5?: string | null
          quantity?: number | null
          reserved_1?: string | null
          reserved_10?: string | null
          reserved_11?: string | null
          reserved_2?: string | null
          reserved_3?: string | null
          reserved_4?: string | null
          reserved_5?: string | null
          reserved_6?: string | null
          reserved_7?: string | null
          reserved_8?: string | null
          reserved_9?: string | null
          sales_org?: string | null
          sap_comm_group?: string | null
          soip_category?: string | null
          specs?: string | null
          stdprice?: number | null
          uofmeasure?: string | null
          upcno?: string | null
          volum?: number | null
          xdch_status?: string | null
        }
        Update: {
          currency?: string | null
          def_del_plant?: string | null
          delflag?: string | null
          dist_channel?: string | null
          division?: string | null
          HIERARCHY?: string | null
          item_cat_group?: string | null
          logged_on?: string
          mat_pric_group?: string | null
          matdesc?: string | null
          material?: string | null
          material_group1?: string | null
          material_group2?: string | null
          material_group3?: string | null
          material_group4?: string | null
          material_group5?: string | null
          quantity?: number | null
          reserved_1?: string | null
          reserved_10?: string | null
          reserved_11?: string | null
          reserved_2?: string | null
          reserved_3?: string | null
          reserved_4?: string | null
          reserved_5?: string | null
          reserved_6?: string | null
          reserved_7?: string | null
          reserved_8?: string | null
          reserved_9?: string | null
          sales_org?: string | null
          sap_comm_group?: string | null
          soip_category?: string | null
          specs?: string | null
          stdprice?: number | null
          uofmeasure?: string | null
          upcno?: string | null
          volum?: number | null
          xdch_status?: string | null
        }
        Relationships: []
      }
      ezc_default_type_desc: {
        Row: {
          edtd_default_type: string | null
          edtd_desc: string | null
          edtd_lang: string | null
        }
        Insert: {
          edtd_default_type?: string | null
          edtd_desc?: string | null
          edtd_lang?: string | null
        }
        Update: {
          edtd_default_type?: string | null
          edtd_desc?: string | null
          edtd_lang?: string | null
        }
        Relationships: []
      }
      ezc_defaults_desc: {
        Row: {
          eudd_default_type: string | null
          eudd_defaults_desc: string | null
          eudd_is_master: string | null
          eudd_key: string | null
          eudd_lang: string | null
          eudd_sys_key: string | null
        }
        Insert: {
          eudd_default_type?: string | null
          eudd_defaults_desc?: string | null
          eudd_is_master?: string | null
          eudd_key?: string | null
          eudd_lang?: string | null
          eudd_sys_key?: string | null
        }
        Update: {
          eudd_default_type?: string | null
          eudd_defaults_desc?: string | null
          eudd_is_master?: string | null
          eudd_key?: string | null
          eudd_lang?: string | null
          eudd_sys_key?: string | null
        }
        Relationships: []
      }
      ezc_delegation_info: {
        Row: {
          edi_business_partner: string | null
          edi_delegate_to_user: string | null
          edi_original_user: string | null
          edi_procedure_type: string | null
          edi_valid_from: string | null
          edi_valid_to: string | null
        }
        Insert: {
          edi_business_partner?: string | null
          edi_delegate_to_user?: string | null
          edi_original_user?: string | null
          edi_procedure_type?: string | null
          edi_valid_from?: string | null
          edi_valid_to?: string | null
        }
        Update: {
          edi_business_partner?: string | null
          edi_delegate_to_user?: string | null
          edi_original_user?: string | null
          edi_procedure_type?: string | null
          edi_valid_from?: string | null
          edi_valid_to?: string | null
        }
        Relationships: []
      }
      ezc_delivery_schedules: {
        Row: {
          ezds_back_end_number: string | null
          ezds_back_itm_number: string | null
          ezds_back_sched_line: string | null
          ezds_con_date: string | null
          ezds_con_qty: number | null
          ezds_date_type: string | null
          ezds_doc_number: number | null
          ezds_ext1: string | null
          ezds_ext2: string | null
          ezds_gi_date: string | null
          ezds_gi_time: string | null
          ezds_itm_number: number | null
          ezds_load_date: string | null
          ezds_load_time: string | null
          ezds_ms_date: string | null
          ezds_ms_time: string | null
          ezds_refobjtype: string | null
          ezds_req_date: string | null
          ezds_req_dlv_bl: string | null
          ezds_req_qty: number | null
          ezds_req_time: string | null
          ezds_sched_line: number | null
          ezds_sched_type: string | null
          ezds_status: string | null
          ezds_tp_date: string | null
          ezds_tp_time: string | null
        }
        Insert: {
          ezds_back_end_number?: string | null
          ezds_back_itm_number?: string | null
          ezds_back_sched_line?: string | null
          ezds_con_date?: string | null
          ezds_con_qty?: number | null
          ezds_date_type?: string | null
          ezds_doc_number?: number | null
          ezds_ext1?: string | null
          ezds_ext2?: string | null
          ezds_gi_date?: string | null
          ezds_gi_time?: string | null
          ezds_itm_number?: number | null
          ezds_load_date?: string | null
          ezds_load_time?: string | null
          ezds_ms_date?: string | null
          ezds_ms_time?: string | null
          ezds_refobjtype?: string | null
          ezds_req_date?: string | null
          ezds_req_dlv_bl?: string | null
          ezds_req_qty?: number | null
          ezds_req_time?: string | null
          ezds_sched_line?: number | null
          ezds_sched_type?: string | null
          ezds_status?: string | null
          ezds_tp_date?: string | null
          ezds_tp_time?: string | null
        }
        Update: {
          ezds_back_end_number?: string | null
          ezds_back_itm_number?: string | null
          ezds_back_sched_line?: string | null
          ezds_con_date?: string | null
          ezds_con_qty?: number | null
          ezds_date_type?: string | null
          ezds_doc_number?: number | null
          ezds_ext1?: string | null
          ezds_ext2?: string | null
          ezds_gi_date?: string | null
          ezds_gi_time?: string | null
          ezds_itm_number?: number | null
          ezds_load_date?: string | null
          ezds_load_time?: string | null
          ezds_ms_date?: string | null
          ezds_ms_time?: string | null
          ezds_refobjtype?: string | null
          ezds_req_date?: string | null
          ezds_req_dlv_bl?: string | null
          ezds_req_qty?: number | null
          ezds_req_time?: string | null
          ezds_sched_line?: number | null
          ezds_sched_type?: string | null
          ezds_status?: string | null
          ezds_tp_date?: string | null
          ezds_tp_time?: string | null
        }
        Relationships: []
      }
      ezc_disclaimer_stamp: {
        Row: {
          time_stamp: string | null
          user_id: string | null
        }
        Insert: {
          time_stamp?: string | null
          user_id?: string | null
        }
        Update: {
          time_stamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ezc_discount_threshold: {
        Row: {
          edt_created_by: string | null
          edt_created_on: string | null
          edt_disc_type: string | null
          edt_ext1: string | null
          edt_ext2: string | null
          edt_ext3: string | null
          edt_mfr_id: string | null
          edt_prod_cat: string | null
          edt_syskey: string | null
          edt_th_no: string | null
          edt_threshold: number | null
        }
        Insert: {
          edt_created_by?: string | null
          edt_created_on?: string | null
          edt_disc_type?: string | null
          edt_ext1?: string | null
          edt_ext2?: string | null
          edt_ext3?: string | null
          edt_mfr_id?: string | null
          edt_prod_cat?: string | null
          edt_syskey?: string | null
          edt_th_no?: string | null
          edt_threshold?: number | null
        }
        Update: {
          edt_created_by?: string | null
          edt_created_on?: string | null
          edt_disc_type?: string | null
          edt_ext1?: string | null
          edt_ext2?: string | null
          edt_ext3?: string | null
          edt_mfr_id?: string | null
          edt_prod_cat?: string | null
          edt_syskey?: string | null
          edt_th_no?: string | null
          edt_threshold?: number | null
        }
        Relationships: []
      }
      ezc_dispatchinfo_header: {
        Row: {
          ezdi_carrier: string | null
          ezdi_created_by: string | null
          ezdi_created_on: string | null
          ezdi_dc_date: string | null
          ezdi_dc_nr: string | null
          ezdi_deliveryno: string | null
          ezdi_exp_arival_time: string | null
          ezdi_ext1: string | null
          ezdi_ext2: string | null
          ezdi_goods_received: string | null
          ezdi_inv_date: string | null
          ezdi_inv_num: string | null
          ezdi_last_mod_on: string | null
          ezdi_lr_rr_air_nr: string | null
          ezdi_shipment_date: string | null
          ezdi_shipto: string | null
          ezdi_so_date: string | null
          ezdi_so_num: number | null
          ezdi_soldto: string | null
          ezdi_status: string | null
          ezdi_syskey: string | null
          ezdi_text: string | null
        }
        Insert: {
          ezdi_carrier?: string | null
          ezdi_created_by?: string | null
          ezdi_created_on?: string | null
          ezdi_dc_date?: string | null
          ezdi_dc_nr?: string | null
          ezdi_deliveryno?: string | null
          ezdi_exp_arival_time?: string | null
          ezdi_ext1?: string | null
          ezdi_ext2?: string | null
          ezdi_goods_received?: string | null
          ezdi_inv_date?: string | null
          ezdi_inv_num?: string | null
          ezdi_last_mod_on?: string | null
          ezdi_lr_rr_air_nr?: string | null
          ezdi_shipment_date?: string | null
          ezdi_shipto?: string | null
          ezdi_so_date?: string | null
          ezdi_so_num?: number | null
          ezdi_soldto?: string | null
          ezdi_status?: string | null
          ezdi_syskey?: string | null
          ezdi_text?: string | null
        }
        Update: {
          ezdi_carrier?: string | null
          ezdi_created_by?: string | null
          ezdi_created_on?: string | null
          ezdi_dc_date?: string | null
          ezdi_dc_nr?: string | null
          ezdi_deliveryno?: string | null
          ezdi_exp_arival_time?: string | null
          ezdi_ext1?: string | null
          ezdi_ext2?: string | null
          ezdi_goods_received?: string | null
          ezdi_inv_date?: string | null
          ezdi_inv_num?: string | null
          ezdi_last_mod_on?: string | null
          ezdi_lr_rr_air_nr?: string | null
          ezdi_shipment_date?: string | null
          ezdi_shipto?: string | null
          ezdi_so_date?: string | null
          ezdi_so_num?: number | null
          ezdi_soldto?: string | null
          ezdi_status?: string | null
          ezdi_syskey?: string | null
          ezdi_text?: string | null
        }
        Relationships: []
      }
      ezc_dispatchinfo_lines: {
        Row: {
          ezdl_batchno: string | null
          ezdl_deliveryno: string | null
          ezdl_ext1: string | null
          ezdl_ext2: string | null
          ezdl_line_nr: number | null
          ezdl_lineref: number | null
          ezdl_mat_desc: string | null
          ezdl_mat_nr: string | null
          ezdl_plant: string | null
          ezdl_qty_shipped: number | null
          ezdl_receipts: number | null
          ezdl_refno: string | null
          ezdl_remarks: string | null
          ezdl_uom: string | null
        }
        Insert: {
          ezdl_batchno?: string | null
          ezdl_deliveryno?: string | null
          ezdl_ext1?: string | null
          ezdl_ext2?: string | null
          ezdl_line_nr?: number | null
          ezdl_lineref?: number | null
          ezdl_mat_desc?: string | null
          ezdl_mat_nr?: string | null
          ezdl_plant?: string | null
          ezdl_qty_shipped?: number | null
          ezdl_receipts?: number | null
          ezdl_refno?: string | null
          ezdl_remarks?: string | null
          ezdl_uom?: string | null
        }
        Update: {
          ezdl_batchno?: string | null
          ezdl_deliveryno?: string | null
          ezdl_ext1?: string | null
          ezdl_ext2?: string | null
          ezdl_line_nr?: number | null
          ezdl_lineref?: number | null
          ezdl_mat_desc?: string | null
          ezdl_mat_nr?: string | null
          ezdl_plant?: string | null
          ezdl_qty_shipped?: number | null
          ezdl_receipts?: number | null
          ezdl_refno?: string | null
          ezdl_remarks?: string | null
          ezdl_uom?: string | null
        }
        Relationships: []
      }
      ezc_document_texts: {
        Row: {
          edt_docno: string | null
          edt_doctype: string | null
          edt_key: string | null
          edt_syskey: string | null
          edt_value: string | null
        }
        Insert: {
          edt_docno?: string | null
          edt_doctype?: string | null
          edt_key?: string | null
          edt_syskey?: string | null
          edt_value?: string | null
        }
        Update: {
          edt_docno?: string | null
          edt_doctype?: string | null
          edt_key?: string | null
          edt_syskey?: string | null
          edt_value?: string | null
        }
        Relationships: []
      }
      ezc_documents: {
        Row: {
          ezd_created_at: string
          ezd_documentable_id: number | null
          ezd_documentable_type: string | null
          ezd_pdf_content_type: string | null
          ezd_pdf_file_name: string | null
          ezd_pdf_file_size: number | null
          ezd_pdf_updated_at: string | null
          ezd_title: string | null
          ezd_updated_at: string
          ezd_xls_content_type: string | null
          ezd_xls_file_name: string | null
          ezd_xls_file_size: number | null
          ezd_xls_updated_at: string | null
        }
        Insert: {
          ezd_created_at: string
          ezd_documentable_id?: number | null
          ezd_documentable_type?: string | null
          ezd_pdf_content_type?: string | null
          ezd_pdf_file_name?: string | null
          ezd_pdf_file_size?: number | null
          ezd_pdf_updated_at?: string | null
          ezd_title?: string | null
          ezd_updated_at: string
          ezd_xls_content_type?: string | null
          ezd_xls_file_name?: string | null
          ezd_xls_file_size?: number | null
          ezd_xls_updated_at?: string | null
        }
        Update: {
          ezd_created_at?: string
          ezd_documentable_id?: number | null
          ezd_documentable_type?: string | null
          ezd_pdf_content_type?: string | null
          ezd_pdf_file_name?: string | null
          ezd_pdf_file_size?: number | null
          ezd_pdf_updated_at?: string | null
          ezd_title?: string | null
          ezd_updated_at?: string
          ezd_xls_content_type?: string | null
          ezd_xls_file_name?: string | null
          ezd_xls_file_size?: number | null
          ezd_xls_updated_at?: string | null
        }
        Relationships: []
      }
      ezc_downtime_alert: {
        Row: {
          eda_created_on: string | null
          eda_end_date: string | null
          eda_end_time: string | null
          eda_message: string | null
          eda_start_date: string | null
          eda_start_time: string | null
        }
        Insert: {
          eda_created_on?: string | null
          eda_end_date?: string | null
          eda_end_time?: string | null
          eda_message?: string | null
          eda_start_date?: string | null
          eda_start_time?: string | null
        }
        Update: {
          eda_created_on?: string | null
          eda_end_date?: string | null
          eda_end_time?: string | null
          eda_message?: string | null
          eda_start_date?: string | null
          eda_start_time?: string | null
        }
        Relationships: []
      }
      ezc_equip_type_code: {
        Row: {
          eetc_equip_type_code: string | null
          eetc_rt_offset: number | null
          eetc_skills: string | null
        }
        Insert: {
          eetc_equip_type_code?: string | null
          eetc_rt_offset?: number | null
          eetc_skills?: string | null
        }
        Update: {
          eetc_equip_type_code?: string | null
          eetc_rt_offset?: number | null
          eetc_skills?: string | null
        }
        Relationships: []
      }
      ezc_equipment: {
        Row: {
          ee_address_code: string | null
          ee_buss_partner: string | null
          ee_contact_person: string | null
          ee_customer_name: string | null
          ee_department: string | null
          ee_derived_from: string | null
          ee_equip_type_code: string | null
          ee_equipment_code: string | null
          ee_install_date: string | null
          ee_manufacturer_id: string | null
          ee_model_code: string | null
          ee_oem_slno: string | null
          ee_pref_engineer: string | null
          ee_rt_offset: number | null
          ee_skills: string | null
          ee_warranty_code: string | null
          ee_warranty_eff_date: string | null
          ee_warranty_exp_date: string | null
        }
        Insert: {
          ee_address_code?: string | null
          ee_buss_partner?: string | null
          ee_contact_person?: string | null
          ee_customer_name?: string | null
          ee_department?: string | null
          ee_derived_from?: string | null
          ee_equip_type_code?: string | null
          ee_equipment_code?: string | null
          ee_install_date?: string | null
          ee_manufacturer_id?: string | null
          ee_model_code?: string | null
          ee_oem_slno?: string | null
          ee_pref_engineer?: string | null
          ee_rt_offset?: number | null
          ee_skills?: string | null
          ee_warranty_code?: string | null
          ee_warranty_eff_date?: string | null
          ee_warranty_exp_date?: string | null
        }
        Update: {
          ee_address_code?: string | null
          ee_buss_partner?: string | null
          ee_contact_person?: string | null
          ee_customer_name?: string | null
          ee_department?: string | null
          ee_derived_from?: string | null
          ee_equip_type_code?: string | null
          ee_equipment_code?: string | null
          ee_install_date?: string | null
          ee_manufacturer_id?: string | null
          ee_model_code?: string | null
          ee_oem_slno?: string | null
          ee_pref_engineer?: string | null
          ee_rt_offset?: number | null
          ee_skills?: string | null
          ee_warranty_code?: string | null
          ee_warranty_eff_date?: string | null
          ee_warranty_exp_date?: string | null
        }
        Relationships: []
      }
      ezc_erp_customer_auth: {
        Row: {
          eeca_auth_key: string | null
          eeca_auth_value: string | null
          eeca_no: string | null
        }
        Insert: {
          eeca_auth_key?: string | null
          eeca_auth_value?: string | null
          eeca_no?: string | null
        }
        Update: {
          eeca_auth_key?: string | null
          eeca_auth_value?: string | null
          eeca_no?: string | null
        }
        Relationships: []
      }
      ezc_erp_customer_defaults: {
        Row: {
          eecd_defaults_key: string | null
          eecd_defaults_value: string | null
          eecd_no: string | null
          eecd_sys_key: string | null
          eecd_user_id: string | null
        }
        Insert: {
          eecd_defaults_key?: string | null
          eecd_defaults_value?: string | null
          eecd_no?: string | null
          eecd_sys_key?: string | null
          eecd_user_id?: string | null
        }
        Update: {
          eecd_defaults_key?: string | null
          eecd_defaults_value?: string | null
          eecd_no?: string | null
          eecd_sys_key?: string | null
          eecd_user_id?: string | null
        }
        Relationships: []
      }
      ezc_erp_validation_routines: {
        Row: {
          eev_client: number | null
          eev_erp_container: string | null
          eev_erp_field: string | null
          eev_erp_routine_class: string | null
          eev_erp_routine_method: string | null
          eev_erp_routine_type: string | null
          eev_erp_structure: string | null
          eev_erp_system: string | null
          eev_erp_version: string | null
        }
        Insert: {
          eev_client?: number | null
          eev_erp_container?: string | null
          eev_erp_field?: string | null
          eev_erp_routine_class?: string | null
          eev_erp_routine_method?: string | null
          eev_erp_routine_type?: string | null
          eev_erp_structure?: string | null
          eev_erp_system?: string | null
          eev_erp_version?: string | null
        }
        Update: {
          eev_client?: number | null
          eev_erp_container?: string | null
          eev_erp_field?: string | null
          eev_erp_routine_class?: string | null
          eev_erp_routine_method?: string | null
          eev_erp_routine_type?: string | null
          eev_erp_structure?: string | null
          eev_erp_system?: string | null
          eev_erp_version?: string | null
        }
        Relationships: []
      }
      ezc_error_desc: {
        Row: {
          eed_error_code: number | null
          eed_error_text: string | null
          eed_lang: string | null
        }
        Insert: {
          eed_error_code?: number | null
          eed_error_text?: string | null
          eed_lang?: string | null
        }
        Update: {
          eed_error_code?: number | null
          eed_error_text?: string | null
          eed_lang?: string | null
        }
        Relationships: []
      }
      ezc_event_obj_history: {
        Row: {
          eeoh_activity_type: string | null
          eeoh_adverse_event_id: number | null
          eeoh_assigned_to_user_after_change: string | null
          eeoh_assigned_to_user_before_change: string | null
          eeoh_external_text: string | null
          eeoh_internal_text: string | null
          eeoh_status_after_change: string | null
          eeoh_status_before_change: string | null
          eeoh_time_stamp: string
        }
        Insert: {
          eeoh_activity_type?: string | null
          eeoh_adverse_event_id?: number | null
          eeoh_assigned_to_user_after_change?: string | null
          eeoh_assigned_to_user_before_change?: string | null
          eeoh_external_text?: string | null
          eeoh_internal_text?: string | null
          eeoh_status_after_change?: string | null
          eeoh_status_before_change?: string | null
          eeoh_time_stamp: string
        }
        Update: {
          eeoh_activity_type?: string | null
          eeoh_adverse_event_id?: number | null
          eeoh_assigned_to_user_after_change?: string | null
          eeoh_assigned_to_user_before_change?: string | null
          eeoh_external_text?: string | null
          eeoh_internal_text?: string | null
          eeoh_status_after_change?: string | null
          eeoh_status_before_change?: string | null
          eeoh_time_stamp?: string
        }
        Relationships: []
      }
      ezc_exchange_info: {
        Row: {
          eei_cat_area: string | null
          eei_client: number | null
          eei_created_by: string | null
          eei_created_date: string | null
          eei_created_time: string | null
          eei_cust_no: string | null
          eei_external_link: string | null
          eei_mat_no: string | null
          eei_mat_qty: number | null
          eei_price: number | null
          eei_pur_ord_no: string | null
          eei_pur_req: string | null
          eei_ref1: string | null
          eei_ref2: string | null
          eei_req_date: string | null
          eei_sales_ord_no: string | null
          eei_status: string | null
          eei_sys_no: number | null
          eei_uom: string | null
          eei_vend_no: string | null
        }
        Insert: {
          eei_cat_area?: string | null
          eei_client?: number | null
          eei_created_by?: string | null
          eei_created_date?: string | null
          eei_created_time?: string | null
          eei_cust_no?: string | null
          eei_external_link?: string | null
          eei_mat_no?: string | null
          eei_mat_qty?: number | null
          eei_price?: number | null
          eei_pur_ord_no?: string | null
          eei_pur_req?: string | null
          eei_ref1?: string | null
          eei_ref2?: string | null
          eei_req_date?: string | null
          eei_sales_ord_no?: string | null
          eei_status?: string | null
          eei_sys_no?: number | null
          eei_uom?: string | null
          eei_vend_no?: string | null
        }
        Update: {
          eei_cat_area?: string | null
          eei_client?: number | null
          eei_created_by?: string | null
          eei_created_date?: string | null
          eei_created_time?: string | null
          eei_cust_no?: string | null
          eei_external_link?: string | null
          eei_mat_no?: string | null
          eei_mat_qty?: number | null
          eei_price?: number | null
          eei_pur_ord_no?: string | null
          eei_pur_req?: string | null
          eei_ref1?: string | null
          eei_ref2?: string | null
          eei_req_date?: string | null
          eei_sales_ord_no?: string | null
          eei_status?: string | null
          eei_sys_no?: number | null
          eei_uom?: string | null
          eei_vend_no?: string | null
        }
        Relationships: []
      }
      ezc_eyeball_track_info: {
        Row: {
          eeti_date: string | null
          eeti_domain: string | null
          eeti_group: number | null
          eeti_hits: number | null
          eeti_option: number | null
          eeti_soldto: string | null
          eeti_syskey: string | null
          eeti_userid: string | null
          eeti_value1: string | null
          eeti_value2: string | null
          eeti_value3: string | null
        }
        Insert: {
          eeti_date?: string | null
          eeti_domain?: string | null
          eeti_group?: number | null
          eeti_hits?: number | null
          eeti_option?: number | null
          eeti_soldto?: string | null
          eeti_syskey?: string | null
          eeti_userid?: string | null
          eeti_value1?: string | null
          eeti_value2?: string | null
          eeti_value3?: string | null
        }
        Update: {
          eeti_date?: string | null
          eeti_domain?: string | null
          eeti_group?: number | null
          eeti_hits?: number | null
          eeti_option?: number | null
          eeti_soldto?: string | null
          eeti_syskey?: string | null
          eeti_userid?: string | null
          eeti_value1?: string | null
          eeti_value2?: string | null
          eeti_value3?: string | null
        }
        Relationships: []
      }
      ezc_fedex_freight_master: {
        Row: {
          effm_country_code: string | null
          effm_created_by: string | null
          effm_created_on: string | null
          effm_ext1: string | null
          effm_ext2: string | null
          effm_ext3: string | null
          effm_key: string | null
          effm_pack_type: string | null
          effm_price: number | null
          effm_stype_code: string | null
          effm_weight_inpounds: number | null
          effm_zone: string | null
        }
        Insert: {
          effm_country_code?: string | null
          effm_created_by?: string | null
          effm_created_on?: string | null
          effm_ext1?: string | null
          effm_ext2?: string | null
          effm_ext3?: string | null
          effm_key?: string | null
          effm_pack_type?: string | null
          effm_price?: number | null
          effm_stype_code?: string | null
          effm_weight_inpounds?: number | null
          effm_zone?: string | null
        }
        Update: {
          effm_country_code?: string | null
          effm_created_by?: string | null
          effm_created_on?: string | null
          effm_ext1?: string | null
          effm_ext2?: string | null
          effm_ext3?: string | null
          effm_key?: string | null
          effm_pack_type?: string | null
          effm_price?: number | null
          effm_stype_code?: string | null
          effm_weight_inpounds?: number | null
          effm_zone?: string | null
        }
        Relationships: []
      }
      ezc_fedex_servicetype: {
        Row: {
          efs_created_by: string | null
          efs_created_on: string | null
          efs_ext1: string | null
          efs_ext2: string | null
          efs_ext3: string | null
          efs_stype_code: string | null
          efs_stype_desc: string | null
        }
        Insert: {
          efs_created_by?: string | null
          efs_created_on?: string | null
          efs_ext1?: string | null
          efs_ext2?: string | null
          efs_ext3?: string | null
          efs_stype_code?: string | null
          efs_stype_desc?: string | null
        }
        Update: {
          efs_created_by?: string | null
          efs_created_on?: string | null
          efs_ext1?: string | null
          efs_ext2?: string | null
          efs_ext3?: string | null
          efs_stype_code?: string | null
          efs_stype_desc?: string | null
        }
        Relationships: []
      }
      ezc_fedex_zonemap: {
        Row: {
          efz_country_code: string | null
          efz_created_by: string | null
          efz_created_on: string | null
          efz_ext1: string | null
          efz_ext2: string | null
          efz_ext3: string | null
          efz_from_zip: string | null
          efz_id: number | null
          efz_modified_by: string | null
          efz_modified_on: string | null
          efz_to_zip: string | null
          efz_zone: string | null
        }
        Insert: {
          efz_country_code?: string | null
          efz_created_by?: string | null
          efz_created_on?: string | null
          efz_ext1?: string | null
          efz_ext2?: string | null
          efz_ext3?: string | null
          efz_from_zip?: string | null
          efz_id?: number | null
          efz_modified_by?: string | null
          efz_modified_on?: string | null
          efz_to_zip?: string | null
          efz_zone?: string | null
        }
        Update: {
          efz_country_code?: string | null
          efz_created_by?: string | null
          efz_created_on?: string | null
          efz_ext1?: string | null
          efz_ext2?: string | null
          efz_ext3?: string | null
          efz_from_zip?: string | null
          efz_id?: number | null
          efz_modified_by?: string | null
          efz_modified_on?: string | null
          efz_to_zip?: string | null
          efz_zone?: string | null
        }
        Relationships: []
      }
      ezc_fired_triggers: {
        Row: {
          entry_id: string | null
          fired_time: number
          instance_name: string | null
          is_stateful: string | null
          is_volatile: string | null
          job_group: string | null
          job_name: string | null
          priority: number
          requests_recovery: string | null
          state: string | null
          trigger_group: string | null
          trigger_name: string | null
        }
        Insert: {
          entry_id?: string | null
          fired_time: number
          instance_name?: string | null
          is_stateful?: string | null
          is_volatile?: string | null
          job_group?: string | null
          job_name?: string | null
          priority: number
          requests_recovery?: string | null
          state?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Update: {
          entry_id?: string | null
          fired_time?: number
          instance_name?: string | null
          is_stateful?: string | null
          is_volatile?: string | null
          job_group?: string | null
          job_name?: string | null
          priority?: number
          requests_recovery?: string | null
          state?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      ezc_folder_info: {
        Row: {
          efi_client: number | null
          efi_created_by: string | null
          efi_folder_id: number | null
          efi_folder_name: string | null
          efi_lang: string | null
        }
        Insert: {
          efi_client?: number | null
          efi_created_by?: string | null
          efi_folder_id?: number | null
          efi_folder_name?: string | null
          efi_lang?: string | null
        }
        Update: {
          efi_client?: number | null
          efi_created_by?: string | null
          efi_folder_id?: number | null
          efi_folder_name?: string | null
          efi_lang?: string | null
        }
        Relationships: []
      }
      ezc_forum: {
        Row: {
          efa_client: number | null
          efa_created_by: string | null
          efa_dspl_id: string | null
          efa_dspl_level: number | null
          efa_forum_id: string | null
          efa_last_number: number | null
          efa_lnk_ext_info: string | null
          efa_msg_content1: string | null
          efa_msg_content2: string | null
          efa_msg_creation_date: string | null
          efa_msg_creation_time: string | null
          efa_msg_flag: string | null
          efa_msg_header: string | null
          efa_msg_id: string | null
          efa_msg_thread: string | null
          efa_msg_type: string | null
        }
        Insert: {
          efa_client?: number | null
          efa_created_by?: string | null
          efa_dspl_id?: string | null
          efa_dspl_level?: number | null
          efa_forum_id?: string | null
          efa_last_number?: number | null
          efa_lnk_ext_info?: string | null
          efa_msg_content1?: string | null
          efa_msg_content2?: string | null
          efa_msg_creation_date?: string | null
          efa_msg_creation_time?: string | null
          efa_msg_flag?: string | null
          efa_msg_header?: string | null
          efa_msg_id?: string | null
          efa_msg_thread?: string | null
          efa_msg_type?: string | null
        }
        Update: {
          efa_client?: number | null
          efa_created_by?: string | null
          efa_dspl_id?: string | null
          efa_dspl_level?: number | null
          efa_forum_id?: string | null
          efa_last_number?: number | null
          efa_lnk_ext_info?: string | null
          efa_msg_content1?: string | null
          efa_msg_content2?: string | null
          efa_msg_creation_date?: string | null
          efa_msg_creation_time?: string | null
          efa_msg_flag?: string | null
          efa_msg_header?: string | null
          efa_msg_id?: string | null
          efa_msg_thread?: string | null
          efa_msg_type?: string | null
        }
        Relationships: []
      }
      ezc_forum_info: {
        Row: {
          efi_access_indicator: string | null
          efi_client: number | null
          efi_created_by: string | null
          efi_creation_date: string | null
          efi_creation_time: string | null
          efi_forum_id: string | null
          efi_forum_moderator: string | null
          efi_forum_name: string | null
          efi_language: string | null
        }
        Insert: {
          efi_access_indicator?: string | null
          efi_client?: number | null
          efi_created_by?: string | null
          efi_creation_date?: string | null
          efi_creation_time?: string | null
          efi_forum_id?: string | null
          efi_forum_moderator?: string | null
          efi_forum_name?: string | null
          efi_language?: string | null
        }
        Update: {
          efi_access_indicator?: string | null
          efi_client?: number | null
          efi_created_by?: string | null
          efi_creation_date?: string | null
          efi_creation_time?: string | null
          efi_forum_id?: string | null
          efi_forum_moderator?: string | null
          efi_forum_name?: string | null
          efi_language?: string | null
        }
        Relationships: []
      }
      ezc_forum_subscription: {
        Row: {
          efs_client: number | null
          efs_forum_id: string | null
          efs_sub_date: string | null
          efs_sub_time: string | null
          efs_sub_user_id: string | null
        }
        Insert: {
          efs_client?: number | null
          efs_forum_id?: string | null
          efs_sub_date?: string | null
          efs_sub_time?: string | null
          efs_sub_user_id?: string | null
        }
        Update: {
          efs_client?: number | null
          efs_forum_id?: string | null
          efs_sub_date?: string | null
          efs_sub_time?: string | null
          efs_sub_user_id?: string | null
        }
        Relationships: []
      }
      ezc_group_auth: {
        Row: {
          ega_auth_key: string | null
          ega_auth_value: string | null
          ega_group_id: string | null
        }
        Insert: {
          ega_auth_key?: string | null
          ega_auth_value?: string | null
          ega_group_id?: string | null
        }
        Update: {
          ega_auth_key?: string | null
          ega_auth_value?: string | null
          ega_group_id?: string | null
        }
        Relationships: []
      }
      ezc_group_defaults: {
        Row: {
          egd_group_id: string | null
          egd_key: string | null
          egd_value: string | null
        }
        Insert: {
          egd_group_id?: string | null
          egd_key?: string | null
          egd_value?: string | null
        }
        Update: {
          egd_group_id?: string | null
          egd_key?: string | null
          egd_value?: string | null
        }
        Relationships: []
      }
      ezc_hierarchy_structure: {
        Row: {
          ehs_level: number | null
          ehs_offset: number | null
          ehs_sys_no: number | null
        }
        Insert: {
          ehs_level?: number | null
          ehs_offset?: number | null
          ehs_sys_no?: number | null
        }
        Update: {
          ehs_level?: number | null
          ehs_offset?: number | null
          ehs_sys_no?: number | null
        }
        Relationships: []
      }
      ezc_inc_num: {
        Row: {
          inc_num: string | null
        }
        Insert: {
          inc_num?: string | null
        }
        Update: {
          inc_num?: string | null
        }
        Relationships: []
      }
      ezc_job_control: {
        Row: {
          ejc_buss_partner: string | null
          ejc_change_date: number | null
          ejc_change_time: number | null
          ejc_changed_by: string | null
          ejc_client: number | null
          ejc_creation_date: number | null
          ejc_creation_time: number | null
          ejc_expiry_date: number | null
          ejc_file_path: string | null
          ejc_job_id: string | null
          ejc_job_type: string | null
          ejc_start_date: number | null
          ejc_start_time: number | null
          ejc_status: string | null
          ejc_time_intreval: number | null
          ejc_time_unit: string | null
          ejc_transaction: string | null
          ejc_user_id: string | null
          ejs_completion_needed: string | null
          ejs_completion_time: number | null
          ejs_confirmation_needed: string | null
          ejs_priority_code: string | null
          ejs_responce_type: string | null
          ejs_subscription_flag: string | null
        }
        Insert: {
          ejc_buss_partner?: string | null
          ejc_change_date?: number | null
          ejc_change_time?: number | null
          ejc_changed_by?: string | null
          ejc_client?: number | null
          ejc_creation_date?: number | null
          ejc_creation_time?: number | null
          ejc_expiry_date?: number | null
          ejc_file_path?: string | null
          ejc_job_id?: string | null
          ejc_job_type?: string | null
          ejc_start_date?: number | null
          ejc_start_time?: number | null
          ejc_status?: string | null
          ejc_time_intreval?: number | null
          ejc_time_unit?: string | null
          ejc_transaction?: string | null
          ejc_user_id?: string | null
          ejs_completion_needed?: string | null
          ejs_completion_time?: number | null
          ejs_confirmation_needed?: string | null
          ejs_priority_code?: string | null
          ejs_responce_type?: string | null
          ejs_subscription_flag?: string | null
        }
        Update: {
          ejc_buss_partner?: string | null
          ejc_change_date?: number | null
          ejc_change_time?: number | null
          ejc_changed_by?: string | null
          ejc_client?: number | null
          ejc_creation_date?: number | null
          ejc_creation_time?: number | null
          ejc_expiry_date?: number | null
          ejc_file_path?: string | null
          ejc_job_id?: string | null
          ejc_job_type?: string | null
          ejc_start_date?: number | null
          ejc_start_time?: number | null
          ejc_status?: string | null
          ejc_time_intreval?: number | null
          ejc_time_unit?: string | null
          ejc_transaction?: string | null
          ejc_user_id?: string | null
          ejs_completion_needed?: string | null
          ejs_completion_time?: number | null
          ejs_confirmation_needed?: string | null
          ejs_priority_code?: string | null
          ejs_responce_type?: string | null
          ejs_subscription_flag?: string | null
        }
        Relationships: []
      }
      ezc_job_description: {
        Row: {
          ejd_job_description: string | null
          ejd_job_id: string | null
          ejd_job_language: string | null
        }
        Insert: {
          ejd_job_description?: string | null
          ejd_job_id?: string | null
          ejd_job_language?: string | null
        }
        Update: {
          ejd_job_description?: string | null
          ejd_job_id?: string | null
          ejd_job_language?: string | null
        }
        Relationships: []
      }
      ezc_job_details: {
        Row: {
          description: string | null
          is_durable: string | null
          is_stateful: string | null
          is_volatile: string | null
          job_class_name: string | null
          job_data: string | null
          job_group: string | null
          job_name: string | null
          requests_recovery: string | null
        }
        Insert: {
          description?: string | null
          is_durable?: string | null
          is_stateful?: string | null
          is_volatile?: string | null
          job_class_name?: string | null
          job_data?: string | null
          job_group?: string | null
          job_name?: string | null
          requests_recovery?: string | null
        }
        Update: {
          description?: string | null
          is_durable?: string | null
          is_stateful?: string | null
          is_volatile?: string | null
          job_class_name?: string | null
          job_data?: string | null
          job_group?: string | null
          job_name?: string | null
          requests_recovery?: string | null
        }
        Relationships: []
      }
      ezc_job_history: {
        Row: {
          ejh_buss_partner: string | null
          ejh_client: string | null
          ejh_date: string | null
          ejh_exceptions1: string | null
          ejh_exceptions2: string | null
          ejh_exceptions3: string | null
          ejh_exceptions4: string | null
          ejh_exec_user_id: string | null
          ejh_job_id: string | null
          ejh_job_type: string | null
          ejh_time: string | null
          ejh_user_id: string | null
        }
        Insert: {
          ejh_buss_partner?: string | null
          ejh_client?: string | null
          ejh_date?: string | null
          ejh_exceptions1?: string | null
          ejh_exceptions2?: string | null
          ejh_exceptions3?: string | null
          ejh_exceptions4?: string | null
          ejh_exec_user_id?: string | null
          ejh_job_id?: string | null
          ejh_job_type?: string | null
          ejh_time?: string | null
          ejh_user_id?: string | null
        }
        Update: {
          ejh_buss_partner?: string | null
          ejh_client?: string | null
          ejh_date?: string | null
          ejh_exceptions1?: string | null
          ejh_exceptions2?: string | null
          ejh_exceptions3?: string | null
          ejh_exceptions4?: string | null
          ejh_exec_user_id?: string | null
          ejh_job_id?: string | null
          ejh_job_type?: string | null
          ejh_time?: string | null
          ejh_user_id?: string | null
        }
        Relationships: []
      }
      ezc_job_listeners: {
        Row: {
          job_group: string | null
          job_listener: string | null
          job_name: string | null
        }
        Insert: {
          job_group?: string | null
          job_listener?: string | null
          job_name?: string | null
        }
        Update: {
          job_group?: string | null
          job_listener?: string | null
          job_name?: string | null
        }
        Relationships: []
      }
      ezc_job_params: {
        Row: {
          ejb_busines_partner: string | null
          ejb_client: string | null
          ejb_from_value: string | null
          ejb_job_id: string | null
          ejb_job_type: string | null
          ejb_parameter_name: string | null
          ejb_to_value: string | null
          ejb_user_id: string | null
        }
        Insert: {
          ejb_busines_partner?: string | null
          ejb_client?: string | null
          ejb_from_value?: string | null
          ejb_job_id?: string | null
          ejb_job_type?: string | null
          ejb_parameter_name?: string | null
          ejb_to_value?: string | null
          ejb_user_id?: string | null
        }
        Update: {
          ejb_busines_partner?: string | null
          ejb_client?: string | null
          ejb_from_value?: string | null
          ejb_job_id?: string | null
          ejb_job_type?: string | null
          ejb_parameter_name?: string | null
          ejb_to_value?: string | null
          ejb_user_id?: string | null
        }
        Relationships: []
      }
      ezc_job_schedule: {
        Row: {
          ejs_buss_partner: string | null
          ejs_change_date: string | null
          ejs_change_time: string | null
          ejs_changed_by: string | null
          ejs_client: string | null
          ejs_completion_needed: string | null
          ejs_confirmation_needed: string | null
          ejs_expire_date: string | null
          ejs_file_path: string | null
          ejs_job_id: string | null
          ejs_job_type: string | null
          ejs_responce_type: string | null
          ejs_start_date: string | null
          ejs_start_time: string | null
          ejs_status: string | null
          ejs_subscription_flag: string | null
          ejs_time_interval: number | null
          ejs_time_unit: string | null
          ejs_transaction: string | null
          ejs_user_id: string | null
        }
        Insert: {
          ejs_buss_partner?: string | null
          ejs_change_date?: string | null
          ejs_change_time?: string | null
          ejs_changed_by?: string | null
          ejs_client?: string | null
          ejs_completion_needed?: string | null
          ejs_confirmation_needed?: string | null
          ejs_expire_date?: string | null
          ejs_file_path?: string | null
          ejs_job_id?: string | null
          ejs_job_type?: string | null
          ejs_responce_type?: string | null
          ejs_start_date?: string | null
          ejs_start_time?: string | null
          ejs_status?: string | null
          ejs_subscription_flag?: string | null
          ejs_time_interval?: number | null
          ejs_time_unit?: string | null
          ejs_transaction?: string | null
          ejs_user_id?: string | null
        }
        Update: {
          ejs_buss_partner?: string | null
          ejs_change_date?: string | null
          ejs_change_time?: string | null
          ejs_changed_by?: string | null
          ejs_client?: string | null
          ejs_completion_needed?: string | null
          ejs_confirmation_needed?: string | null
          ejs_expire_date?: string | null
          ejs_file_path?: string | null
          ejs_job_id?: string | null
          ejs_job_type?: string | null
          ejs_responce_type?: string | null
          ejs_start_date?: string | null
          ejs_start_time?: string | null
          ejs_status?: string | null
          ejs_subscription_flag?: string | null
          ejs_time_interval?: number | null
          ejs_time_unit?: string | null
          ejs_transaction?: string | null
          ejs_user_id?: string | null
        }
        Relationships: []
      }
      ezc_labor_rates: {
        Row: {
          elrt_labor_amount: number | null
          elrt_labor_amount_currency: string | null
          elrt_labor_amount_unit: string | null
          elrt_labor_rate_base: string | null
          elrt_labor_rate_code: string | null
        }
        Insert: {
          elrt_labor_amount?: number | null
          elrt_labor_amount_currency?: string | null
          elrt_labor_amount_unit?: string | null
          elrt_labor_rate_base?: string | null
          elrt_labor_rate_code?: string | null
        }
        Update: {
          elrt_labor_amount?: number | null
          elrt_labor_amount_currency?: string | null
          elrt_labor_amount_unit?: string | null
          elrt_labor_rate_base?: string | null
          elrt_labor_rate_code?: string | null
        }
        Relationships: []
      }
      ezc_labor_reqmt: {
        Row: {
          ezlr_actual_cost_rate: number | null
          ezlr_actual_date: string | null
          ezlr_actual_selling_rate: number | null
          ezlr_actual_time: number | null
          ezlr_closed_at: string | null
          ezlr_estimated_cost_rate: number | null
          ezlr_estimated_selling_rate: number | null
          ezlr_estimated_time_required: number | null
          ezlr_operation_id: number | null
          ezlr_order_id: number | null
          ezlr_rate_currency: string | null
          ezlr_rate_unit: string | null
          ezlr_reqmt_id: number | null
          ezlr_required_resource: number | null
          ezlr_scheduled_date: string | null
          ezlr_skill_code: string | null
          ezlr_started_at: string | null
          ezlr_time_unit: string | null
        }
        Insert: {
          ezlr_actual_cost_rate?: number | null
          ezlr_actual_date?: string | null
          ezlr_actual_selling_rate?: number | null
          ezlr_actual_time?: number | null
          ezlr_closed_at?: string | null
          ezlr_estimated_cost_rate?: number | null
          ezlr_estimated_selling_rate?: number | null
          ezlr_estimated_time_required?: number | null
          ezlr_operation_id?: number | null
          ezlr_order_id?: number | null
          ezlr_rate_currency?: string | null
          ezlr_rate_unit?: string | null
          ezlr_reqmt_id?: number | null
          ezlr_required_resource?: number | null
          ezlr_scheduled_date?: string | null
          ezlr_skill_code?: string | null
          ezlr_started_at?: string | null
          ezlr_time_unit?: string | null
        }
        Update: {
          ezlr_actual_cost_rate?: number | null
          ezlr_actual_date?: string | null
          ezlr_actual_selling_rate?: number | null
          ezlr_actual_time?: number | null
          ezlr_closed_at?: string | null
          ezlr_estimated_cost_rate?: number | null
          ezlr_estimated_selling_rate?: number | null
          ezlr_estimated_time_required?: number | null
          ezlr_operation_id?: number | null
          ezlr_order_id?: number | null
          ezlr_rate_currency?: string | null
          ezlr_rate_unit?: string | null
          ezlr_reqmt_id?: number | null
          ezlr_required_resource?: number | null
          ezlr_scheduled_date?: string | null
          ezlr_skill_code?: string | null
          ezlr_started_at?: string | null
          ezlr_time_unit?: string | null
        }
        Relationships: []
      }
      ezc_lang_keys: {
        Row: {
          elk_iso_lang: string | null
          elk_lang: string | null
          elk_lang_desc: string | null
        }
        Insert: {
          elk_iso_lang?: string | null
          elk_lang?: string | null
          elk_lang_desc?: string | null
        }
        Update: {
          elk_iso_lang?: string | null
          elk_lang?: string | null
          elk_lang_desc?: string | null
        }
        Relationships: []
      }
      ezc_locks: {
        Row: {
          lock_name: string | null
        }
        Insert: {
          lock_name?: string | null
        }
        Update: {
          lock_name?: string | null
        }
        Relationships: []
      }
      ezc_mail_groups: {
        Row: {
          emg_auth_reqd: string | null
          emg_context_factory: string | null
          emg_debug: string | null
          emg_destination_factory: string | null
          emg_destination_name: string | null
          emg_destination_type: string | null
          emg_exceptionlistener: string | null
          emg_from: string | null
          emg_groupdesc: string | null
          emg_groupid: string | null
          emg_host: string | null
          emg_incoming_port: string | null
          emg_incoming_protocol: string | null
          emg_jmsenabled: string | null
          emg_logfile: string | null
          emg_outgoing_port: string | null
          emg_password: string | null
          emg_provider_url: string | null
          emg_support_incoming: string | null
          emg_support_outgoing: string | null
          emg_user_id: string | null
        }
        Insert: {
          emg_auth_reqd?: string | null
          emg_context_factory?: string | null
          emg_debug?: string | null
          emg_destination_factory?: string | null
          emg_destination_name?: string | null
          emg_destination_type?: string | null
          emg_exceptionlistener?: string | null
          emg_from?: string | null
          emg_groupdesc?: string | null
          emg_groupid?: string | null
          emg_host?: string | null
          emg_incoming_port?: string | null
          emg_incoming_protocol?: string | null
          emg_jmsenabled?: string | null
          emg_logfile?: string | null
          emg_outgoing_port?: string | null
          emg_password?: string | null
          emg_provider_url?: string | null
          emg_support_incoming?: string | null
          emg_support_outgoing?: string | null
          emg_user_id?: string | null
        }
        Update: {
          emg_auth_reqd?: string | null
          emg_context_factory?: string | null
          emg_debug?: string | null
          emg_destination_factory?: string | null
          emg_destination_name?: string | null
          emg_destination_type?: string | null
          emg_exceptionlistener?: string | null
          emg_from?: string | null
          emg_groupdesc?: string | null
          emg_groupid?: string | null
          emg_host?: string | null
          emg_incoming_port?: string | null
          emg_incoming_protocol?: string | null
          emg_jmsenabled?: string | null
          emg_logfile?: string | null
          emg_outgoing_port?: string | null
          emg_password?: string | null
          emg_provider_url?: string | null
          emg_support_incoming?: string | null
          emg_support_outgoing?: string | null
          emg_user_id?: string | null
        }
        Relationships: []
      }
      ezc_main_order_operation: {
        Row: {
          ezmoop_actual_duration: number | null
          ezmoop_actual_end_date: string | null
          ezmoop_actual_start_date: string | null
          ezmoop_duration_unit: string | null
          ezmoop_estimated_duration: number | null
          ezmoop_operation_id: number | null
          ezmoop_operation_status: string | null
          ezmoop_operation_type: string | null
          ezmoop_order_id: number | null
          ezmoop_plan_end_date: string | null
          ezmoop_plan_start_date: string | null
          ezmoop_primary_engineer: string | null
          ezmoop_remaining_duration: number | null
          ezmoop_schedule_end_date: string | null
          ezmoop_schedule_start_date: string | null
          ezmoop_service_area: string | null
          ezmoop_service_center: string | null
        }
        Insert: {
          ezmoop_actual_duration?: number | null
          ezmoop_actual_end_date?: string | null
          ezmoop_actual_start_date?: string | null
          ezmoop_duration_unit?: string | null
          ezmoop_estimated_duration?: number | null
          ezmoop_operation_id?: number | null
          ezmoop_operation_status?: string | null
          ezmoop_operation_type?: string | null
          ezmoop_order_id?: number | null
          ezmoop_plan_end_date?: string | null
          ezmoop_plan_start_date?: string | null
          ezmoop_primary_engineer?: string | null
          ezmoop_remaining_duration?: number | null
          ezmoop_schedule_end_date?: string | null
          ezmoop_schedule_start_date?: string | null
          ezmoop_service_area?: string | null
          ezmoop_service_center?: string | null
        }
        Update: {
          ezmoop_actual_duration?: number | null
          ezmoop_actual_end_date?: string | null
          ezmoop_actual_start_date?: string | null
          ezmoop_duration_unit?: string | null
          ezmoop_estimated_duration?: number | null
          ezmoop_operation_id?: number | null
          ezmoop_operation_status?: string | null
          ezmoop_operation_type?: string | null
          ezmoop_order_id?: number | null
          ezmoop_plan_end_date?: string | null
          ezmoop_plan_start_date?: string | null
          ezmoop_primary_engineer?: string | null
          ezmoop_remaining_duration?: number | null
          ezmoop_schedule_end_date?: string | null
          ezmoop_schedule_start_date?: string | null
          ezmoop_service_area?: string | null
          ezmoop_service_center?: string | null
        }
        Relationships: []
      }
      ezc_maint_act_group: {
        Row: {
          emag_description: string | null
          emag_grp_code: number | null
          emag_grp_stage: string | null
          emag_lang: string | null
        }
        Insert: {
          emag_description?: string | null
          emag_grp_code?: number | null
          emag_grp_stage?: string | null
          emag_lang?: string | null
        }
        Update: {
          emag_description?: string | null
          emag_grp_code?: number | null
          emag_grp_stage?: string | null
          emag_lang?: string | null
        }
        Relationships: []
      }
      ezc_maint_act_grp_activities: {
        Row: {
          emaga_activity_code: string | null
          emaga_grp_code: number | null
          emaga_offset: number | null
          emaga_seq_number: number | null
        }
        Insert: {
          emaga_activity_code?: string | null
          emaga_grp_code?: number | null
          emaga_offset?: number | null
          emaga_seq_number?: number | null
        }
        Update: {
          emaga_activity_code?: string | null
          emaga_grp_code?: number | null
          emaga_offset?: number | null
          emaga_seq_number?: number | null
        }
        Relationships: []
      }
      ezc_mainte_activity_skills: {
        Row: {
          emas_activity_code: string | null
          emas_activity_stage: string | null
          emas_skillcode: string | null
        }
        Insert: {
          emas_activity_code?: string | null
          emas_activity_stage?: string | null
          emas_skillcode?: string | null
        }
        Update: {
          emas_activity_code?: string | null
          emas_activity_stage?: string | null
          emas_skillcode?: string | null
        }
        Relationships: []
      }
      ezc_mainte_activity_tools: {
        Row: {
          emat_activity_code: string | null
          emat_activity_stage: string | null
          emat_seq_number: number | null
          emat_tool_code: string | null
        }
        Insert: {
          emat_activity_code?: string | null
          emat_activity_stage?: string | null
          emat_seq_number?: number | null
          emat_tool_code?: string | null
        }
        Update: {
          emat_activity_code?: string | null
          emat_activity_stage?: string | null
          emat_seq_number?: number | null
          emat_tool_code?: string | null
        }
        Relationships: []
      }
      ezc_mainte_labor_requirements: {
        Row: {
          emlr_activity_code: string | null
          emlr_activity_stage: string | null
          emlr_labor_code: string | null
          emlr_resources_reqd: number | null
          emlr_seq_number: number | null
          emlr_time_reqd: number | null
          emlr_time_unit: string | null
        }
        Insert: {
          emlr_activity_code?: string | null
          emlr_activity_stage?: string | null
          emlr_labor_code?: string | null
          emlr_resources_reqd?: number | null
          emlr_seq_number?: number | null
          emlr_time_reqd?: number | null
          emlr_time_unit?: string | null
        }
        Update: {
          emlr_activity_code?: string | null
          emlr_activity_stage?: string | null
          emlr_labor_code?: string | null
          emlr_resources_reqd?: number | null
          emlr_seq_number?: number | null
          emlr_time_reqd?: number | null
          emlr_time_unit?: string | null
        }
        Relationships: []
      }
      ezc_mainte_mat_requirements: {
        Row: {
          emmr_activity_code: string | null
          emmr_activity_stage: string | null
          emmr_prod_category: string | null
          emmr_prod_code: number | null
          emmr_qty_unit: string | null
          emmr_quantity: number | null
          emmr_seq_number: number | null
          emmr_spare_code: number | null
        }
        Insert: {
          emmr_activity_code?: string | null
          emmr_activity_stage?: string | null
          emmr_prod_category?: string | null
          emmr_prod_code?: number | null
          emmr_qty_unit?: string | null
          emmr_quantity?: number | null
          emmr_seq_number?: number | null
          emmr_spare_code?: number | null
        }
        Update: {
          emmr_activity_code?: string | null
          emmr_activity_stage?: string | null
          emmr_prod_category?: string | null
          emmr_prod_code?: number | null
          emmr_qty_unit?: string | null
          emmr_quantity?: number | null
          emmr_seq_number?: number | null
          emmr_spare_code?: number | null
        }
        Relationships: []
      }
      ezc_mainte_other_requirements: {
        Row: {
          emor_activity_code: string | null
          emor_activity_stage: string | null
          emor_desc: string | null
          emor_qty_reqd: number | null
          emor_qty_unit: string | null
          emor_seq_number: number | null
          emor_type: string | null
        }
        Insert: {
          emor_activity_code?: string | null
          emor_activity_stage?: string | null
          emor_desc?: string | null
          emor_qty_reqd?: number | null
          emor_qty_unit?: string | null
          emor_seq_number?: number | null
          emor_type?: string | null
        }
        Update: {
          emor_activity_code?: string | null
          emor_activity_stage?: string | null
          emor_desc?: string | null
          emor_qty_reqd?: number | null
          emor_qty_unit?: string | null
          emor_seq_number?: number | null
          emor_type?: string | null
        }
        Relationships: []
      }
      ezc_maintenance_activity: {
        Row: {
          ema_activity_code: string | null
          ema_activity_stage: string | null
          ema_check_list: string | null
          ema_desc: string | null
          ema_general_text: string | null
          ema_lang: string | null
          ema_special_instructions: string | null
        }
        Insert: {
          ema_activity_code?: string | null
          ema_activity_stage?: string | null
          ema_check_list?: string | null
          ema_desc?: string | null
          ema_general_text?: string | null
          ema_lang?: string | null
          ema_special_instructions?: string | null
        }
        Update: {
          ema_activity_code?: string | null
          ema_activity_stage?: string | null
          ema_check_list?: string | null
          ema_desc?: string | null
          ema_general_text?: string | null
          ema_lang?: string | null
          ema_special_instructions?: string | null
        }
        Relationships: []
      }
      ezc_maintenance_order: {
        Row: {
          emo_actual_amount: number | null
          emo_actual_duration: number | null
          emo_actual_end_date: string | null
          emo_actual_start_date: string | null
          emo_budgeted_amount: number | null
          emo_currency: string | null
          emo_duration_unit: string | null
          emo_eng_allocated: string | null
          emo_estimated_amount: number | null
          emo_estimated_duration: number | null
          emo_instr_contact_person: string | null
          emo_instr_failure_date: string | null
          emo_instrument_code: string | null
          emo_last_change_date: string | null
          emo_order_id: number | null
          emo_order_status: string | null
          emo_order_status_date: string | null
          emo_order_type: string | null
          emo_parent_order_id: number | null
          emo_plan_end_date: string | null
          emo_plan_start_date: string | null
          emo_planner_id: string | null
          emo_problem_code: string | null
          emo_project_id: string | null
          emo_remaining_duration: number | null
          emo_reporting_date: string | null
          emo_request_type: string | null
          emo_requestor_id: string | null
          emo_responsible_engineer: string | null
          emo_schedule_end_date: string | null
          emo_schedule_start_date: string | null
          emo_serreq_or_schedule_id: number | null
          emo_service_area: string | null
          emo_service_center: string | null
          emo_tel_no: string | null
          emo_work_carriedout_at: string | null
        }
        Insert: {
          emo_actual_amount?: number | null
          emo_actual_duration?: number | null
          emo_actual_end_date?: string | null
          emo_actual_start_date?: string | null
          emo_budgeted_amount?: number | null
          emo_currency?: string | null
          emo_duration_unit?: string | null
          emo_eng_allocated?: string | null
          emo_estimated_amount?: number | null
          emo_estimated_duration?: number | null
          emo_instr_contact_person?: string | null
          emo_instr_failure_date?: string | null
          emo_instrument_code?: string | null
          emo_last_change_date?: string | null
          emo_order_id?: number | null
          emo_order_status?: string | null
          emo_order_status_date?: string | null
          emo_order_type?: string | null
          emo_parent_order_id?: number | null
          emo_plan_end_date?: string | null
          emo_plan_start_date?: string | null
          emo_planner_id?: string | null
          emo_problem_code?: string | null
          emo_project_id?: string | null
          emo_remaining_duration?: number | null
          emo_reporting_date?: string | null
          emo_request_type?: string | null
          emo_requestor_id?: string | null
          emo_responsible_engineer?: string | null
          emo_schedule_end_date?: string | null
          emo_schedule_start_date?: string | null
          emo_serreq_or_schedule_id?: number | null
          emo_service_area?: string | null
          emo_service_center?: string | null
          emo_tel_no?: string | null
          emo_work_carriedout_at?: string | null
        }
        Update: {
          emo_actual_amount?: number | null
          emo_actual_duration?: number | null
          emo_actual_end_date?: string | null
          emo_actual_start_date?: string | null
          emo_budgeted_amount?: number | null
          emo_currency?: string | null
          emo_duration_unit?: string | null
          emo_eng_allocated?: string | null
          emo_estimated_amount?: number | null
          emo_estimated_duration?: number | null
          emo_instr_contact_person?: string | null
          emo_instr_failure_date?: string | null
          emo_instrument_code?: string | null
          emo_last_change_date?: string | null
          emo_order_id?: number | null
          emo_order_status?: string | null
          emo_order_status_date?: string | null
          emo_order_type?: string | null
          emo_parent_order_id?: number | null
          emo_plan_end_date?: string | null
          emo_plan_start_date?: string | null
          emo_planner_id?: string | null
          emo_problem_code?: string | null
          emo_project_id?: string | null
          emo_remaining_duration?: number | null
          emo_reporting_date?: string | null
          emo_request_type?: string | null
          emo_requestor_id?: string | null
          emo_responsible_engineer?: string | null
          emo_schedule_end_date?: string | null
          emo_schedule_start_date?: string | null
          emo_serreq_or_schedule_id?: number | null
          emo_service_area?: string | null
          emo_service_center?: string | null
          emo_tel_no?: string | null
          emo_work_carriedout_at?: string | null
        }
        Relationships: []
      }
      ezc_maintenance_schedule_header: {
        Row: {
          emsh_base_template: number | null
          emsh_base_template_ver: number | null
          emsh_created_by: string | null
          emsh_created_on: string | null
          emsh_description: string | null
          emsh_instrument: string | null
          emsh_lang: string | null
          emsh_modified_by: string | null
          emsh_modified_on: string | null
          emsh_orders_generated_upto: string | null
          emsh_ref_document_code: number | null
          emsh_ref_document_type: string | null
          emsh_sched_end: string | null
          emsh_sched_start: string | null
          emsh_schedule_code: number | null
          emsh_schedule_stat: string | null
        }
        Insert: {
          emsh_base_template?: number | null
          emsh_base_template_ver?: number | null
          emsh_created_by?: string | null
          emsh_created_on?: string | null
          emsh_description?: string | null
          emsh_instrument?: string | null
          emsh_lang?: string | null
          emsh_modified_by?: string | null
          emsh_modified_on?: string | null
          emsh_orders_generated_upto?: string | null
          emsh_ref_document_code?: number | null
          emsh_ref_document_type?: string | null
          emsh_sched_end?: string | null
          emsh_sched_start?: string | null
          emsh_schedule_code?: number | null
          emsh_schedule_stat?: string | null
        }
        Update: {
          emsh_base_template?: number | null
          emsh_base_template_ver?: number | null
          emsh_created_by?: string | null
          emsh_created_on?: string | null
          emsh_description?: string | null
          emsh_instrument?: string | null
          emsh_lang?: string | null
          emsh_modified_by?: string | null
          emsh_modified_on?: string | null
          emsh_orders_generated_upto?: string | null
          emsh_ref_document_code?: number | null
          emsh_ref_document_type?: string | null
          emsh_sched_end?: string | null
          emsh_sched_start?: string | null
          emsh_schedule_code?: number | null
          emsh_schedule_stat?: string | null
        }
        Relationships: []
      }
      ezc_maintenance_schedule_lines: {
        Row: {
          emsl_act_or_grp_code: string | null
          emsl_act_type: string | null
          emsl_inc_exc: string | null
          emsl_schedule_code: number | null
          emsl_scheduled_date: string | null
          emsl_seq_no: number | null
          emsl_status: string | null
        }
        Insert: {
          emsl_act_or_grp_code?: string | null
          emsl_act_type?: string | null
          emsl_inc_exc?: string | null
          emsl_schedule_code?: number | null
          emsl_scheduled_date?: string | null
          emsl_seq_no?: number | null
          emsl_status?: string | null
        }
        Update: {
          emsl_act_or_grp_code?: string | null
          emsl_act_type?: string | null
          emsl_inc_exc?: string | null
          emsl_schedule_code?: number | null
          emsl_scheduled_date?: string | null
          emsl_seq_no?: number | null
          emsl_status?: string | null
        }
        Relationships: []
      }
      ezc_maintenance_template_details: {
        Row: {
          emthd_act_or_grp_code: number | null
          emthd_act_type: string | null
          emthd_code: number | null
          emthd_is_mandatory: string | null
          emthd_offset: number | null
          emthd_repeat: number | null
          emthd_seq_number: number | null
          emthd_template_version: number | null
        }
        Insert: {
          emthd_act_or_grp_code?: number | null
          emthd_act_type?: string | null
          emthd_code?: number | null
          emthd_is_mandatory?: string | null
          emthd_offset?: number | null
          emthd_repeat?: number | null
          emthd_seq_number?: number | null
          emthd_template_version?: number | null
        }
        Update: {
          emthd_act_or_grp_code?: number | null
          emthd_act_type?: string | null
          emthd_code?: number | null
          emthd_is_mandatory?: string | null
          emthd_offset?: number | null
          emthd_repeat?: number | null
          emthd_seq_number?: number | null
          emthd_template_version?: number | null
        }
        Relationships: []
      }
      ezc_maintenance_template_header: {
        Row: {
          emth_code: number | null
          emth_description: string | null
          emth_duration: number | null
          emth_lang: string | null
          emth_model: string | null
          emth_template_version: number | null
        }
        Insert: {
          emth_code?: number | null
          emth_description?: string | null
          emth_duration?: number | null
          emth_lang?: string | null
          emth_model?: string | null
          emth_template_version?: number | null
        }
        Update: {
          emth_code?: number | null
          emth_description?: string | null
          emth_duration?: number | null
          emth_lang?: string | null
          emth_model?: string | null
          emth_template_version?: number | null
        }
        Relationships: []
      }
      ezc_massuser_synch: {
        Row: {
          ems_key: string | null
          ems_soldto: string | null
          ems_syskey: string | null
          ems_userid: string | null
          ems_value: string | null
        }
        Insert: {
          ems_key?: string | null
          ems_soldto?: string | null
          ems_syskey?: string | null
          ems_userid?: string | null
          ems_value?: string | null
        }
        Update: {
          ems_key?: string | null
          ems_soldto?: string | null
          ems_syskey?: string | null
          ems_userid?: string | null
          ems_value?: string | null
        }
        Relationships: []
      }
      ezc_material_desc: {
        Row: {
          emd_desc: string | null
          emd_external_url: string | null
          emd_lang: string | null
          emd_specs1: string | null
          emd_specs2: string | null
          emd_specs3: string | null
          emd_specs4: string | null
          emd_web_desc: string | null
          emm_catalog_no: number | null
          emm_id: number | null
          emm_no: string | null
        }
        Insert: {
          emd_desc?: string | null
          emd_external_url?: string | null
          emd_lang?: string | null
          emd_specs1?: string | null
          emd_specs2?: string | null
          emd_specs3?: string | null
          emd_specs4?: string | null
          emd_web_desc?: string | null
          emm_catalog_no?: number | null
          emm_id?: number | null
          emm_no?: string | null
        }
        Update: {
          emd_desc?: string | null
          emd_external_url?: string | null
          emd_lang?: string | null
          emd_specs1?: string | null
          emd_specs2?: string | null
          emd_specs3?: string | null
          emd_specs4?: string | null
          emd_web_desc?: string | null
          emm_catalog_no?: number | null
          emm_id?: number | null
          emm_no?: string | null
        }
        Relationships: []
      }
      ezc_material_groups: {
        Row: {
          emg_deletion_flag: string | null
          emg_group_id: string | null
          emg_mat_no: string | null
          emg_system_key: string | null
          emg_unique_flag: string | null
        }
        Insert: {
          emg_deletion_flag?: string | null
          emg_group_id?: string | null
          emg_mat_no?: string | null
          emg_system_key?: string | null
          emg_unique_flag?: string | null
        }
        Update: {
          emg_deletion_flag?: string | null
          emg_group_id?: string | null
          emg_mat_no?: string | null
          emg_system_key?: string | null
          emg_unique_flag?: string | null
        }
        Relationships: []
      }
      ezc_material_mapping: {
        Row: {
          emm_client: number | null
          emm_cust_mat_no: string | null
          emm_deletion_flag: string | null
          emm_new_material_flag: string | null
          emm_vend_mat_no: string | null
          emm_vendor: string | null
        }
        Insert: {
          emm_client?: number | null
          emm_cust_mat_no?: string | null
          emm_deletion_flag?: string | null
          emm_new_material_flag?: string | null
          emm_vend_mat_no?: string | null
          emm_vendor?: string | null
        }
        Update: {
          emm_client?: number | null
          emm_cust_mat_no?: string | null
          emm_deletion_flag?: string | null
          emm_new_material_flag?: string | null
          emm_vend_mat_no?: string | null
          emm_vendor?: string | null
        }
        Relationships: []
      }
      ezc_material_master: {
        Row: {
          emm_avail_quantity: number | null
          emm_catalog_no: string | null
          emm_color: string | null
          emm_curr_key: string | null
          emm_deletion_flag: string | null
          emm_ean_upc_no: string | null
          emm_effective_date: string | null
          emm_ext_no: string | null
          emm_family: string | null
          emm_finish: string | null
          emm_future_price: number | null
          emm_id: number | null
          emm_image_flag: string | null
          emm_image_path: string | null
          emm_lead_time: number | null
          emm_length: string | null
          emm_manufacturer: string | null
          emm_no: string | null
          emm_size: string | null
          emm_specs: string | null
          emm_status: string | null
          emm_type: string | null
          emm_unit_of_measure: string | null
          emm_unit_price: number | null
          emm_variable_price_flag: string | null
          emm_weight_num: number | null
          emm_weight_uom: string | null
          emm_width: string | null
        }
        Insert: {
          emm_avail_quantity?: number | null
          emm_catalog_no?: string | null
          emm_color?: string | null
          emm_curr_key?: string | null
          emm_deletion_flag?: string | null
          emm_ean_upc_no?: string | null
          emm_effective_date?: string | null
          emm_ext_no?: string | null
          emm_family?: string | null
          emm_finish?: string | null
          emm_future_price?: number | null
          emm_id?: number | null
          emm_image_flag?: string | null
          emm_image_path?: string | null
          emm_lead_time?: number | null
          emm_length?: string | null
          emm_manufacturer?: string | null
          emm_no?: string | null
          emm_size?: string | null
          emm_specs?: string | null
          emm_status?: string | null
          emm_type?: string | null
          emm_unit_of_measure?: string | null
          emm_unit_price?: number | null
          emm_variable_price_flag?: string | null
          emm_weight_num?: number | null
          emm_weight_uom?: string | null
          emm_width?: string | null
        }
        Update: {
          emm_avail_quantity?: number | null
          emm_catalog_no?: string | null
          emm_color?: string | null
          emm_curr_key?: string | null
          emm_deletion_flag?: string | null
          emm_ean_upc_no?: string | null
          emm_effective_date?: string | null
          emm_ext_no?: string | null
          emm_family?: string | null
          emm_finish?: string | null
          emm_future_price?: number | null
          emm_id?: number | null
          emm_image_flag?: string | null
          emm_image_path?: string | null
          emm_lead_time?: number | null
          emm_length?: string | null
          emm_manufacturer?: string | null
          emm_no?: string | null
          emm_size?: string | null
          emm_specs?: string | null
          emm_status?: string | null
          emm_type?: string | null
          emm_unit_of_measure?: string | null
          emm_unit_price?: number | null
          emm_variable_price_flag?: string | null
          emm_weight_num?: number | null
          emm_weight_uom?: string | null
          emm_width?: string | null
        }
        Relationships: []
      }
      ezc_material_postings: {
        Row: {
          ezmp_activation_date: string | null
          ezmp_closing_date: string | null
          ezmp_created_by: string | null
          ezmp_creation_date: string | null
          ezmp_curr_status: string | null
          ezmp_ext1: string | null
          ezmp_ext2: string | null
          ezmp_matdesc: string | null
          ezmp_refdocno: string | null
          ezmp_reqdesc: string | null
          ezmp_reqid: string | null
          ezmp_reqqty: number | null
          ezmp_reqtype: string | null
          ezmp_syskey: string | null
          ezmp_uom: string | null
          ezmp_visbility_level: string | null
        }
        Insert: {
          ezmp_activation_date?: string | null
          ezmp_closing_date?: string | null
          ezmp_created_by?: string | null
          ezmp_creation_date?: string | null
          ezmp_curr_status?: string | null
          ezmp_ext1?: string | null
          ezmp_ext2?: string | null
          ezmp_matdesc?: string | null
          ezmp_refdocno?: string | null
          ezmp_reqdesc?: string | null
          ezmp_reqid?: string | null
          ezmp_reqqty?: number | null
          ezmp_reqtype?: string | null
          ezmp_syskey?: string | null
          ezmp_uom?: string | null
          ezmp_visbility_level?: string | null
        }
        Update: {
          ezmp_activation_date?: string | null
          ezmp_closing_date?: string | null
          ezmp_created_by?: string | null
          ezmp_creation_date?: string | null
          ezmp_curr_status?: string | null
          ezmp_ext1?: string | null
          ezmp_ext2?: string | null
          ezmp_matdesc?: string | null
          ezmp_refdocno?: string | null
          ezmp_reqdesc?: string | null
          ezmp_reqid?: string | null
          ezmp_reqqty?: number | null
          ezmp_reqtype?: string | null
          ezmp_syskey?: string | null
          ezmp_uom?: string | null
          ezmp_visbility_level?: string | null
        }
        Relationships: []
      }
      ezc_material_reqmt: {
        Row: {
          ezmr_actual_cost_price: number | null
          ezmr_actual_quantity: number | null
          ezmr_actual_selling_price: number | null
          ezmr_cost_currency: string | null
          ezmr_estimated_cost_price: number | null
          ezmr_estimated_quantity: number | null
          ezmr_estimated_selling_price: number | null
          ezmr_item: string | null
          ezmr_item_type: string | null
          ezmr_operation_id: number | null
          ezmr_order_id: number | null
          ezmr_price_unit: string | null
          ezmr_quantity_unit: string | null
          ezmr_reqmt_id: number | null
          ezmr_selling_currency: string | null
          ezmr_source: string | null
        }
        Insert: {
          ezmr_actual_cost_price?: number | null
          ezmr_actual_quantity?: number | null
          ezmr_actual_selling_price?: number | null
          ezmr_cost_currency?: string | null
          ezmr_estimated_cost_price?: number | null
          ezmr_estimated_quantity?: number | null
          ezmr_estimated_selling_price?: number | null
          ezmr_item?: string | null
          ezmr_item_type?: string | null
          ezmr_operation_id?: number | null
          ezmr_order_id?: number | null
          ezmr_price_unit?: string | null
          ezmr_quantity_unit?: string | null
          ezmr_reqmt_id?: number | null
          ezmr_selling_currency?: string | null
          ezmr_source?: string | null
        }
        Update: {
          ezmr_actual_cost_price?: number | null
          ezmr_actual_quantity?: number | null
          ezmr_actual_selling_price?: number | null
          ezmr_cost_currency?: string | null
          ezmr_estimated_cost_price?: number | null
          ezmr_estimated_quantity?: number | null
          ezmr_estimated_selling_price?: number | null
          ezmr_item?: string | null
          ezmr_item_type?: string | null
          ezmr_operation_id?: number | null
          ezmr_order_id?: number | null
          ezmr_price_unit?: string | null
          ezmr_quantity_unit?: string | null
          ezmr_reqmt_id?: number | null
          ezmr_selling_currency?: string | null
          ezmr_source?: string | null
        }
        Relationships: []
      }
      ezc_messages: {
        Row: {
          epm_client: number | null
          epm_creation_date: string | null
          epm_creation_time: string | null
          epm_folder_id: number | null
          epm_lnk_ext_info: string | null
          epm_msg_content1: string | null
          epm_msg_content2: string | null
          epm_msg_header: string | null
          epm_msg_id: string | null
          epm_msg_type: string | null
          epm_priority_flag: string | null
          epm_user_id: string | null
        }
        Insert: {
          epm_client?: number | null
          epm_creation_date?: string | null
          epm_creation_time?: string | null
          epm_folder_id?: number | null
          epm_lnk_ext_info?: string | null
          epm_msg_content1?: string | null
          epm_msg_content2?: string | null
          epm_msg_header?: string | null
          epm_msg_id?: string | null
          epm_msg_type?: string | null
          epm_priority_flag?: string | null
          epm_user_id?: string | null
        }
        Update: {
          epm_client?: number | null
          epm_creation_date?: string | null
          epm_creation_time?: string | null
          epm_folder_id?: number | null
          epm_lnk_ext_info?: string | null
          epm_msg_content1?: string | null
          epm_msg_content2?: string | null
          epm_msg_header?: string | null
          epm_msg_id?: string | null
          epm_msg_type?: string | null
          epm_priority_flag?: string | null
          epm_user_id?: string | null
        }
        Relationships: []
      }
      ezc_model: {
        Row: {
          em_description: string | null
          em_enterprise_code: string | null
          em_equipment_type_code: string | null
          em_labor_rate_code: string | null
          em_manufacturer_id: string | null
          em_model_code: string | null
          em_skills: string | null
          em_warranty_template_code: string | null
        }
        Insert: {
          em_description?: string | null
          em_enterprise_code?: string | null
          em_equipment_type_code?: string | null
          em_labor_rate_code?: string | null
          em_manufacturer_id?: string | null
          em_model_code?: string | null
          em_skills?: string | null
          em_warranty_template_code?: string | null
        }
        Update: {
          em_description?: string | null
          em_enterprise_code?: string | null
          em_equipment_type_code?: string | null
          em_labor_rate_code?: string | null
          em_manufacturer_id?: string | null
          em_model_code?: string | null
          em_skills?: string | null
          em_warranty_template_code?: string | null
        }
        Relationships: []
      }
      ezc_model_hierarchies: {
        Row: {
          emh_parent: number | null
          emh_qty: number | null
          emh_spare_model_code: number | null
        }
        Insert: {
          emh_parent?: number | null
          emh_qty?: number | null
          emh_spare_model_code?: number | null
        }
        Update: {
          emh_parent?: number | null
          emh_qty?: number | null
          emh_spare_model_code?: number | null
        }
        Relationships: []
      }
      ezc_msg_links: {
        Row: {
          eml_client_id: number | null
          eml_ext_lnk: string | null
          eml_msg_id: string | null
          eml_reference: string | null
        }
        Insert: {
          eml_client_id?: number | null
          eml_ext_lnk?: string | null
          eml_msg_id?: string | null
          eml_reference?: string | null
        }
        Update: {
          eml_client_id?: number | null
          eml_ext_lnk?: string | null
          eml_msg_id?: string | null
          eml_reference?: string | null
        }
        Relationships: []
      }
      ezc_new_user: {
        Row: {
          enu_admin_role: string | null
          enu_approved_by: string | null
          enu_approved_on: string | null
          enu_company_name: string | null
          enu_created_by: string | null
          enu_created_on: string | null
          enu_creator_email: string | null
          enu_email: string | null
          enu_ext1: string | null
          enu_ext2: string | null
          enu_ext3: string | null
          enu_first_name: string | null
          enu_last_name: string | null
          enu_modified_by: string | null
          enu_modified_on: string | null
          enu_modify_comments: string | null
          enu_phone_no: string | null
          enu_rejection_comments: string | null
          enu_roles: string | null
          enu_roles_temp: string | null
          enu_status: string | null
          enu_user_id: string | null
          enu_user_type: string | null
        }
        Insert: {
          enu_admin_role?: string | null
          enu_approved_by?: string | null
          enu_approved_on?: string | null
          enu_company_name?: string | null
          enu_created_by?: string | null
          enu_created_on?: string | null
          enu_creator_email?: string | null
          enu_email?: string | null
          enu_ext1?: string | null
          enu_ext2?: string | null
          enu_ext3?: string | null
          enu_first_name?: string | null
          enu_last_name?: string | null
          enu_modified_by?: string | null
          enu_modified_on?: string | null
          enu_modify_comments?: string | null
          enu_phone_no?: string | null
          enu_rejection_comments?: string | null
          enu_roles?: string | null
          enu_roles_temp?: string | null
          enu_status?: string | null
          enu_user_id?: string | null
          enu_user_type?: string | null
        }
        Update: {
          enu_admin_role?: string | null
          enu_approved_by?: string | null
          enu_approved_on?: string | null
          enu_company_name?: string | null
          enu_created_by?: string | null
          enu_created_on?: string | null
          enu_creator_email?: string | null
          enu_email?: string | null
          enu_ext1?: string | null
          enu_ext2?: string | null
          enu_ext3?: string | null
          enu_first_name?: string | null
          enu_last_name?: string | null
          enu_modified_by?: string | null
          enu_modified_on?: string | null
          enu_modify_comments?: string | null
          enu_phone_no?: string | null
          enu_rejection_comments?: string | null
          enu_roles?: string | null
          enu_roles_temp?: string | null
          enu_status?: string | null
          enu_user_id?: string | null
          enu_user_type?: string | null
        }
        Relationships: []
      }
      ezc_new_user_accounts: {
        Row: {
          enua_address: string | null
          enua_city: string | null
          enua_dist_channel: string | null
          enua_division: string | null
          enua_ext1: string | null
          enua_ext2: string | null
          enua_ext3: string | null
          enua_sales_org: string | null
          enua_sold_to: string | null
          enua_soldto_name: string | null
          enua_state: string | null
          enua_status: string | null
          enua_user_id: string | null
        }
        Insert: {
          enua_address?: string | null
          enua_city?: string | null
          enua_dist_channel?: string | null
          enua_division?: string | null
          enua_ext1?: string | null
          enua_ext2?: string | null
          enua_ext3?: string | null
          enua_sales_org?: string | null
          enua_sold_to?: string | null
          enua_soldto_name?: string | null
          enua_state?: string | null
          enua_status?: string | null
          enua_user_id?: string | null
        }
        Update: {
          enua_address?: string | null
          enua_city?: string | null
          enua_dist_channel?: string | null
          enua_division?: string | null
          enua_ext1?: string | null
          enua_ext2?: string | null
          enua_ext3?: string | null
          enua_sales_org?: string | null
          enua_sold_to?: string | null
          enua_soldto_name?: string | null
          enua_state?: string | null
          enua_status?: string | null
          enua_user_id?: string | null
        }
        Relationships: []
      }
      ezc_news: {
        Row: {
          ezn_attachments: string | null
          ezn_auth: string | null
          ezn_category: string | null
          ezn_created_by: string | null
          ezn_created_date: string | null
          ezn_end_date: string | null
          ezn_ext1: string | null
          ezn_ext2: string | null
          ezn_ext3: string | null
          ezn_group: string | null
          ezn_id: number | null
          ezn_modified_by: string | null
          ezn_modified_date: string | null
          ezn_news_text: string | null
          ezn_news_type: string | null
          ezn_role: string | null
          ezn_shipto: string | null
          ezn_soldto: string | null
          ezn_start_date: string | null
          ezn_subject: string | null
          ezn_syskey: string | null
        }
        Insert: {
          ezn_attachments?: string | null
          ezn_auth?: string | null
          ezn_category?: string | null
          ezn_created_by?: string | null
          ezn_created_date?: string | null
          ezn_end_date?: string | null
          ezn_ext1?: string | null
          ezn_ext2?: string | null
          ezn_ext3?: string | null
          ezn_group?: string | null
          ezn_id?: number | null
          ezn_modified_by?: string | null
          ezn_modified_date?: string | null
          ezn_news_text?: string | null
          ezn_news_type?: string | null
          ezn_role?: string | null
          ezn_shipto?: string | null
          ezn_soldto?: string | null
          ezn_start_date?: string | null
          ezn_subject?: string | null
          ezn_syskey?: string | null
        }
        Update: {
          ezn_attachments?: string | null
          ezn_auth?: string | null
          ezn_category?: string | null
          ezn_created_by?: string | null
          ezn_created_date?: string | null
          ezn_end_date?: string | null
          ezn_ext1?: string | null
          ezn_ext2?: string | null
          ezn_ext3?: string | null
          ezn_group?: string | null
          ezn_id?: number | null
          ezn_modified_by?: string | null
          ezn_modified_date?: string | null
          ezn_news_text?: string | null
          ezn_news_type?: string | null
          ezn_role?: string | null
          ezn_shipto?: string | null
          ezn_soldto?: string | null
          ezn_start_date?: string | null
          ezn_subject?: string | null
          ezn_syskey?: string | null
        }
        Relationships: []
      }
      ezc_news_assignies: {
        Row: {
          ena_id: number | null
          ena_shipto: string | null
          ena_soldto: string | null
          ena_syskey: string | null
        }
        Insert: {
          ena_id?: number | null
          ena_shipto?: string | null
          ena_soldto?: string | null
          ena_syskey?: string | null
        }
        Update: {
          ena_id?: number | null
          ena_shipto?: string | null
          ena_soldto?: string | null
          ena_syskey?: string | null
        }
        Relationships: []
      }
      ezc_news_read_timestamp: {
        Row: {
          enr_confirmation: string | null
          enr_confirmed_date: string | null
          enr_id: number | null
          enr_syskey: string | null
          enr_user: string | null
          enr_viewed: string | null
          enr_viewed_date: string | null
        }
        Insert: {
          enr_confirmation?: string | null
          enr_confirmed_date?: string | null
          enr_id?: number | null
          enr_syskey?: string | null
          enr_user?: string | null
          enr_viewed?: string | null
          enr_viewed_date?: string | null
        }
        Update: {
          enr_confirmation?: string | null
          enr_confirmed_date?: string | null
          enr_id?: number | null
          enr_syskey?: string | null
          enr_user?: string | null
          enr_viewed?: string | null
          enr_viewed_date?: string | null
        }
        Relationships: []
      }
      ezc_number_ranges: {
        Row: {
          enr_from: number | null
          enr_interval: number | null
          enr_last_number: number | null
          enr_object: string | null
          enr_object_type: string | null
          enr_site_number: number | null
          enr_to: number | null
          enr_transaction: string | null
        }
        Insert: {
          enr_from?: number | null
          enr_interval?: number | null
          enr_last_number?: number | null
          enr_object?: string | null
          enr_object_type?: string | null
          enr_site_number?: number | null
          enr_to?: number | null
          enr_transaction?: string | null
        }
        Update: {
          enr_from?: number | null
          enr_interval?: number | null
          enr_last_number?: number | null
          enr_object?: string | null
          enr_object_type?: string | null
          enr_site_number?: number | null
          enr_to?: number | null
          enr_transaction?: string | null
        }
        Relationships: []
      }
      ezc_operation_type: {
        Row: {
          eoty_laborrate_code: string | null
          eoty_operation_type_code: string | null
          eoty_skill_codes: string | null
          eoty_toolkit_code: string | null
        }
        Insert: {
          eoty_laborrate_code?: string | null
          eoty_operation_type_code?: string | null
          eoty_skill_codes?: string | null
          eoty_toolkit_code?: string | null
        }
        Update: {
          eoty_laborrate_code?: string | null
          eoty_operation_type_code?: string | null
          eoty_skill_codes?: string | null
          eoty_toolkit_code?: string | null
        }
        Relationships: []
      }
      ezc_order_history: {
        Row: {
          eoh_buyer_id: string | null
          eoh_cat_area: string | null
          eoh_client: number | null
          eoh_created_by: string | null
          eoh_creation_date: string | null
          eoh_creation_time: string | null
          eoh_erp_order: string | null
          eoh_ezc_order_ref: string | null
          eoh_ezc_partner: string | null
          eoh_ord_type: string | null
          eoh_order_date: string | null
          eoh_order_status: string | null
          eoh_po_ref: string | null
          eoh_seller_id: string | null
          eoh_sys_no: number | null
        }
        Insert: {
          eoh_buyer_id?: string | null
          eoh_cat_area?: string | null
          eoh_client?: number | null
          eoh_created_by?: string | null
          eoh_creation_date?: string | null
          eoh_creation_time?: string | null
          eoh_erp_order?: string | null
          eoh_ezc_order_ref?: string | null
          eoh_ezc_partner?: string | null
          eoh_ord_type?: string | null
          eoh_order_date?: string | null
          eoh_order_status?: string | null
          eoh_po_ref?: string | null
          eoh_seller_id?: string | null
          eoh_sys_no?: number | null
        }
        Update: {
          eoh_buyer_id?: string | null
          eoh_cat_area?: string | null
          eoh_client?: number | null
          eoh_created_by?: string | null
          eoh_creation_date?: string | null
          eoh_creation_time?: string | null
          eoh_erp_order?: string | null
          eoh_ezc_order_ref?: string | null
          eoh_ezc_partner?: string | null
          eoh_ord_type?: string | null
          eoh_order_date?: string | null
          eoh_order_status?: string | null
          eoh_po_ref?: string | null
          eoh_seller_id?: string | null
          eoh_sys_no?: number | null
        }
        Relationships: []
      }
      ezc_order_negotiate: {
        Row: {
          eon_created_by: string | null
          eon_created_on: string | null
          eon_ext1: string | null
          eon_ext2: string | null
          eon_ext3: string | null
          eon_index_no: string | null
          eon_item_no: string | null
          eon_modified_by: string | null
          eon_modified_on: string | null
          eon_order_no: string | null
          eon_question_type: string | null
          eon_status: string | null
          eon_text: string | null
          eon_type: string | null
        }
        Insert: {
          eon_created_by?: string | null
          eon_created_on?: string | null
          eon_ext1?: string | null
          eon_ext2?: string | null
          eon_ext3?: string | null
          eon_index_no?: string | null
          eon_item_no?: string | null
          eon_modified_by?: string | null
          eon_modified_on?: string | null
          eon_order_no?: string | null
          eon_question_type?: string | null
          eon_status?: string | null
          eon_text?: string | null
          eon_type?: string | null
        }
        Update: {
          eon_created_by?: string | null
          eon_created_on?: string | null
          eon_ext1?: string | null
          eon_ext2?: string | null
          eon_ext3?: string | null
          eon_index_no?: string | null
          eon_item_no?: string | null
          eon_modified_by?: string | null
          eon_modified_on?: string | null
          eon_order_no?: string | null
          eon_question_type?: string | null
          eon_status?: string | null
          eon_text?: string | null
          eon_type?: string | null
        }
        Relationships: []
      }
      ezc_order_policies: {
        Row: {
          eop_brand_id: number | null
          eop_category: string | null
          eop_created_at: string
          eop_id: number | null
          eop_pdf_ind: unknown
          eop_title: string | null
          eop_updated_at: string
          eop_xls_ind: unknown
        }
        Insert: {
          eop_brand_id?: number | null
          eop_category?: string | null
          eop_created_at: string
          eop_id?: number | null
          eop_pdf_ind: unknown
          eop_title?: string | null
          eop_updated_at: string
          eop_xls_ind: unknown
        }
        Update: {
          eop_brand_id?: number | null
          eop_category?: string | null
          eop_created_at?: string
          eop_id?: number | null
          eop_pdf_ind?: unknown
          eop_title?: string | null
          eop_updated_at?: string
          eop_xls_ind?: unknown
        }
        Relationships: []
      }
      ezc_other_reqmt: {
        Row: {
          ezor_actual_date: string | null
          ezor_actual_quantity: number | null
          ezor_actual_total_cost_amnt: number | null
          ezor_actual_total_selling_amnt: number | null
          ezor_actual_total_unit_cost: number | null
          ezor_actual_unit_sales: number | null
          ezor_charge_by: string | null
          ezor_charge_quantity_unit: string | null
          ezor_closed_at: string | null
          ezor_cost_currency: string | null
          ezor_distance_unit: string | null
          ezor_estimated_quantity: number | null
          ezor_estimated_total_cost: number | null
          ezor_estimated_total_selling: number | null
          ezor_estimated_travel_distance: number | null
          ezor_estimated_travel_time: number | null
          ezor_estimated_unit_cost_rate: number | null
          ezor_estimated_unit_sales_rate: number | null
          ezor_operation_id: number | null
          ezor_order_id: number | null
          ezor_reqmt_id: number | null
          ezor_requirment_type: string | null
          ezor_sales_currency: string | null
          ezor_scheduled_date: string | null
          ezor_started_at: string | null
          ezor_subcontractor_code: string | null
          ezor_tool_code: string | null
          ezor_tool_type: string | null
          ezor_travel_time_unit: string | null
        }
        Insert: {
          ezor_actual_date?: string | null
          ezor_actual_quantity?: number | null
          ezor_actual_total_cost_amnt?: number | null
          ezor_actual_total_selling_amnt?: number | null
          ezor_actual_total_unit_cost?: number | null
          ezor_actual_unit_sales?: number | null
          ezor_charge_by?: string | null
          ezor_charge_quantity_unit?: string | null
          ezor_closed_at?: string | null
          ezor_cost_currency?: string | null
          ezor_distance_unit?: string | null
          ezor_estimated_quantity?: number | null
          ezor_estimated_total_cost?: number | null
          ezor_estimated_total_selling?: number | null
          ezor_estimated_travel_distance?: number | null
          ezor_estimated_travel_time?: number | null
          ezor_estimated_unit_cost_rate?: number | null
          ezor_estimated_unit_sales_rate?: number | null
          ezor_operation_id?: number | null
          ezor_order_id?: number | null
          ezor_reqmt_id?: number | null
          ezor_requirment_type?: string | null
          ezor_sales_currency?: string | null
          ezor_scheduled_date?: string | null
          ezor_started_at?: string | null
          ezor_subcontractor_code?: string | null
          ezor_tool_code?: string | null
          ezor_tool_type?: string | null
          ezor_travel_time_unit?: string | null
        }
        Update: {
          ezor_actual_date?: string | null
          ezor_actual_quantity?: number | null
          ezor_actual_total_cost_amnt?: number | null
          ezor_actual_total_selling_amnt?: number | null
          ezor_actual_total_unit_cost?: number | null
          ezor_actual_unit_sales?: number | null
          ezor_charge_by?: string | null
          ezor_charge_quantity_unit?: string | null
          ezor_closed_at?: string | null
          ezor_cost_currency?: string | null
          ezor_distance_unit?: string | null
          ezor_estimated_quantity?: number | null
          ezor_estimated_total_cost?: number | null
          ezor_estimated_total_selling?: number | null
          ezor_estimated_travel_distance?: number | null
          ezor_estimated_travel_time?: number | null
          ezor_estimated_unit_cost_rate?: number | null
          ezor_estimated_unit_sales_rate?: number | null
          ezor_operation_id?: number | null
          ezor_order_id?: number | null
          ezor_reqmt_id?: number | null
          ezor_requirment_type?: string | null
          ezor_sales_currency?: string | null
          ezor_scheduled_date?: string | null
          ezor_started_at?: string | null
          ezor_subcontractor_code?: string | null
          ezor_tool_code?: string | null
          ezor_tool_type?: string | null
          ezor_travel_time_unit?: string | null
        }
        Relationships: []
      }
      ezc_part_smart: {
        Row: {
          eps_brand_id: number | null
          eps_category: string | null
          eps_created_at: string
          eps_id: number | null
          eps_pdf_ind: unknown
          eps_title: string | null
          eps_updated_at: string
          eps_xls_ind: unknown
        }
        Insert: {
          eps_brand_id?: number | null
          eps_category?: string | null
          eps_created_at: string
          eps_id?: number | null
          eps_pdf_ind: unknown
          eps_title?: string | null
          eps_updated_at: string
          eps_xls_ind: unknown
        }
        Update: {
          eps_brand_id?: number | null
          eps_category?: string | null
          eps_created_at?: string
          eps_id?: number | null
          eps_pdf_ind?: unknown
          eps_title?: string | null
          eps_updated_at?: string
          eps_xls_ind?: unknown
        }
        Relationships: []
      }
      ezc_part_smart_appliance_types: {
        Row: {
          created_at: string
          id: number
          mapped_brand_ids: string | null
          name: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at: string
          id: number
          mapped_brand_ids?: string | null
          name?: string | null
          sort_order?: number | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: number
          mapped_brand_ids?: string | null
          name?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ezc_part_smart_brands: {
        Row: {
          created_at: string
          id: number
          name: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at: string
          id: number
          name?: string | null
          sort_order?: number | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ezc_part_smart_brands_appliance_types: {
        Row: {
          appliance_type_id: number
          brand_id: number
        }
        Insert: {
          appliance_type_id: number
          brand_id: number
        }
        Update: {
          appliance_type_id?: number
          brand_id?: number
        }
        Relationships: []
      }
      ezc_part_smart_brands_parent_models: {
        Row: {
          brand_id: number
          parent_model_id: number
        }
        Insert: {
          brand_id: number
          parent_model_id: number
        }
        Update: {
          brand_id?: number
          parent_model_id?: number
        }
        Relationships: []
      }
      ezc_part_smart_documents: {
        Row: {
          created_at: string
          file_content_type: string | null
          file_file_name: string | null
          file_file_size: number | null
          file_updated_at: string
          id: number
          updated_at: string
        }
        Insert: {
          created_at: string
          file_content_type?: string | null
          file_file_name?: string | null
          file_file_size?: number | null
          file_updated_at: string
          id: number
          updated_at: string
        }
        Update: {
          created_at?: string
          file_content_type?: string | null
          file_file_name?: string | null
          file_file_size?: number | null
          file_updated_at?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      ezc_part_smart_models: {
        Row: {
          cat_number: string | null
          created_at: string
          description: string | null
          discontinuation_date: string | null
          document_id: number | null
          id: number
          keywords: string | null
          launch_date: string | null
          name: string | null
          not_supported: unknown | null
          parent_model_id: number | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          cat_number?: string | null
          created_at: string
          description?: string | null
          discontinuation_date?: string | null
          document_id?: number | null
          id: number
          keywords?: string | null
          launch_date?: string | null
          name?: string | null
          not_supported?: unknown | null
          parent_model_id?: number | null
          sort_order?: number | null
          updated_at: string
        }
        Update: {
          cat_number?: string | null
          created_at?: string
          description?: string | null
          discontinuation_date?: string | null
          document_id?: number | null
          id?: number
          keywords?: string | null
          launch_date?: string | null
          name?: string | null
          not_supported?: unknown | null
          parent_model_id?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ezc_part_smart_models_parts: {
        Row: {
          id: number
          model_id: number | null
          part_id: number | null
        }
        Insert: {
          id: number
          model_id?: number | null
          part_id?: number | null
        }
        Update: {
          id?: number
          model_id?: number | null
          part_id?: number | null
        }
        Relationships: []
      }
      ezc_part_smart_parent_models: {
        Row: {
          appliance_type_id: number | null
          created_at: string
          id: number
          name: string | null
          updated_at: string
        }
        Insert: {
          appliance_type_id?: number | null
          created_at: string
          id: number
          name?: string | null
          updated_at: string
        }
        Update: {
          appliance_type_id?: number | null
          created_at?: string
          id?: number
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ezc_part_smart_parts: {
        Row: {
          created_at: string
          id: number
          part_number: string | null
          updated_at: string
        }
        Insert: {
          created_at: string
          id: number
          part_number?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: number
          part_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ezc_part_smart_uploads: {
        Row: {
          eps_brand_id: number | null
          eps_category: string | null
          eps_created_at: string
          eps_id: number | null
          eps_pdf_ind: unknown
          eps_title: string | null
          eps_updated_at: string
          eps_xls_ind: unknown
        }
        Insert: {
          eps_brand_id?: number | null
          eps_category?: string | null
          eps_created_at: string
          eps_id?: number | null
          eps_pdf_ind: unknown
          eps_title?: string | null
          eps_updated_at: string
          eps_xls_ind: unknown
        }
        Update: {
          eps_brand_id?: number | null
          eps_category?: string | null
          eps_created_at?: string
          eps_id?: number | null
          eps_pdf_ind?: unknown
          eps_title?: string | null
          eps_updated_at?: string
          eps_xls_ind?: unknown
        }
        Relationships: []
      }
      ezc_partial_po_details: {
        Row: {
          eppd_created_by: string | null
          eppd_created_on: string | null
          eppd_doc_no: string | null
          eppd_doc_type: string | null
          eppd_ext1: string | null
          eppd_ext2: string | null
          eppd_item_no: string | null
          eppd_pen_qty: number | null
          eppd_plant: string | null
          eppd_po_qty: number | null
          eppd_rfq_no: string | null
        }
        Insert: {
          eppd_created_by?: string | null
          eppd_created_on?: string | null
          eppd_doc_no?: string | null
          eppd_doc_type?: string | null
          eppd_ext1?: string | null
          eppd_ext2?: string | null
          eppd_item_no?: string | null
          eppd_pen_qty?: number | null
          eppd_plant?: string | null
          eppd_po_qty?: number | null
          eppd_rfq_no?: string | null
        }
        Update: {
          eppd_created_by?: string | null
          eppd_created_on?: string | null
          eppd_doc_no?: string | null
          eppd_doc_type?: string | null
          eppd_ext1?: string | null
          eppd_ext2?: string | null
          eppd_item_no?: string | null
          eppd_pen_qty?: number | null
          eppd_plant?: string | null
          eppd_po_qty?: number | null
          eppd_rfq_no?: string | null
        }
        Relationships: []
      }
      ezc_partner_mapping: {
        Row: {
          epm_cat_area: string | null
          epm_client: number | null
          epm_erp_cust_no: string | null
          epm_ezc_cust_no: string | null
          epm_vendor: string | null
        }
        Insert: {
          epm_cat_area?: string | null
          epm_client?: number | null
          epm_erp_cust_no?: string | null
          epm_ezc_cust_no?: string | null
          epm_vendor?: string | null
        }
        Update: {
          epm_cat_area?: string | null
          epm_client?: number | null
          epm_erp_cust_no?: string | null
          epm_ezc_cust_no?: string | null
          epm_vendor?: string | null
        }
        Relationships: []
      }
      ezc_paused_trigger_grps: {
        Row: {
          trigger_group: string | null
        }
        Insert: {
          trigger_group?: string | null
        }
        Update: {
          trigger_group?: string | null
        }
        Relationships: []
      }
      ezc_personal_messages: {
        Row: {
          epmd_client: number | null
          epmd_expiry_date: number | null
          epmd_expiry_days: number | null
          epmd_folder_id: number | null
          epmd_msg_id: string | null
          epmd_rec_user_id: string | null
          epmd_reminder_date: number | null
          epmd_user_id: string | null
          epmd_view_flag: string | null
        }
        Insert: {
          epmd_client?: number | null
          epmd_expiry_date?: number | null
          epmd_expiry_days?: number | null
          epmd_folder_id?: number | null
          epmd_msg_id?: string | null
          epmd_rec_user_id?: string | null
          epmd_reminder_date?: number | null
          epmd_user_id?: string | null
          epmd_view_flag?: string | null
        }
        Update: {
          epmd_client?: number | null
          epmd_expiry_date?: number | null
          epmd_expiry_days?: number | null
          epmd_folder_id?: number | null
          epmd_msg_id?: string | null
          epmd_rec_user_id?: string | null
          epmd_reminder_date?: number | null
          epmd_user_id?: string | null
          epmd_view_flag?: string | null
        }
        Relationships: []
      }
      ezc_po_acknowledgement: {
        Row: {
          ezpa_created_by: string | null
          ezpa_created_on: string | null
          ezpa_doc_date: string | null
          ezpa_doc_no: string | null
          ezpa_doc_status: string | null
          ezpa_ext1: string | null
          ezpa_ext2: string | null
          ezpa_ext3: string | null
          ezpa_header_text: string | null
          ezpa_modified_on: string | null
          ezpa_sold_to: string | null
          ezpa_sys_key: string | null
        }
        Insert: {
          ezpa_created_by?: string | null
          ezpa_created_on?: string | null
          ezpa_doc_date?: string | null
          ezpa_doc_no?: string | null
          ezpa_doc_status?: string | null
          ezpa_ext1?: string | null
          ezpa_ext2?: string | null
          ezpa_ext3?: string | null
          ezpa_header_text?: string | null
          ezpa_modified_on?: string | null
          ezpa_sold_to?: string | null
          ezpa_sys_key?: string | null
        }
        Update: {
          ezpa_created_by?: string | null
          ezpa_created_on?: string | null
          ezpa_doc_date?: string | null
          ezpa_doc_no?: string | null
          ezpa_doc_status?: string | null
          ezpa_ext1?: string | null
          ezpa_ext2?: string | null
          ezpa_ext3?: string | null
          ezpa_header_text?: string | null
          ezpa_modified_on?: string | null
          ezpa_sold_to?: string | null
          ezpa_sys_key?: string | null
        }
        Relationships: []
      }
      ezc_po_delivery_schedules: {
        Row: {
          ezpd_committed_date: string | null
          ezpd_committed_qty: number | null
          ezpd_doc_item_no: string | null
          ezpd_doc_no: string | null
          ezpd_ext1: string | null
          ezpd_ext2: string | null
          ezpd_ext3: string | null
          ezpd_material: string | null
          ezpd_material_desc: string | null
          ezpd_required_date: string | null
          ezpd_required_qty: number | null
          ezpd_schd_line: string | null
          ezpd_sold_to: string | null
          ezpd_sys_key: string | null
          ezpd_uom: string | null
        }
        Insert: {
          ezpd_committed_date?: string | null
          ezpd_committed_qty?: number | null
          ezpd_doc_item_no?: string | null
          ezpd_doc_no?: string | null
          ezpd_ext1?: string | null
          ezpd_ext2?: string | null
          ezpd_ext3?: string | null
          ezpd_material?: string | null
          ezpd_material_desc?: string | null
          ezpd_required_date?: string | null
          ezpd_required_qty?: number | null
          ezpd_schd_line?: string | null
          ezpd_sold_to?: string | null
          ezpd_sys_key?: string | null
          ezpd_uom?: string | null
        }
        Update: {
          ezpd_committed_date?: string | null
          ezpd_committed_qty?: number | null
          ezpd_doc_item_no?: string | null
          ezpd_doc_no?: string | null
          ezpd_ext1?: string | null
          ezpd_ext2?: string | null
          ezpd_ext3?: string | null
          ezpd_material?: string | null
          ezpd_material_desc?: string | null
          ezpd_required_date?: string | null
          ezpd_required_qty?: number | null
          ezpd_schd_line?: string | null
          ezpd_sold_to?: string | null
          ezpd_sys_key?: string | null
          ezpd_uom?: string | null
        }
        Relationships: []
      }
      ezc_points_mapping: {
        Row: {
          cgr_val: string | null
          div_val: string | null
          mg1_val: string | null
          mg5_val: string | null
          ph1_val: string | null
          points_type: string | null
        }
        Insert: {
          cgr_val?: string | null
          div_val?: string | null
          mg1_val?: string | null
          mg5_val?: string | null
          ph1_val?: string | null
          points_type?: string | null
        }
        Update: {
          cgr_val?: string | null
          div_val?: string | null
          mg1_val?: string | null
          mg5_val?: string | null
          ph1_val?: string | null
          points_type?: string | null
        }
        Relationships: []
      }
      ezc_post_material_responses: {
        Row: {
          ezmr_ext1: string | null
          ezmr_ext2: string | null
          ezmr_reqid: string | null
          ezmr_response_by: string | null
          ezmr_response_date: string | null
          ezmr_response_desc: string | null
          ezmr_soldto: string | null
          ezmr_syskey: string | null
        }
        Insert: {
          ezmr_ext1?: string | null
          ezmr_ext2?: string | null
          ezmr_reqid?: string | null
          ezmr_response_by?: string | null
          ezmr_response_date?: string | null
          ezmr_response_desc?: string | null
          ezmr_soldto?: string | null
          ezmr_syskey?: string | null
        }
        Update: {
          ezmr_ext1?: string | null
          ezmr_ext2?: string | null
          ezmr_reqid?: string | null
          ezmr_response_by?: string | null
          ezmr_response_date?: string | null
          ezmr_response_desc?: string | null
          ezmr_soldto?: string | null
          ezmr_syskey?: string | null
        }
        Relationships: []
      }
      ezc_price_lines: {
        Row: {
          epl_cond_value: number | null
          epl_customer: string | null
          epl_customer_group: string | null
          epl_is_net_sheet: string | null
          epl_material_group: string | null
          epl_product_code: string | null
          epl_product_line: string | null
          epl_scale: number | null
          epl_scale_uom: string | null
          epl_valid_from: string
          epl_valid_to: string
        }
        Insert: {
          epl_cond_value?: number | null
          epl_customer?: string | null
          epl_customer_group?: string | null
          epl_is_net_sheet?: string | null
          epl_material_group?: string | null
          epl_product_code?: string | null
          epl_product_line?: string | null
          epl_scale?: number | null
          epl_scale_uom?: string | null
          epl_valid_from: string
          epl_valid_to: string
        }
        Update: {
          epl_cond_value?: number | null
          epl_customer?: string | null
          epl_customer_group?: string | null
          epl_is_net_sheet?: string | null
          epl_material_group?: string | null
          epl_product_code?: string | null
          epl_product_line?: string | null
          epl_scale?: number | null
          epl_scale_uom?: string | null
          epl_valid_from?: string
          epl_valid_to?: string
        }
        Relationships: []
      }
      ezc_price_sheets: {
        Row: {
          eps_brand_id: number | null
          eps_category: string | null
          eps_created_at: string
          eps_id: number | null
          eps_pdf_ind: unknown
          eps_title: string | null
          eps_updated_at: string
          eps_xls_ind: unknown
        }
        Insert: {
          eps_brand_id?: number | null
          eps_category?: string | null
          eps_created_at: string
          eps_id?: number | null
          eps_pdf_ind: unknown
          eps_title?: string | null
          eps_updated_at: string
          eps_xls_ind: unknown
        }
        Update: {
          eps_brand_id?: number | null
          eps_category?: string | null
          eps_created_at?: string
          eps_id?: number | null
          eps_pdf_ind?: unknown
          eps_title?: string | null
          eps_updated_at?: string
          eps_xls_ind?: unknown
        }
        Relationships: []
      }
      ezc_prior_ae_info: {
        Row: {
          epai_adverse_event_id: number | null
          epai_dose_no_in_series: number | null
          epai_event_description: string | null
          epai_event_on: string | null
          epai_onset_age: number | null
          epai_vaccine_type: string | null
        }
        Insert: {
          epai_adverse_event_id?: number | null
          epai_dose_no_in_series?: number | null
          epai_event_description?: string | null
          epai_event_on?: string | null
          epai_onset_age?: number | null
          epai_vaccine_type?: string | null
        }
        Update: {
          epai_adverse_event_id?: number | null
          epai_dose_no_in_series?: number | null
          epai_event_description?: string | null
          epai_event_on?: string | null
          epai_onset_age?: number | null
          epai_vaccine_type?: string | null
        }
        Relationships: []
      }
      ezc_prior_vaccination_history: {
        Row: {
          epvh_adverse_event_id: number | null
          epvh_lot: string | null
          epvh_manufacturer: string | null
          epvh_no_of_prev_doses: number | null
          epvh_record_type: string | null
          epvh_route_or_site: string | null
          epvh_vacc_id: number | null
          epvh_vaccination_date: string | null
          epvh_vaccine_info_before_vaccinated_date: string | null
          epvh_vaccine_info_on_vaccinated_date: string | null
          epvh_vaccine_type: string | null
        }
        Insert: {
          epvh_adverse_event_id?: number | null
          epvh_lot?: string | null
          epvh_manufacturer?: string | null
          epvh_no_of_prev_doses?: number | null
          epvh_record_type?: string | null
          epvh_route_or_site?: string | null
          epvh_vacc_id?: number | null
          epvh_vaccination_date?: string | null
          epvh_vaccine_info_before_vaccinated_date?: string | null
          epvh_vaccine_info_on_vaccinated_date?: string | null
          epvh_vaccine_type?: string | null
        }
        Update: {
          epvh_adverse_event_id?: number | null
          epvh_lot?: string | null
          epvh_manufacturer?: string | null
          epvh_no_of_prev_doses?: number | null
          epvh_record_type?: string | null
          epvh_route_or_site?: string | null
          epvh_vacc_id?: number | null
          epvh_vaccination_date?: string | null
          epvh_vaccine_info_before_vaccinated_date?: string | null
          epvh_vaccine_info_on_vaccinated_date?: string | null
          epvh_vaccine_type?: string | null
        }
        Relationships: []
      }
      ezc_priority: {
        Row: {
          epri_default_resp_time: string | null
          epri_priority_code: string | null
        }
        Insert: {
          epri_default_resp_time?: string | null
          epri_priority_code?: string | null
        }
        Update: {
          epri_default_resp_time?: string | null
          epri_priority_code?: string | null
        }
        Relationships: []
      }
      ezc_problem: {
        Row: {
          ezpr_category_id: string | null
          ezpr_code: string | null
        }
        Insert: {
          ezpr_category_id?: string | null
          ezpr_code?: string | null
        }
        Update: {
          ezpr_category_id?: string | null
          ezpr_code?: string | null
        }
        Relationships: []
      }
      ezc_problem_categories: {
        Row: {
          epc_category_id: string | null
          epc_description: string | null
          epc_equip_types: string | null
        }
        Insert: {
          epc_category_id?: string | null
          epc_description?: string | null
          epc_equip_types?: string | null
        }
        Update: {
          epc_category_id?: string | null
          epc_description?: string | null
          epc_equip_types?: string | null
        }
        Relationships: []
      }
      ezc_procedure_types: {
        Row: {
          ept_description: string | null
          ept_language: string | null
          ept_procedure_type: string | null
        }
        Insert: {
          ept_description?: string | null
          ept_language?: string | null
          ept_procedure_type?: string | null
        }
        Update: {
          ept_description?: string | null
          ept_language?: string | null
          ept_procedure_type?: string | null
        }
        Relationships: []
      }
      ezc_product_assets: {
        Row: {
          epa_asset_id: string | null
          epa_catalog_id: string | null
          epa_image_type: string | null
          epa_product_code: string | null
          epa_screen_name: string | null
        }
        Insert: {
          epa_asset_id?: string | null
          epa_catalog_id?: string | null
          epa_image_type?: string | null
          epa_product_code?: string | null
          epa_screen_name?: string | null
        }
        Update: {
          epa_asset_id?: string | null
          epa_catalog_id?: string | null
          epa_image_type?: string | null
          epa_product_code?: string | null
          epa_screen_name?: string | null
        }
        Relationships: []
      }
      ezc_product_attributes: {
        Row: {
          epa_attr_code: string | null
          epa_attr_value: string | null
          epa_product_code: string | null
          epa_sys_key: string | null
        }
        Insert: {
          epa_attr_code?: string | null
          epa_attr_value?: string | null
          epa_product_code?: string | null
          epa_sys_key?: string | null
        }
        Update: {
          epa_attr_code?: string | null
          epa_attr_value?: string | null
          epa_product_code?: string | null
          epa_sys_key?: string | null
        }
        Relationships: []
      }
      ezc_product_attributes_flat: {
        Row: {
          CATALOG: string | null
          dch_status: string | null
          def_del_plant: string | null
          def_plant: string | null
          description: string | null
          dist_channel: string | null
          division: string | null
          epa_product_code: string | null
          epa_sys_key: string | null
          flushing_system: string | null
          installation: string | null
          item_cat_group: string | null
          list_price: number | null
          mat_pric_group: string | null
          material_group1: string | null
          material_group2: string | null
          material_group3: string | null
          material_group4: string | null
          material_group5: string | null
          prod_attrs: string | null
          prod_hierarchy1: string | null
          product_hierarchy: string | null
          sales_org: string | null
          sap_comm_group: string | null
          soip_category: string | null
          xdch_status: string | null
        }
        Insert: {
          CATALOG?: string | null
          dch_status?: string | null
          def_del_plant?: string | null
          def_plant?: string | null
          description?: string | null
          dist_channel?: string | null
          division?: string | null
          epa_product_code?: string | null
          epa_sys_key?: string | null
          flushing_system?: string | null
          installation?: string | null
          item_cat_group?: string | null
          list_price?: number | null
          mat_pric_group?: string | null
          material_group1?: string | null
          material_group2?: string | null
          material_group3?: string | null
          material_group4?: string | null
          material_group5?: string | null
          prod_attrs?: string | null
          prod_hierarchy1?: string | null
          product_hierarchy?: string | null
          sales_org?: string | null
          sap_comm_group?: string | null
          soip_category?: string | null
          xdch_status?: string | null
        }
        Update: {
          CATALOG?: string | null
          dch_status?: string | null
          def_del_plant?: string | null
          def_plant?: string | null
          description?: string | null
          dist_channel?: string | null
          division?: string | null
          epa_product_code?: string | null
          epa_sys_key?: string | null
          flushing_system?: string | null
          installation?: string | null
          item_cat_group?: string | null
          list_price?: number | null
          mat_pric_group?: string | null
          material_group1?: string | null
          material_group2?: string | null
          material_group3?: string | null
          material_group4?: string | null
          material_group5?: string | null
          prod_attrs?: string | null
          prod_hierarchy1?: string | null
          product_hierarchy?: string | null
          sales_org?: string | null
          sap_comm_group?: string | null
          soip_category?: string | null
          xdch_status?: string | null
        }
        Relationships: []
      }
      ezc_product_catalog: {
        Row: {
          epc_buss_indicator: string | null
          epc_lang: string | null
          epc_name: string | null
          epc_no: number | null
        }
        Insert: {
          epc_buss_indicator?: string | null
          epc_lang?: string | null
          epc_name?: string | null
          epc_no?: number | null
        }
        Update: {
          epc_buss_indicator?: string | null
          epc_lang?: string | null
          epc_name?: string | null
          epc_no?: number | null
        }
        Relationships: []
      }
      ezc_product_classification: {
        Row: {
          epcl_code: string | null
          epcl_image: string | null
          epcl_status: string | null
          epcl_thumb: string | null
          epcl_type: string | null
          epcl_visible: string | null
        }
        Insert: {
          epcl_code?: string | null
          epcl_image?: string | null
          epcl_status?: string | null
          epcl_thumb?: string | null
          epcl_type?: string | null
          epcl_visible?: string | null
        }
        Update: {
          epcl_code?: string | null
          epcl_image?: string | null
          epcl_status?: string | null
          epcl_thumb?: string | null
          epcl_type?: string | null
          epcl_visible?: string | null
        }
        Relationships: []
      }
      ezc_product_descriptions: {
        Row: {
          epd_catalog_id: string | null
          epd_lang_code: string | null
          epd_product_code: string | null
          epd_product_desc: string | null
          epd_product_details: string | null
          epd_product_prop1: string | null
          epd_product_prop2: string | null
          epd_product_prop3: string | null
          epd_product_prop4: string | null
          epd_product_prop5: string | null
          epd_product_prop6: string | null
        }
        Insert: {
          epd_catalog_id?: string | null
          epd_lang_code?: string | null
          epd_product_code?: string | null
          epd_product_desc?: string | null
          epd_product_details?: string | null
          epd_product_prop1?: string | null
          epd_product_prop2?: string | null
          epd_product_prop3?: string | null
          epd_product_prop4?: string | null
          epd_product_prop5?: string | null
          epd_product_prop6?: string | null
        }
        Update: {
          epd_catalog_id?: string | null
          epd_lang_code?: string | null
          epd_product_code?: string | null
          epd_product_desc?: string | null
          epd_product_details?: string | null
          epd_product_prop1?: string | null
          epd_product_prop2?: string | null
          epd_product_prop3?: string | null
          epd_product_prop4?: string | null
          epd_product_prop5?: string | null
          epd_product_prop6?: string | null
        }
        Relationships: []
      }
      ezc_product_descriptions_0325222: {
        Row: {
          epd_catalog_id: string | null
          epd_lang_code: string | null
          epd_product_code: string | null
          epd_product_desc: string | null
          epd_product_details: string | null
          epd_product_prop1: string | null
          epd_product_prop2: string | null
          epd_product_prop3: string | null
          epd_product_prop4: string | null
          epd_product_prop5: string | null
          epd_product_prop6: string | null
        }
        Insert: {
          epd_catalog_id?: string | null
          epd_lang_code?: string | null
          epd_product_code?: string | null
          epd_product_desc?: string | null
          epd_product_details?: string | null
          epd_product_prop1?: string | null
          epd_product_prop2?: string | null
          epd_product_prop3?: string | null
          epd_product_prop4?: string | null
          epd_product_prop5?: string | null
          epd_product_prop6?: string | null
        }
        Update: {
          epd_catalog_id?: string | null
          epd_lang_code?: string | null
          epd_product_code?: string | null
          epd_product_desc?: string | null
          epd_product_details?: string | null
          epd_product_prop1?: string | null
          epd_product_prop2?: string | null
          epd_product_prop3?: string | null
          epd_product_prop4?: string | null
          epd_product_prop5?: string | null
          epd_product_prop6?: string | null
        }
        Relationships: []
      }
      ezc_product_group: {
        Row: {
          epg_deletion_flag: string | null
          epg_gif_flag: string | null
          epg_global_view_flag: string | null
          epg_group_level: number | null
          epg_no: string | null
          epg_no_of_items: number | null
          epg_sys_no: number | null
          epg_terminal_flag: string | null
        }
        Insert: {
          epg_deletion_flag?: string | null
          epg_gif_flag?: string | null
          epg_global_view_flag?: string | null
          epg_group_level?: number | null
          epg_no?: string | null
          epg_no_of_items?: number | null
          epg_sys_no?: number | null
          epg_terminal_flag?: string | null
        }
        Update: {
          epg_deletion_flag?: string | null
          epg_gif_flag?: string | null
          epg_global_view_flag?: string | null
          epg_group_level?: number | null
          epg_no?: string | null
          epg_no_of_items?: number | null
          epg_sys_no?: number | null
          epg_terminal_flag?: string | null
        }
        Relationships: []
      }
      ezc_product_group_desc: {
        Row: {
          epg_no: string | null
          epgd_desc: string | null
          epgd_lang: string | null
          epgd_web_desc: string | null
        }
        Insert: {
          epg_no?: string | null
          epgd_desc?: string | null
          epgd_lang?: string | null
          epgd_web_desc?: string | null
        }
        Update: {
          epg_no?: string | null
          epgd_desc?: string | null
          epgd_lang?: string | null
          epgd_web_desc?: string | null
        }
        Relationships: []
      }
      ezc_product_relations: {
        Row: {
          epr_product_code1: string | null
          epr_product_code2: string | null
          epr_rel_qty: number | null
          epr_relation_type: string | null
        }
        Insert: {
          epr_product_code1?: string | null
          epr_product_code2?: string | null
          epr_rel_qty?: number | null
          epr_relation_type?: string | null
        }
        Update: {
          epr_product_code1?: string | null
          epr_product_code2?: string | null
          epr_rel_qty?: number | null
          epr_relation_type?: string | null
        }
        Relationships: []
      }
      ezc_products: {
        Row: {
          ezp_alternate1: string | null
          ezp_alternate2: string | null
          ezp_alternate3: string | null
          ezp_attr1: string | null
          ezp_attr2: string | null
          ezp_attr3: string | null
          ezp_attr4: string | null
          ezp_attr5: string | null
          ezp_batch_managed: string | null
          ezp_brand: string | null
          ezp_catalog_id: string | null
          ezp_category: string | null
          ezp_color: string | null
          ezp_curr_eff_date: string | null
          ezp_curr_price: number | null
          ezp_discontinue_date: string | null
          ezp_discontinued: string | null
          ezp_erp_code: string | null
          ezp_family: string | null
          ezp_featured: string | null
          ezp_finish: string | null
          ezp_future_eff_date: string | null
          ezp_future_price: number | null
          ezp_gross_weight: string | null
          ezp_item_cat: string | null
          ezp_length: string | null
          ezp_length_uom: string | null
          ezp_luxury: string | null
          ezp_mat_pric_group: string | null
          ezp_model: string | null
          ezp_new_from: string | null
          ezp_new_to: string | null
          ezp_product_code: string | null
          ezp_profit_center: string | null
          ezp_replaces_item: string | null
          ezp_serial_profile: string | null
          ezp_size: string | null
          ezp_sort: number | null
          ezp_status: string | null
          ezp_style: string | null
          ezp_sub_category: string | null
          ezp_sub_type: string | null
          ezp_type: string | null
          ezp_upc_code: string | null
          ezp_volume: string | null
          ezp_volume_uom: string | null
          ezp_web_prod_id: string | null
          ezp_web_sku: string | null
          ezp_weight: string | null
          ezp_weight_uom: string | null
          ezp_width: string | null
        }
        Insert: {
          ezp_alternate1?: string | null
          ezp_alternate2?: string | null
          ezp_alternate3?: string | null
          ezp_attr1?: string | null
          ezp_attr2?: string | null
          ezp_attr3?: string | null
          ezp_attr4?: string | null
          ezp_attr5?: string | null
          ezp_batch_managed?: string | null
          ezp_brand?: string | null
          ezp_catalog_id?: string | null
          ezp_category?: string | null
          ezp_color?: string | null
          ezp_curr_eff_date?: string | null
          ezp_curr_price?: number | null
          ezp_discontinue_date?: string | null
          ezp_discontinued?: string | null
          ezp_erp_code?: string | null
          ezp_family?: string | null
          ezp_featured?: string | null
          ezp_finish?: string | null
          ezp_future_eff_date?: string | null
          ezp_future_price?: number | null
          ezp_gross_weight?: string | null
          ezp_item_cat?: string | null
          ezp_length?: string | null
          ezp_length_uom?: string | null
          ezp_luxury?: string | null
          ezp_mat_pric_group?: string | null
          ezp_model?: string | null
          ezp_new_from?: string | null
          ezp_new_to?: string | null
          ezp_product_code?: string | null
          ezp_profit_center?: string | null
          ezp_replaces_item?: string | null
          ezp_serial_profile?: string | null
          ezp_size?: string | null
          ezp_sort?: number | null
          ezp_status?: string | null
          ezp_style?: string | null
          ezp_sub_category?: string | null
          ezp_sub_type?: string | null
          ezp_type?: string | null
          ezp_upc_code?: string | null
          ezp_volume?: string | null
          ezp_volume_uom?: string | null
          ezp_web_prod_id?: string | null
          ezp_web_sku?: string | null
          ezp_weight?: string | null
          ezp_weight_uom?: string | null
          ezp_width?: string | null
        }
        Update: {
          ezp_alternate1?: string | null
          ezp_alternate2?: string | null
          ezp_alternate3?: string | null
          ezp_attr1?: string | null
          ezp_attr2?: string | null
          ezp_attr3?: string | null
          ezp_attr4?: string | null
          ezp_attr5?: string | null
          ezp_batch_managed?: string | null
          ezp_brand?: string | null
          ezp_catalog_id?: string | null
          ezp_category?: string | null
          ezp_color?: string | null
          ezp_curr_eff_date?: string | null
          ezp_curr_price?: number | null
          ezp_discontinue_date?: string | null
          ezp_discontinued?: string | null
          ezp_erp_code?: string | null
          ezp_family?: string | null
          ezp_featured?: string | null
          ezp_finish?: string | null
          ezp_future_eff_date?: string | null
          ezp_future_price?: number | null
          ezp_gross_weight?: string | null
          ezp_item_cat?: string | null
          ezp_length?: string | null
          ezp_length_uom?: string | null
          ezp_luxury?: string | null
          ezp_mat_pric_group?: string | null
          ezp_model?: string | null
          ezp_new_from?: string | null
          ezp_new_to?: string | null
          ezp_product_code?: string | null
          ezp_profit_center?: string | null
          ezp_replaces_item?: string | null
          ezp_serial_profile?: string | null
          ezp_size?: string | null
          ezp_sort?: number | null
          ezp_status?: string | null
          ezp_style?: string | null
          ezp_sub_category?: string | null
          ezp_sub_type?: string | null
          ezp_type?: string | null
          ezp_upc_code?: string | null
          ezp_volume?: string | null
          ezp_volume_uom?: string | null
          ezp_web_prod_id?: string | null
          ezp_web_sku?: string | null
          ezp_weight?: string | null
          ezp_weight_uom?: string | null
          ezp_width?: string | null
        }
        Relationships: []
      }
      ezc_profit_center: {
        Row: {
          epc_catalog_id: string | null
          epc_category_code: string | null
          epc_profit_center: string | null
        }
        Insert: {
          epc_catalog_id?: string | null
          epc_category_code?: string | null
          epc_profit_center?: string | null
        }
        Update: {
          epc_catalog_id?: string | null
          epc_category_code?: string | null
          epc_profit_center?: string | null
        }
        Relationships: []
      }
      ezc_projection_header: {
        Row: {
          ezpr_additional1: string | null
          ezpr_additional2: string | null
          ezpr_additional3: string | null
          ezpr_doe: string | null
          ezpr_period_end_date: string | null
          ezpr_period_start_date: string | null
          ezpr_periods: number | null
          ezpr_projectionid: string | null
          ezpr_soldto: string | null
          ezpr_syskey: string | null
          ezpr_userid: string | null
          ezpr_usertype: string | null
        }
        Insert: {
          ezpr_additional1?: string | null
          ezpr_additional2?: string | null
          ezpr_additional3?: string | null
          ezpr_doe?: string | null
          ezpr_period_end_date?: string | null
          ezpr_period_start_date?: string | null
          ezpr_periods?: number | null
          ezpr_projectionid?: string | null
          ezpr_soldto?: string | null
          ezpr_syskey?: string | null
          ezpr_userid?: string | null
          ezpr_usertype?: string | null
        }
        Update: {
          ezpr_additional1?: string | null
          ezpr_additional2?: string | null
          ezpr_additional3?: string | null
          ezpr_doe?: string | null
          ezpr_period_end_date?: string | null
          ezpr_period_start_date?: string | null
          ezpr_periods?: number | null
          ezpr_projectionid?: string | null
          ezpr_soldto?: string | null
          ezpr_syskey?: string | null
          ezpr_userid?: string | null
          ezpr_usertype?: string | null
        }
        Relationships: []
      }
      ezc_projection_lines: {
        Row: {
          ezpr_pack: string | null
          ezpr_prices: string | null
          ezpr_product: string | null
          ezpr_projectionid: string | null
          ezpr_status: string | null
          ezpr_values: string | null
        }
        Insert: {
          ezpr_pack?: string | null
          ezpr_prices?: string | null
          ezpr_product?: string | null
          ezpr_projectionid?: string | null
          ezpr_status?: string | null
          ezpr_values?: string | null
        }
        Update: {
          ezpr_pack?: string | null
          ezpr_prices?: string | null
          ezpr_product?: string | null
          ezpr_projectionid?: string | null
          ezpr_status?: string | null
          ezpr_values?: string | null
        }
        Relationships: []
      }
      ezc_promotional_codes: {
        Row: {
          epc_code: string | null
          epc_created_by: string | null
          epc_created_on: string | null
          epc_discount: number | null
          epc_ext1: string | null
          epc_ext2: string | null
          epc_ext3: string | null
          epc_mfr_id: string | null
          epc_modified_by: string | null
          epc_modified_on: string | null
          epc_number: string | null
          epc_prod_cat: string | null
          epc_promo_type: string | null
          epc_status: string | null
          epc_syskey: string | null
          epc_valid_from: string | null
          epc_valid_to: string | null
        }
        Insert: {
          epc_code?: string | null
          epc_created_by?: string | null
          epc_created_on?: string | null
          epc_discount?: number | null
          epc_ext1?: string | null
          epc_ext2?: string | null
          epc_ext3?: string | null
          epc_mfr_id?: string | null
          epc_modified_by?: string | null
          epc_modified_on?: string | null
          epc_number?: string | null
          epc_prod_cat?: string | null
          epc_promo_type?: string | null
          epc_status?: string | null
          epc_syskey?: string | null
          epc_valid_from?: string | null
          epc_valid_to?: string | null
        }
        Update: {
          epc_code?: string | null
          epc_created_by?: string | null
          epc_created_on?: string | null
          epc_discount?: number | null
          epc_ext1?: string | null
          epc_ext2?: string | null
          epc_ext3?: string | null
          epc_mfr_id?: string | null
          epc_modified_by?: string | null
          epc_modified_on?: string | null
          epc_number?: string | null
          epc_prod_cat?: string | null
          epc_promo_type?: string | null
          epc_status?: string | null
          epc_syskey?: string | null
          epc_valid_from?: string | null
          epc_valid_to?: string | null
        }
        Relationships: []
      }
      ezc_qcf_comments: {
        Row: {
          eqc_code: string | null
          eqc_comment_no: string | null
          eqc_comments: string | null
          eqc_date: string | null
          eqc_dest_user: string | null
          eqc_ext1: string | null
          eqc_ext2: string | null
          eqc_ext3: string | null
          eqc_query_map: string | null
          eqc_type: string | null
          eqc_user: string | null
        }
        Insert: {
          eqc_code?: string | null
          eqc_comment_no?: string | null
          eqc_comments?: string | null
          eqc_date?: string | null
          eqc_dest_user?: string | null
          eqc_ext1?: string | null
          eqc_ext2?: string | null
          eqc_ext3?: string | null
          eqc_query_map?: string | null
          eqc_type?: string | null
          eqc_user?: string | null
        }
        Update: {
          eqc_code?: string | null
          eqc_comment_no?: string | null
          eqc_comments?: string | null
          eqc_date?: string | null
          eqc_dest_user?: string | null
          eqc_ext1?: string | null
          eqc_ext2?: string | null
          eqc_ext3?: string | null
          eqc_query_map?: string | null
          eqc_type?: string | null
          eqc_user?: string | null
        }
        Relationships: []
      }
      ezc_registration_form_dtls: {
        Row: {
          erfd_city: string | null
          erfd_comments: string | null
          erfd_company: string | null
          erfd_country: string | null
          erfd_customer_number: string | null
          erfd_email: string | null
          erfd_email_text: string | null
          erfd_ext1: string | null
          erfd_ext2: string | null
          erfd_ext3: string | null
          erfd_first_name: string | null
          erfd_gatekeeper: string | null
          erfd_gatekeeper_man: string | null
          erfd_gatekeeper_man_email: string | null
          erfd_gatekeeper_man_phone: string | null
          erfd_gatekeeper_man_title: string | null
          erfd_last_name: string | null
          erfd_partner_id: string | null
          erfd_phone_no: string | null
          erfd_reg_id: number
          erfd_requested_on: string | null
          erfd_sales_man_id: string | null
          erfd_sales_manager: string | null
          erfd_state: string | null
          erfd_street: string | null
          erfd_user_id: string | null
          erfd_zip: string | null
        }
        Insert: {
          erfd_city?: string | null
          erfd_comments?: string | null
          erfd_company?: string | null
          erfd_country?: string | null
          erfd_customer_number?: string | null
          erfd_email?: string | null
          erfd_email_text?: string | null
          erfd_ext1?: string | null
          erfd_ext2?: string | null
          erfd_ext3?: string | null
          erfd_first_name?: string | null
          erfd_gatekeeper?: string | null
          erfd_gatekeeper_man?: string | null
          erfd_gatekeeper_man_email?: string | null
          erfd_gatekeeper_man_phone?: string | null
          erfd_gatekeeper_man_title?: string | null
          erfd_last_name?: string | null
          erfd_partner_id?: string | null
          erfd_phone_no?: string | null
          erfd_reg_id: number
          erfd_requested_on?: string | null
          erfd_sales_man_id?: string | null
          erfd_sales_manager?: string | null
          erfd_state?: string | null
          erfd_street?: string | null
          erfd_user_id?: string | null
          erfd_zip?: string | null
        }
        Update: {
          erfd_city?: string | null
          erfd_comments?: string | null
          erfd_company?: string | null
          erfd_country?: string | null
          erfd_customer_number?: string | null
          erfd_email?: string | null
          erfd_email_text?: string | null
          erfd_ext1?: string | null
          erfd_ext2?: string | null
          erfd_ext3?: string | null
          erfd_first_name?: string | null
          erfd_gatekeeper?: string | null
          erfd_gatekeeper_man?: string | null
          erfd_gatekeeper_man_email?: string | null
          erfd_gatekeeper_man_phone?: string | null
          erfd_gatekeeper_man_title?: string | null
          erfd_last_name?: string | null
          erfd_partner_id?: string | null
          erfd_phone_no?: string | null
          erfd_reg_id?: number
          erfd_requested_on?: string | null
          erfd_sales_man_id?: string | null
          erfd_sales_manager?: string | null
          erfd_state?: string | null
          erfd_street?: string | null
          erfd_user_id?: string | null
          erfd_zip?: string | null
        }
        Relationships: []
      }
      ezc_rep_customer_sync: {
        Row: {
          ercs_sales_group: string | null
          ercs_sold_to: string | null
          ercs_sync_date: string | null
          ercs_syskey: string | null
        }
        Insert: {
          ercs_sales_group?: string | null
          ercs_sold_to?: string | null
          ercs_sync_date?: string | null
          ercs_syskey?: string | null
        }
        Update: {
          ercs_sales_group?: string | null
          ercs_sold_to?: string | null
          ercs_sync_date?: string | null
          ercs_syskey?: string | null
        }
        Relationships: []
      }
      ezc_report_exec_store: {
        Row: {
          ers_counter: number | null
          ers_creation_date: string | null
          ers_creation_time: string | null
          ers_email: string | null
          ers_ext1: string | null
          ers_ext2: string | null
          ers_report_format: string | null
          ers_report_no: number | null
          ers_report_path: string | null
          ers_spool_no: string | null
          ers_system_no: number | null
          ers_user_id: string | null
          ers_view_flag: string | null
        }
        Insert: {
          ers_counter?: number | null
          ers_creation_date?: string | null
          ers_creation_time?: string | null
          ers_email?: string | null
          ers_ext1?: string | null
          ers_ext2?: string | null
          ers_report_format?: string | null
          ers_report_no?: number | null
          ers_report_path?: string | null
          ers_spool_no?: string | null
          ers_system_no?: number | null
          ers_user_id?: string | null
          ers_view_flag?: string | null
        }
        Update: {
          ers_counter?: number | null
          ers_creation_date?: string | null
          ers_creation_time?: string | null
          ers_email?: string | null
          ers_ext1?: string | null
          ers_ext2?: string | null
          ers_report_format?: string | null
          ers_report_no?: number | null
          ers_report_path?: string | null
          ers_spool_no?: string | null
          ers_system_no?: number | null
          ers_user_id?: string | null
          ers_view_flag?: string | null
        }
        Relationships: []
      }
      ezc_report_info: {
        Row: {
          eri_business_domain: string | null
          eri_exec_type: string | null
          eri_ext1: string | null
          eri_ext2: string | null
          eri_lang: string | null
          eri_report_desc: string | null
          eri_report_name: string | null
          eri_report_no: number | null
          eri_report_status: string | null
          eri_report_type: number | null
          eri_system_no: number | null
          eri_visible_level: string | null
        }
        Insert: {
          eri_business_domain?: string | null
          eri_exec_type?: string | null
          eri_ext1?: string | null
          eri_ext2?: string | null
          eri_lang?: string | null
          eri_report_desc?: string | null
          eri_report_name?: string | null
          eri_report_no?: number | null
          eri_report_status?: string | null
          eri_report_type?: number | null
          eri_system_no?: number | null
          eri_visible_level?: string | null
        }
        Update: {
          eri_business_domain?: string | null
          eri_exec_type?: string | null
          eri_ext1?: string | null
          eri_ext2?: string | null
          eri_lang?: string | null
          eri_report_desc?: string | null
          eri_report_name?: string | null
          eri_report_no?: number | null
          eri_report_status?: string | null
          eri_report_type?: number | null
          eri_system_no?: number | null
          eri_visible_level?: string | null
        }
        Relationships: []
      }
      ezc_report_params: {
        Row: {
          erp_chk_defaults: string | null
          erp_data_type: string | null
          erp_ext1: string | null
          erp_ext2: string | null
          erp_is_customer: string | null
          erp_is_hidden: string | null
          erp_is_mandatory: string | null
          erp_length: number | null
          erp_method_name: string | null
          erp_param_desc: string | null
          erp_param_name: string | null
          erp_param_no: number | null
          erp_param_type: string | null
          erp_report_no: number | null
        }
        Insert: {
          erp_chk_defaults?: string | null
          erp_data_type?: string | null
          erp_ext1?: string | null
          erp_ext2?: string | null
          erp_is_customer?: string | null
          erp_is_hidden?: string | null
          erp_is_mandatory?: string | null
          erp_length?: number | null
          erp_method_name?: string | null
          erp_param_desc?: string | null
          erp_param_name?: string | null
          erp_param_no?: number | null
          erp_param_type?: string | null
          erp_report_no?: number | null
        }
        Update: {
          erp_chk_defaults?: string | null
          erp_data_type?: string | null
          erp_ext1?: string | null
          erp_ext2?: string | null
          erp_is_customer?: string | null
          erp_is_hidden?: string | null
          erp_is_mandatory?: string | null
          erp_length?: number | null
          erp_method_name?: string | null
          erp_param_desc?: string | null
          erp_param_name?: string | null
          erp_param_no?: number | null
          erp_param_type?: string | null
          erp_report_no?: number | null
        }
        Relationships: []
      }
      ezc_report_values: {
        Row: {
          erv_ext1: string | null
          erv_ext2: string | null
          erv_operator: string | null
          erv_param_no: number | null
          erv_param_value: string | null
          erv_param_value_high: string | null
          erv_report_no: number | null
          erv_retrieval_mode: string | null
        }
        Insert: {
          erv_ext1?: string | null
          erv_ext2?: string | null
          erv_operator?: string | null
          erv_param_no?: number | null
          erv_param_value?: string | null
          erv_param_value_high?: string | null
          erv_report_no?: number | null
          erv_retrieval_mode?: string | null
        }
        Update: {
          erv_ext1?: string | null
          erv_ext2?: string | null
          erv_operator?: string | null
          erv_param_no?: number | null
          erv_param_value?: string | null
          erv_param_value_high?: string | null
          erv_report_no?: number | null
          erv_retrieval_mode?: string | null
        }
        Relationships: []
      }
      ezc_role_auth: {
        Row: {
          era_actions_or_statuses: string | null
          era_auth_key: string | null
          era_auth_value: string | null
          era_role_nr: string | null
          era_sys_no: number | null
        }
        Insert: {
          era_actions_or_statuses?: string | null
          era_auth_key?: string | null
          era_auth_value?: string | null
          era_role_nr?: string | null
          era_sys_no?: number | null
        }
        Update: {
          era_actions_or_statuses?: string | null
          era_auth_key?: string | null
          era_auth_value?: string | null
          era_role_nr?: string | null
          era_sys_no?: number | null
        }
        Relationships: []
      }
      ezc_roles_by_user: {
        Row: {
          erbu_role: number | null
          erbu_system_key: number | null
          erbu_user_id: string | null
        }
        Insert: {
          erbu_role?: number | null
          erbu_system_key?: number | null
          erbu_user_id?: string | null
        }
        Update: {
          erbu_role?: number | null
          erbu_system_key?: number | null
          erbu_user_id?: string | null
        }
        Relationships: []
      }
      ezc_saledoc_mails: {
        Row: {
          esm_cc: string | null
          esm_edd: string | null
          esm_plant: string | null
          esm_product_code: string | null
          esm_to: string | null
        }
        Insert: {
          esm_cc?: string | null
          esm_edd?: string | null
          esm_plant?: string | null
          esm_product_code?: string | null
          esm_to?: string | null
        }
        Update: {
          esm_cc?: string | null
          esm_edd?: string | null
          esm_plant?: string | null
          esm_product_code?: string | null
          esm_to?: string | null
        }
        Relationships: []
      }
      ezc_sales_discounts: {
        Row: {
          esd_created_by: string | null
          esd_created_on: string | null
          esd_customer: string | null
          esd_disc_no: string | null
          esd_disc_type: string | null
          esd_discount: number | null
          esd_ext1: string | null
          esd_ext2: string | null
          esd_ext3: string | null
          esd_mfr_id: string | null
          esd_modified_by: string | null
          esd_modified_on: string | null
          esd_prod_cat: string | null
          esd_status: string | null
          esd_syskey: string | null
          esd_valid_from: string | null
          esd_valid_to: string | null
        }
        Insert: {
          esd_created_by?: string | null
          esd_created_on?: string | null
          esd_customer?: string | null
          esd_disc_no?: string | null
          esd_disc_type?: string | null
          esd_discount?: number | null
          esd_ext1?: string | null
          esd_ext2?: string | null
          esd_ext3?: string | null
          esd_mfr_id?: string | null
          esd_modified_by?: string | null
          esd_modified_on?: string | null
          esd_prod_cat?: string | null
          esd_status?: string | null
          esd_syskey?: string | null
          esd_valid_from?: string | null
          esd_valid_to?: string | null
        }
        Update: {
          esd_created_by?: string | null
          esd_created_on?: string | null
          esd_customer?: string | null
          esd_disc_no?: string | null
          esd_disc_type?: string | null
          esd_discount?: number | null
          esd_ext1?: string | null
          esd_ext2?: string | null
          esd_ext3?: string | null
          esd_mfr_id?: string | null
          esd_modified_by?: string | null
          esd_modified_on?: string | null
          esd_prod_cat?: string | null
          esd_status?: string | null
          esd_syskey?: string | null
          esd_valid_from?: string | null
          esd_valid_to?: string | null
        }
        Relationships: []
      }
      ezc_sales_doc_header: {
        Row: {
          edsh_freight: string | null
          edsh_text3: string | null
          esdh_actby: string | null
          esdh_agent_code: string | null
          esdh_back_end_order: string | null
          esdh_bill_block: string | null
          esdh_billto_addr1: string | null
          esdh_billto_addr2: string | null
          esdh_billto_city: string | null
          esdh_billto_name: string | null
          esdh_billto_phone: string | null
          esdh_billto_pin: string | null
          esdh_billto_state: string | null
          esdh_billto_street: string | null
          esdh_carrier_acc: string | null
          esdh_class2: string | null
          esdh_collect_no: string | null
          esdh_compl_dlv: string | null
          esdh_create_on: string
          esdh_created_by: string | null
          esdh_ct_valid_f: string | null
          esdh_ct_valid_t: string | null
          esdh_cust_group: string | null
          esdh_cust_grp1: string | null
          esdh_cust_grp2: string | null
          esdh_cust_grp3: string | null
          esdh_cust_grp4: string | null
          esdh_cust_grp5: string | null
          esdh_date_type: string | null
          esdh_defcat_l1: string | null
          esdh_defcat_l2: string | null
          esdh_defcat_l3: string | null
          esdh_del_flag: string | null
          esdh_discount_cash: number | null
          esdh_discount_percentage: number | null
          esdh_distr_chan: string | null
          esdh_division: string | null
          esdh_dlv_block: string | null
          esdh_doc_currency: string | null
          esdh_doc_number: string | null
          esdh_doc_type: string | null
          esdh_freight_ins: string | null
          esdh_freight_price: string | null
          esdh_freight_weight: number | null
          esdh_incoterms1: string | null
          esdh_incoterms2: string | null
          esdh_modified_by: string | null
          esdh_modified_on: string | null
          esdh_name: string | null
          esdh_net_value: number | null
          esdh_ord_reason: string | null
          esdh_order_date: string | null
          esdh_pmnttrms: string | null
          esdh_po_method: string | null
          esdh_po_no: string | null
          esdh_po_supplem: string | null
          esdh_price_date: string | null
          esdh_price_grp: string | null
          esdh_price_list: string | null
          esdh_promo_code: string | null
          esdh_purch_date: string | null
          esdh_purch_no: string | null
          esdh_qt_valid_f: string | null
          esdh_qt_valid_t: string | null
          esdh_ref_1: string | null
          esdh_ref_doc: string | null
          esdh_ref_doc_no: string | null
          esdh_req_date_h: string | null
          esdh_res1: string | null
          esdh_res2: string | null
          esdh_sales_dist: string | null
          esdh_sales_grp: string | null
          esdh_sales_off: string | null
          esdh_sales_org: string | null
          esdh_sap_so: string | null
          esdh_save_flag: string | null
          esdh_ship_method: string | null
          esdh_ship_to: string | null
          esdh_shipto_addr_1: string | null
          esdh_shipto_addr_2: string | null
          esdh_shipto_addr_3: string | null
          esdh_shipto_country: string | null
          esdh_shipto_pin: string | null
          esdh_shipto_state: string | null
          esdh_sold_to: string | null
          esdh_soldto_addr_1: string | null
          esdh_soldto_addr_2: string | null
          esdh_soldto_addr_3: string | null
          esdh_soldto_country: string | null
          esdh_soldto_pin: string | null
          esdh_soldto_state: string | null
          esdh_status: string | null
          esdh_status_date: string | null
          esdh_sys_key: string | null
          esdh_telephone: string | null
          esdh_template_name: string | null
          esdh_text1: string | null
          esdh_text2: string | null
          esdh_text4: string | null
          esdh_toact: string | null
          esdh_transfer_date: string | null
          esdh_type: string | null
        }
        Insert: {
          edsh_freight?: string | null
          edsh_text3?: string | null
          esdh_actby?: string | null
          esdh_agent_code?: string | null
          esdh_back_end_order?: string | null
          esdh_bill_block?: string | null
          esdh_billto_addr1?: string | null
          esdh_billto_addr2?: string | null
          esdh_billto_city?: string | null
          esdh_billto_name?: string | null
          esdh_billto_phone?: string | null
          esdh_billto_pin?: string | null
          esdh_billto_state?: string | null
          esdh_billto_street?: string | null
          esdh_carrier_acc?: string | null
          esdh_class2?: string | null
          esdh_collect_no?: string | null
          esdh_compl_dlv?: string | null
          esdh_create_on: string
          esdh_created_by?: string | null
          esdh_ct_valid_f?: string | null
          esdh_ct_valid_t?: string | null
          esdh_cust_group?: string | null
          esdh_cust_grp1?: string | null
          esdh_cust_grp2?: string | null
          esdh_cust_grp3?: string | null
          esdh_cust_grp4?: string | null
          esdh_cust_grp5?: string | null
          esdh_date_type?: string | null
          esdh_defcat_l1?: string | null
          esdh_defcat_l2?: string | null
          esdh_defcat_l3?: string | null
          esdh_del_flag?: string | null
          esdh_discount_cash?: number | null
          esdh_discount_percentage?: number | null
          esdh_distr_chan?: string | null
          esdh_division?: string | null
          esdh_dlv_block?: string | null
          esdh_doc_currency?: string | null
          esdh_doc_number?: string | null
          esdh_doc_type?: string | null
          esdh_freight_ins?: string | null
          esdh_freight_price?: string | null
          esdh_freight_weight?: number | null
          esdh_incoterms1?: string | null
          esdh_incoterms2?: string | null
          esdh_modified_by?: string | null
          esdh_modified_on?: string | null
          esdh_name?: string | null
          esdh_net_value?: number | null
          esdh_ord_reason?: string | null
          esdh_order_date?: string | null
          esdh_pmnttrms?: string | null
          esdh_po_method?: string | null
          esdh_po_no?: string | null
          esdh_po_supplem?: string | null
          esdh_price_date?: string | null
          esdh_price_grp?: string | null
          esdh_price_list?: string | null
          esdh_promo_code?: string | null
          esdh_purch_date?: string | null
          esdh_purch_no?: string | null
          esdh_qt_valid_f?: string | null
          esdh_qt_valid_t?: string | null
          esdh_ref_1?: string | null
          esdh_ref_doc?: string | null
          esdh_ref_doc_no?: string | null
          esdh_req_date_h?: string | null
          esdh_res1?: string | null
          esdh_res2?: string | null
          esdh_sales_dist?: string | null
          esdh_sales_grp?: string | null
          esdh_sales_off?: string | null
          esdh_sales_org?: string | null
          esdh_sap_so?: string | null
          esdh_save_flag?: string | null
          esdh_ship_method?: string | null
          esdh_ship_to?: string | null
          esdh_shipto_addr_1?: string | null
          esdh_shipto_addr_2?: string | null
          esdh_shipto_addr_3?: string | null
          esdh_shipto_country?: string | null
          esdh_shipto_pin?: string | null
          esdh_shipto_state?: string | null
          esdh_sold_to?: string | null
          esdh_soldto_addr_1?: string | null
          esdh_soldto_addr_2?: string | null
          esdh_soldto_addr_3?: string | null
          esdh_soldto_country?: string | null
          esdh_soldto_pin?: string | null
          esdh_soldto_state?: string | null
          esdh_status?: string | null
          esdh_status_date?: string | null
          esdh_sys_key?: string | null
          esdh_telephone?: string | null
          esdh_template_name?: string | null
          esdh_text1?: string | null
          esdh_text2?: string | null
          esdh_text4?: string | null
          esdh_toact?: string | null
          esdh_transfer_date?: string | null
          esdh_type?: string | null
        }
        Update: {
          edsh_freight?: string | null
          edsh_text3?: string | null
          esdh_actby?: string | null
          esdh_agent_code?: string | null
          esdh_back_end_order?: string | null
          esdh_bill_block?: string | null
          esdh_billto_addr1?: string | null
          esdh_billto_addr2?: string | null
          esdh_billto_city?: string | null
          esdh_billto_name?: string | null
          esdh_billto_phone?: string | null
          esdh_billto_pin?: string | null
          esdh_billto_state?: string | null
          esdh_billto_street?: string | null
          esdh_carrier_acc?: string | null
          esdh_class2?: string | null
          esdh_collect_no?: string | null
          esdh_compl_dlv?: string | null
          esdh_create_on?: string
          esdh_created_by?: string | null
          esdh_ct_valid_f?: string | null
          esdh_ct_valid_t?: string | null
          esdh_cust_group?: string | null
          esdh_cust_grp1?: string | null
          esdh_cust_grp2?: string | null
          esdh_cust_grp3?: string | null
          esdh_cust_grp4?: string | null
          esdh_cust_grp5?: string | null
          esdh_date_type?: string | null
          esdh_defcat_l1?: string | null
          esdh_defcat_l2?: string | null
          esdh_defcat_l3?: string | null
          esdh_del_flag?: string | null
          esdh_discount_cash?: number | null
          esdh_discount_percentage?: number | null
          esdh_distr_chan?: string | null
          esdh_division?: string | null
          esdh_dlv_block?: string | null
          esdh_doc_currency?: string | null
          esdh_doc_number?: string | null
          esdh_doc_type?: string | null
          esdh_freight_ins?: string | null
          esdh_freight_price?: string | null
          esdh_freight_weight?: number | null
          esdh_incoterms1?: string | null
          esdh_incoterms2?: string | null
          esdh_modified_by?: string | null
          esdh_modified_on?: string | null
          esdh_name?: string | null
          esdh_net_value?: number | null
          esdh_ord_reason?: string | null
          esdh_order_date?: string | null
          esdh_pmnttrms?: string | null
          esdh_po_method?: string | null
          esdh_po_no?: string | null
          esdh_po_supplem?: string | null
          esdh_price_date?: string | null
          esdh_price_grp?: string | null
          esdh_price_list?: string | null
          esdh_promo_code?: string | null
          esdh_purch_date?: string | null
          esdh_purch_no?: string | null
          esdh_qt_valid_f?: string | null
          esdh_qt_valid_t?: string | null
          esdh_ref_1?: string | null
          esdh_ref_doc?: string | null
          esdh_ref_doc_no?: string | null
          esdh_req_date_h?: string | null
          esdh_res1?: string | null
          esdh_res2?: string | null
          esdh_sales_dist?: string | null
          esdh_sales_grp?: string | null
          esdh_sales_off?: string | null
          esdh_sales_org?: string | null
          esdh_sap_so?: string | null
          esdh_save_flag?: string | null
          esdh_ship_method?: string | null
          esdh_ship_to?: string | null
          esdh_shipto_addr_1?: string | null
          esdh_shipto_addr_2?: string | null
          esdh_shipto_addr_3?: string | null
          esdh_shipto_country?: string | null
          esdh_shipto_pin?: string | null
          esdh_shipto_state?: string | null
          esdh_sold_to?: string | null
          esdh_soldto_addr_1?: string | null
          esdh_soldto_addr_2?: string | null
          esdh_soldto_addr_3?: string | null
          esdh_soldto_country?: string | null
          esdh_soldto_pin?: string | null
          esdh_soldto_state?: string | null
          esdh_status?: string | null
          esdh_status_date?: string | null
          esdh_sys_key?: string | null
          esdh_telephone?: string | null
          esdh_template_name?: string | null
          esdh_text1?: string | null
          esdh_text2?: string | null
          esdh_text4?: string | null
          esdh_toact?: string | null
          esdh_transfer_date?: string | null
          esdh_type?: string | null
        }
        Relationships: []
      }
      ezc_sales_doc_items: {
        Row: {
          esdi_account_assign_group: string | null
          esdi_avail_check_group: string | null
          esdi_back_end_item: string | null
          esdi_back_end_order: string | null
          esdi_base_unit_of_measure: string | null
          esdi_batch_no: string | null
          esdi_batch_split_allowed: string | null
          esdi_buss_area: string | null
          esdi_buss_transaction_type: string | null
          esdi_cash_discount_indicator: string | null
          esdi_commited_price: number | null
          esdi_confirmed_qty: number | null
          esdi_conv_factor_su_to_bu: number | null
          esdi_created_by: string | null
          esdi_cust_po_lineno: string | null
          esdi_cust_sku: string | null
          esdi_customer_mat: string | null
          esdi_date_record_created: string | null
          esdi_del_flag: string | null
          esdi_delivery_priority_plant: string | null
          esdi_desired_price: number | null
          esdi_disc_code: string | null
          esdi_display_flag: string | null
          esdi_distr_chan: string | null
          esdi_division: string | null
          esdi_dlv_block: string | null
          esdi_doc_currency: string | null
          esdi_foc: number | null
          esdi_freight_ins: string | null
          esdi_freight_weight: number | null
          esdi_incoterms1: string | null
          esdi_incoterms2: string | null
          esdi_item_category: string | null
          esdi_item_multiplier: string | null
          esdi_item_no_of_customer: number | null
          esdi_item_type: string | null
          esdi_item_upc: string | null
          esdi_list_price: number | null
          esdi_listprice: string | null
          esdi_mat_freight_group: string | null
          esdi_material: string | null
          esdi_material_group: string | null
          esdi_net_price: number | null
          esdi_net_val_of_order: number | null
          esdi_notes: string | null
          esdi_order_type: string | null
          esdi_outline_agr_val: number | null
          esdi_plant: string | null
          esdi_points: string | null
          esdi_points_group: string | null
          esdi_preference_ind_exp_imp: string | null
          esdi_pricing_group: string | null
          esdi_pricing_ref_mat: string | null
          esdi_product_group: string | null
          esdi_promise_date: string | null
          esdi_promo_code: string | null
          esdi_qty_in_base_unit: number | null
          esdi_qty_in_sales_unit: number | null
          esdi_quickship_flag: string | null
          esdi_quote_line_no: string | null
          esdi_quote_ref_no: string | null
          esdi_reason_for_rejection: string | null
          esdi_reason_mat_substitution: string | null
          esdi_ref_doc_item: number | null
          esdi_ref_question_no: string | null
          esdi_relevant_for_billing: string | null
          esdi_relevent_for_delivry: string | null
          esdi_remarks: string | null
          esdi_req_date: string | null
          esdi_req_qty: number | null
          esdi_sales_doc: string | null
          esdi_sales_doc_item: number | null
          esdi_sales_org: string | null
          esdi_sales_unit: string | null
          esdi_sap_price: number | null
          esdi_ship_to: string | null
          esdi_shipping_point: string | null
          esdi_short_text: string | null
          esdi_statistical_values: string | null
          esdi_statistics_dated: string | null
          esdi_storage_loc: string | null
          esdi_sys_key: string | null
          esdi_vip_flag: string | null
        }
        Insert: {
          esdi_account_assign_group?: string | null
          esdi_avail_check_group?: string | null
          esdi_back_end_item?: string | null
          esdi_back_end_order?: string | null
          esdi_base_unit_of_measure?: string | null
          esdi_batch_no?: string | null
          esdi_batch_split_allowed?: string | null
          esdi_buss_area?: string | null
          esdi_buss_transaction_type?: string | null
          esdi_cash_discount_indicator?: string | null
          esdi_commited_price?: number | null
          esdi_confirmed_qty?: number | null
          esdi_conv_factor_su_to_bu?: number | null
          esdi_created_by?: string | null
          esdi_cust_po_lineno?: string | null
          esdi_cust_sku?: string | null
          esdi_customer_mat?: string | null
          esdi_date_record_created?: string | null
          esdi_del_flag?: string | null
          esdi_delivery_priority_plant?: string | null
          esdi_desired_price?: number | null
          esdi_disc_code?: string | null
          esdi_display_flag?: string | null
          esdi_distr_chan?: string | null
          esdi_division?: string | null
          esdi_dlv_block?: string | null
          esdi_doc_currency?: string | null
          esdi_foc?: number | null
          esdi_freight_ins?: string | null
          esdi_freight_weight?: number | null
          esdi_incoterms1?: string | null
          esdi_incoterms2?: string | null
          esdi_item_category?: string | null
          esdi_item_multiplier?: string | null
          esdi_item_no_of_customer?: number | null
          esdi_item_type?: string | null
          esdi_item_upc?: string | null
          esdi_list_price?: number | null
          esdi_listprice?: string | null
          esdi_mat_freight_group?: string | null
          esdi_material?: string | null
          esdi_material_group?: string | null
          esdi_net_price?: number | null
          esdi_net_val_of_order?: number | null
          esdi_notes?: string | null
          esdi_order_type?: string | null
          esdi_outline_agr_val?: number | null
          esdi_plant?: string | null
          esdi_points?: string | null
          esdi_points_group?: string | null
          esdi_preference_ind_exp_imp?: string | null
          esdi_pricing_group?: string | null
          esdi_pricing_ref_mat?: string | null
          esdi_product_group?: string | null
          esdi_promise_date?: string | null
          esdi_promo_code?: string | null
          esdi_qty_in_base_unit?: number | null
          esdi_qty_in_sales_unit?: number | null
          esdi_quickship_flag?: string | null
          esdi_quote_line_no?: string | null
          esdi_quote_ref_no?: string | null
          esdi_reason_for_rejection?: string | null
          esdi_reason_mat_substitution?: string | null
          esdi_ref_doc_item?: number | null
          esdi_ref_question_no?: string | null
          esdi_relevant_for_billing?: string | null
          esdi_relevent_for_delivry?: string | null
          esdi_remarks?: string | null
          esdi_req_date?: string | null
          esdi_req_qty?: number | null
          esdi_sales_doc?: string | null
          esdi_sales_doc_item?: number | null
          esdi_sales_org?: string | null
          esdi_sales_unit?: string | null
          esdi_sap_price?: number | null
          esdi_ship_to?: string | null
          esdi_shipping_point?: string | null
          esdi_short_text?: string | null
          esdi_statistical_values?: string | null
          esdi_statistics_dated?: string | null
          esdi_storage_loc?: string | null
          esdi_sys_key?: string | null
          esdi_vip_flag?: string | null
        }
        Update: {
          esdi_account_assign_group?: string | null
          esdi_avail_check_group?: string | null
          esdi_back_end_item?: string | null
          esdi_back_end_order?: string | null
          esdi_base_unit_of_measure?: string | null
          esdi_batch_no?: string | null
          esdi_batch_split_allowed?: string | null
          esdi_buss_area?: string | null
          esdi_buss_transaction_type?: string | null
          esdi_cash_discount_indicator?: string | null
          esdi_commited_price?: number | null
          esdi_confirmed_qty?: number | null
          esdi_conv_factor_su_to_bu?: number | null
          esdi_created_by?: string | null
          esdi_cust_po_lineno?: string | null
          esdi_cust_sku?: string | null
          esdi_customer_mat?: string | null
          esdi_date_record_created?: string | null
          esdi_del_flag?: string | null
          esdi_delivery_priority_plant?: string | null
          esdi_desired_price?: number | null
          esdi_disc_code?: string | null
          esdi_display_flag?: string | null
          esdi_distr_chan?: string | null
          esdi_division?: string | null
          esdi_dlv_block?: string | null
          esdi_doc_currency?: string | null
          esdi_foc?: number | null
          esdi_freight_ins?: string | null
          esdi_freight_weight?: number | null
          esdi_incoterms1?: string | null
          esdi_incoterms2?: string | null
          esdi_item_category?: string | null
          esdi_item_multiplier?: string | null
          esdi_item_no_of_customer?: number | null
          esdi_item_type?: string | null
          esdi_item_upc?: string | null
          esdi_list_price?: number | null
          esdi_listprice?: string | null
          esdi_mat_freight_group?: string | null
          esdi_material?: string | null
          esdi_material_group?: string | null
          esdi_net_price?: number | null
          esdi_net_val_of_order?: number | null
          esdi_notes?: string | null
          esdi_order_type?: string | null
          esdi_outline_agr_val?: number | null
          esdi_plant?: string | null
          esdi_points?: string | null
          esdi_points_group?: string | null
          esdi_preference_ind_exp_imp?: string | null
          esdi_pricing_group?: string | null
          esdi_pricing_ref_mat?: string | null
          esdi_product_group?: string | null
          esdi_promise_date?: string | null
          esdi_promo_code?: string | null
          esdi_qty_in_base_unit?: number | null
          esdi_qty_in_sales_unit?: number | null
          esdi_quickship_flag?: string | null
          esdi_quote_line_no?: string | null
          esdi_quote_ref_no?: string | null
          esdi_reason_for_rejection?: string | null
          esdi_reason_mat_substitution?: string | null
          esdi_ref_doc_item?: number | null
          esdi_ref_question_no?: string | null
          esdi_relevant_for_billing?: string | null
          esdi_relevent_for_delivry?: string | null
          esdi_remarks?: string | null
          esdi_req_date?: string | null
          esdi_req_qty?: number | null
          esdi_sales_doc?: string | null
          esdi_sales_doc_item?: number | null
          esdi_sales_org?: string | null
          esdi_sales_unit?: string | null
          esdi_sap_price?: number | null
          esdi_ship_to?: string | null
          esdi_shipping_point?: string | null
          esdi_short_text?: string | null
          esdi_statistical_values?: string | null
          esdi_statistics_dated?: string | null
          esdi_storage_loc?: string | null
          esdi_sys_key?: string | null
          esdi_vip_flag?: string | null
        }
        Relationships: []
      }
      ezc_sales_doc_partners: {
        Row: {
          esdp_back_end_number: string | null
          esdp_back_itm_number: string | null
          esdp_city: string | null
          esdp_country: string | null
          esdp_district: string | null
          esdp_erp_customer_number: string | null
          esdp_ezc_customer_number: string | null
          esdp_fax_number: string | null
          esdp_itm_number: number | null
          esdp_name: string | null
          esdp_name_2: string | null
          esdp_name_3: string | null
          esdp_name_4: string | null
          esdp_partner_function: string | null
          esdp_partner_number: string | null
          esdp_po_box: string | null
          esdp_postl_code: string | null
          esdp_region: string | null
          esdp_sales_area: string | null
          esdp_sales_doc: string | null
          esdp_street: string | null
          esdp_taxjurcode: string | null
          esdp_telephone: string | null
          esdp_telephone2: string | null
          esdp_teletex_no: string | null
          esdp_telex_no: string | null
          esdp_title: string | null
          esdp_transpzone: string | null
          esdp_unload_pt: string | null
        }
        Insert: {
          esdp_back_end_number?: string | null
          esdp_back_itm_number?: string | null
          esdp_city?: string | null
          esdp_country?: string | null
          esdp_district?: string | null
          esdp_erp_customer_number?: string | null
          esdp_ezc_customer_number?: string | null
          esdp_fax_number?: string | null
          esdp_itm_number?: number | null
          esdp_name?: string | null
          esdp_name_2?: string | null
          esdp_name_3?: string | null
          esdp_name_4?: string | null
          esdp_partner_function?: string | null
          esdp_partner_number?: string | null
          esdp_po_box?: string | null
          esdp_postl_code?: string | null
          esdp_region?: string | null
          esdp_sales_area?: string | null
          esdp_sales_doc?: string | null
          esdp_street?: string | null
          esdp_taxjurcode?: string | null
          esdp_telephone?: string | null
          esdp_telephone2?: string | null
          esdp_teletex_no?: string | null
          esdp_telex_no?: string | null
          esdp_title?: string | null
          esdp_transpzone?: string | null
          esdp_unload_pt?: string | null
        }
        Update: {
          esdp_back_end_number?: string | null
          esdp_back_itm_number?: string | null
          esdp_city?: string | null
          esdp_country?: string | null
          esdp_district?: string | null
          esdp_erp_customer_number?: string | null
          esdp_ezc_customer_number?: string | null
          esdp_fax_number?: string | null
          esdp_itm_number?: number | null
          esdp_name?: string | null
          esdp_name_2?: string | null
          esdp_name_3?: string | null
          esdp_name_4?: string | null
          esdp_partner_function?: string | null
          esdp_partner_number?: string | null
          esdp_po_box?: string | null
          esdp_postl_code?: string | null
          esdp_region?: string | null
          esdp_sales_area?: string | null
          esdp_sales_doc?: string | null
          esdp_street?: string | null
          esdp_taxjurcode?: string | null
          esdp_telephone?: string | null
          esdp_telephone2?: string | null
          esdp_teletex_no?: string | null
          esdp_telex_no?: string | null
          esdp_title?: string | null
          esdp_transpzone?: string | null
          esdp_unload_pt?: string | null
        }
        Relationships: []
      }
      ezc_sap_credentials: {
        Row: {
          esc_additional_headers: Json | null
          esc_authentication: string | null
          esc_base_url: string
          esc_client_id: string | null
          esc_client_secret: string | null
          esc_created_at: string | null
          esc_ext1: string | null
          esc_ext2: string | null
          esc_ext3: string | null
          esc_id: number
          esc_is_active: boolean | null
          esc_name: string
          esc_password: string | null
          esc_proxy_type: string | null
          esc_system_type: string | null
          esc_token_url: string | null
          esc_updated_at: string | null
          esc_url_id: string | null
          esc_user_name: string | null
        }
        Insert: {
          esc_additional_headers?: Json | null
          esc_authentication?: string | null
          esc_base_url: string
          esc_client_id?: string | null
          esc_client_secret?: string | null
          esc_created_at?: string | null
          esc_ext1?: string | null
          esc_ext2?: string | null
          esc_ext3?: string | null
          esc_id: number
          esc_is_active?: boolean | null
          esc_name: string
          esc_password?: string | null
          esc_proxy_type?: string | null
          esc_system_type?: string | null
          esc_token_url?: string | null
          esc_updated_at?: string | null
          esc_url_id?: string | null
          esc_user_name?: string | null
        }
        Update: {
          esc_additional_headers?: Json | null
          esc_authentication?: string | null
          esc_base_url?: string
          esc_client_id?: string | null
          esc_client_secret?: string | null
          esc_created_at?: string | null
          esc_ext1?: string | null
          esc_ext2?: string | null
          esc_ext3?: string | null
          esc_id?: number
          esc_is_active?: boolean | null
          esc_name?: string
          esc_password?: string | null
          esc_proxy_type?: string | null
          esc_system_type?: string | null
          esc_token_url?: string | null
          esc_updated_at?: string | null
          esc_url_id?: string | null
          esc_user_name?: string | null
        }
        Relationships: []
      }
      ezc_sap_urls: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      ezc_shipping_claims_comments: {
        Row: {
          escc_comments: string | null
          escc_date: string
          escc_doc_id: string | null
          escc_ext1: string | null
          escc_ext2: string | null
          escc_user_id: string | null
          escc_visibility: string | null
        }
        Insert: {
          escc_comments?: string | null
          escc_date: string
          escc_doc_id?: string | null
          escc_ext1?: string | null
          escc_ext2?: string | null
          escc_user_id?: string | null
          escc_visibility?: string | null
        }
        Update: {
          escc_comments?: string | null
          escc_date?: string
          escc_doc_id?: string | null
          escc_ext1?: string | null
          escc_ext2?: string | null
          escc_user_id?: string | null
          escc_visibility?: string | null
        }
        Relationships: []
      }
      ezc_shipping_claims_header: {
        Row: {
          esch_add_comments: string | null
          esch_admin_comments: string | null
          esch_claim_issue: string | null
          esch_component: string | null
          esch_contact_no: string | null
          esch_created_by: string | null
          esch_created_on: string | null
          esch_date: string | null
          esch_doc_id: string | null
          esch_doc_number: string | null
          esch_ext1: string | null
          esch_ext2: string | null
          esch_ext3: string | null
          esch_ext4: string | null
          esch_ext5: string | null
          esch_ext6: string | null
          esch_modified_by: string | null
          esch_modified_on: string | null
          esch_original_product: string | null
          esch_original_quantity: string | null
          esch_other_issue: string | null
          esch_po_number: string | null
          esch_resolution: string | null
          esch_serial_number: string | null
          esch_shipto_addr: string | null
          esch_shipto_city: string | null
          esch_shipto_country: string | null
          esch_shipto_name: string | null
          esch_shipto_state: string | null
          esch_shipto_zip: string | null
          esch_soldto_name: string | null
          esch_soldto_no: string | null
          esch_status: string | null
          esch_type: string | null
        }
        Insert: {
          esch_add_comments?: string | null
          esch_admin_comments?: string | null
          esch_claim_issue?: string | null
          esch_component?: string | null
          esch_contact_no?: string | null
          esch_created_by?: string | null
          esch_created_on?: string | null
          esch_date?: string | null
          esch_doc_id?: string | null
          esch_doc_number?: string | null
          esch_ext1?: string | null
          esch_ext2?: string | null
          esch_ext3?: string | null
          esch_ext4?: string | null
          esch_ext5?: string | null
          esch_ext6?: string | null
          esch_modified_by?: string | null
          esch_modified_on?: string | null
          esch_original_product?: string | null
          esch_original_quantity?: string | null
          esch_other_issue?: string | null
          esch_po_number?: string | null
          esch_resolution?: string | null
          esch_serial_number?: string | null
          esch_shipto_addr?: string | null
          esch_shipto_city?: string | null
          esch_shipto_country?: string | null
          esch_shipto_name?: string | null
          esch_shipto_state?: string | null
          esch_shipto_zip?: string | null
          esch_soldto_name?: string | null
          esch_soldto_no?: string | null
          esch_status?: string | null
          esch_type?: string | null
        }
        Update: {
          esch_add_comments?: string | null
          esch_admin_comments?: string | null
          esch_claim_issue?: string | null
          esch_component?: string | null
          esch_contact_no?: string | null
          esch_created_by?: string | null
          esch_created_on?: string | null
          esch_date?: string | null
          esch_doc_id?: string | null
          esch_doc_number?: string | null
          esch_ext1?: string | null
          esch_ext2?: string | null
          esch_ext3?: string | null
          esch_ext4?: string | null
          esch_ext5?: string | null
          esch_ext6?: string | null
          esch_modified_by?: string | null
          esch_modified_on?: string | null
          esch_original_product?: string | null
          esch_original_quantity?: string | null
          esch_other_issue?: string | null
          esch_po_number?: string | null
          esch_resolution?: string | null
          esch_serial_number?: string | null
          esch_shipto_addr?: string | null
          esch_shipto_city?: string | null
          esch_shipto_country?: string | null
          esch_shipto_name?: string | null
          esch_shipto_state?: string | null
          esch_shipto_zip?: string | null
          esch_soldto_name?: string | null
          esch_soldto_no?: string | null
          esch_status?: string | null
          esch_type?: string | null
        }
        Relationships: []
      }
      ezc_shipping_claims_products: {
        Row: {
          escp_doc_id: string | null
          escp_product: string | null
          escp_product_desc: string | null
          escp_quantity: string | null
        }
        Insert: {
          escp_doc_id?: string | null
          escp_product?: string | null
          escp_product_desc?: string | null
          escp_quantity?: string | null
        }
        Update: {
          escp_doc_id?: string | null
          escp_product?: string | null
          escp_product_desc?: string | null
          escp_quantity?: string | null
        }
        Relationships: []
      }
      ezc_shopping_cart: {
        Row: {
          esc_brand: string | null
          esc_brand_site: string | null
          esc_comm_grp: string | null
          esc_delv_group: string | null
          esc_dist_chnl: string | null
          esc_division: string | null
          esc_ean_upc: string | null
          esc_ext1: string | null
          esc_ext2: string | null
          esc_ext3: string | null
          esc_fd_account: string | null
          esc_fd_category: string | null
          esc_img_url: string | null
          esc_job_item: string | null
          esc_job_quote: string | null
          esc_kit_comp: string | null
          esc_line_no: string | null
          esc_mat_desc: string | null
          esc_mat_no: string | null
          esc_mat_status: string | null
          esc_my_po_line: string | null
          esc_my_sku: string | null
          esc_ord_type: string | null
          esc_points: string | null
          esc_prog_type: string | null
          esc_promo_code: string | null
          esc_quote_cust: string | null
          esc_req_date: string | null
          esc_req_qty: number | null
          esc_sales_org: string | null
          esc_ship_to_code: string | null
          esc_ship_to_state: string | null
          esc_sold_to_code: string | null
          esc_sys_key: string | null
          esc_unit_price: number | null
          esc_uom: string | null
          esc_user_id: string | null
          esc_ven_cat: string | null
          esc_volume: string | null
          esc_weight: string | null
          esc_weight_uom: string | null
        }
        Insert: {
          esc_brand?: string | null
          esc_brand_site?: string | null
          esc_comm_grp?: string | null
          esc_delv_group?: string | null
          esc_dist_chnl?: string | null
          esc_division?: string | null
          esc_ean_upc?: string | null
          esc_ext1?: string | null
          esc_ext2?: string | null
          esc_ext3?: string | null
          esc_fd_account?: string | null
          esc_fd_category?: string | null
          esc_img_url?: string | null
          esc_job_item?: string | null
          esc_job_quote?: string | null
          esc_kit_comp?: string | null
          esc_line_no?: string | null
          esc_mat_desc?: string | null
          esc_mat_no?: string | null
          esc_mat_status?: string | null
          esc_my_po_line?: string | null
          esc_my_sku?: string | null
          esc_ord_type?: string | null
          esc_points?: string | null
          esc_prog_type?: string | null
          esc_promo_code?: string | null
          esc_quote_cust?: string | null
          esc_req_date?: string | null
          esc_req_qty?: number | null
          esc_sales_org?: string | null
          esc_ship_to_code?: string | null
          esc_ship_to_state?: string | null
          esc_sold_to_code?: string | null
          esc_sys_key?: string | null
          esc_unit_price?: number | null
          esc_uom?: string | null
          esc_user_id?: string | null
          esc_ven_cat?: string | null
          esc_volume?: string | null
          esc_weight?: string | null
          esc_weight_uom?: string | null
        }
        Update: {
          esc_brand?: string | null
          esc_brand_site?: string | null
          esc_comm_grp?: string | null
          esc_delv_group?: string | null
          esc_dist_chnl?: string | null
          esc_division?: string | null
          esc_ean_upc?: string | null
          esc_ext1?: string | null
          esc_ext2?: string | null
          esc_ext3?: string | null
          esc_fd_account?: string | null
          esc_fd_category?: string | null
          esc_img_url?: string | null
          esc_job_item?: string | null
          esc_job_quote?: string | null
          esc_kit_comp?: string | null
          esc_line_no?: string | null
          esc_mat_desc?: string | null
          esc_mat_no?: string | null
          esc_mat_status?: string | null
          esc_my_po_line?: string | null
          esc_my_sku?: string | null
          esc_ord_type?: string | null
          esc_points?: string | null
          esc_prog_type?: string | null
          esc_promo_code?: string | null
          esc_quote_cust?: string | null
          esc_req_date?: string | null
          esc_req_qty?: number | null
          esc_sales_org?: string | null
          esc_ship_to_code?: string | null
          esc_ship_to_state?: string | null
          esc_sold_to_code?: string | null
          esc_sys_key?: string | null
          esc_unit_price?: number | null
          esc_uom?: string | null
          esc_user_id?: string | null
          esc_ven_cat?: string | null
          esc_volume?: string | null
          esc_weight?: string | null
          esc_weight_uom?: string | null
        }
        Relationships: []
      }
      ezc_simple_triggers: {
        Row: {
          repeat_count: number
          repeat_interval: number
          times_triggered: number
          trigger_group: string | null
          trigger_name: string | null
        }
        Insert: {
          repeat_count: number
          repeat_interval: number
          times_triggered: number
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Update: {
          repeat_count?: number
          repeat_interval?: number
          times_triggered?: number
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      ezc_site_globals: {
        Row: {
          esg_audit_log_on_off_flag: string | null
          esg_base_erp_sys_no: number | null
          esg_max_buss_users: number | null
          esg_max_internet_users: number | null
          esg_max_intranet_users: number | null
          esg_max_number: number | null
          esg_multiple_sales_areas: number | null
          esg_multiple_systems_allowed: number | null
          esg_outside_catalog: number | null
          esg_sch_time_cust_sync: string | null
          esg_sch_time_mat_sync: string | null
          esg_site_no: number | null
          esg_sync_trace_flag: string | null
          esg_unlimited_buss_users: string | null
          esg_unlimited_internet_users: string | null
          esg_unlimited_intranet_users: string | null
          ezg_cust_valid_flag: string | null
        }
        Insert: {
          esg_audit_log_on_off_flag?: string | null
          esg_base_erp_sys_no?: number | null
          esg_max_buss_users?: number | null
          esg_max_internet_users?: number | null
          esg_max_intranet_users?: number | null
          esg_max_number?: number | null
          esg_multiple_sales_areas?: number | null
          esg_multiple_systems_allowed?: number | null
          esg_outside_catalog?: number | null
          esg_sch_time_cust_sync?: string | null
          esg_sch_time_mat_sync?: string | null
          esg_site_no?: number | null
          esg_sync_trace_flag?: string | null
          esg_unlimited_buss_users?: string | null
          esg_unlimited_internet_users?: string | null
          esg_unlimited_intranet_users?: string | null
          ezg_cust_valid_flag?: string | null
        }
        Update: {
          esg_audit_log_on_off_flag?: string | null
          esg_base_erp_sys_no?: number | null
          esg_max_buss_users?: number | null
          esg_max_internet_users?: number | null
          esg_max_intranet_users?: number | null
          esg_max_number?: number | null
          esg_multiple_sales_areas?: number | null
          esg_multiple_systems_allowed?: number | null
          esg_outside_catalog?: number | null
          esg_sch_time_cust_sync?: string | null
          esg_sch_time_mat_sync?: string | null
          esg_site_no?: number | null
          esg_sync_trace_flag?: string | null
          esg_unlimited_buss_users?: string | null
          esg_unlimited_internet_users?: string | null
          esg_unlimited_intranet_users?: string | null
          ezg_cust_valid_flag?: string | null
        }
        Relationships: []
      }
      ezc_snippets: {
        Row: {
          ezs_created_at: string | null
          ezs_id: number
          ezs_snippet_body: string | null
          ezs_snippet_desc: string | null
          ezs_snippet_type: string | null
          ezs_updated_at: string | null
        }
        Insert: {
          ezs_created_at?: string | null
          ezs_id: number
          ezs_snippet_body?: string | null
          ezs_snippet_desc?: string | null
          ezs_snippet_type?: string | null
          ezs_updated_at?: string | null
        }
        Update: {
          ezs_created_at?: string | null
          ezs_id?: number
          ezs_snippet_body?: string | null
          ezs_snippet_desc?: string | null
          ezs_snippet_type?: string | null
          ezs_updated_at?: string | null
        }
        Relationships: []
      }
      ezc_so_cancel_header: {
        Row: {
          esch_approver_note: string | null
          esch_contact_email: string | null
          esch_contact_name: string | null
          esch_contact_phone: string | null
          esch_created_by: string | null
          esch_created_on: string | null
          esch_cust_text: string | null
          esch_expire_on: string | null
          esch_ext1: string | null
          esch_ext2: string | null
          esch_ext3: string | null
          esch_header_fees_type: string | null
          esch_header_fees_value: string | null
          esch_id: number | null
          esch_inco_term1: string | null
          esch_inco_term2: string | null
          esch_internal_text: string | null
          esch_modified_by: string | null
          esch_modified_on: string | null
          esch_po_num: string | null
          esch_reason: string | null
          esch_sap_reason: string | null
          esch_ship_to: string | null
          esch_ship_to_city: string | null
          esch_ship_to_country: string | null
          esch_ship_to_name: string | null
          esch_ship_to_phone: string | null
          esch_ship_to_res: string | null
          esch_ship_to_state: string | null
          esch_ship_to_street1: string | null
          esch_ship_to_street2: string | null
          esch_ship_to_zip: string | null
          esch_shipping_partner: string | null
          esch_so_num: string | null
          esch_sold_to: string | null
          esch_status: string | null
          esch_syskey: string | null
          esch_type: string | null
        }
        Insert: {
          esch_approver_note?: string | null
          esch_contact_email?: string | null
          esch_contact_name?: string | null
          esch_contact_phone?: string | null
          esch_created_by?: string | null
          esch_created_on?: string | null
          esch_cust_text?: string | null
          esch_expire_on?: string | null
          esch_ext1?: string | null
          esch_ext2?: string | null
          esch_ext3?: string | null
          esch_header_fees_type?: string | null
          esch_header_fees_value?: string | null
          esch_id?: number | null
          esch_inco_term1?: string | null
          esch_inco_term2?: string | null
          esch_internal_text?: string | null
          esch_modified_by?: string | null
          esch_modified_on?: string | null
          esch_po_num?: string | null
          esch_reason?: string | null
          esch_sap_reason?: string | null
          esch_ship_to?: string | null
          esch_ship_to_city?: string | null
          esch_ship_to_country?: string | null
          esch_ship_to_name?: string | null
          esch_ship_to_phone?: string | null
          esch_ship_to_res?: string | null
          esch_ship_to_state?: string | null
          esch_ship_to_street1?: string | null
          esch_ship_to_street2?: string | null
          esch_ship_to_zip?: string | null
          esch_shipping_partner?: string | null
          esch_so_num?: string | null
          esch_sold_to?: string | null
          esch_status?: string | null
          esch_syskey?: string | null
          esch_type?: string | null
        }
        Update: {
          esch_approver_note?: string | null
          esch_contact_email?: string | null
          esch_contact_name?: string | null
          esch_contact_phone?: string | null
          esch_created_by?: string | null
          esch_created_on?: string | null
          esch_cust_text?: string | null
          esch_expire_on?: string | null
          esch_ext1?: string | null
          esch_ext2?: string | null
          esch_ext3?: string | null
          esch_header_fees_type?: string | null
          esch_header_fees_value?: string | null
          esch_id?: number | null
          esch_inco_term1?: string | null
          esch_inco_term2?: string | null
          esch_internal_text?: string | null
          esch_modified_by?: string | null
          esch_modified_on?: string | null
          esch_po_num?: string | null
          esch_reason?: string | null
          esch_sap_reason?: string | null
          esch_ship_to?: string | null
          esch_ship_to_city?: string | null
          esch_ship_to_country?: string | null
          esch_ship_to_name?: string | null
          esch_ship_to_phone?: string | null
          esch_ship_to_res?: string | null
          esch_ship_to_state?: string | null
          esch_ship_to_street1?: string | null
          esch_ship_to_street2?: string | null
          esch_ship_to_zip?: string | null
          esch_shipping_partner?: string | null
          esch_so_num?: string | null
          esch_sold_to?: string | null
          esch_status?: string | null
          esch_syskey?: string | null
          esch_type?: string | null
        }
        Relationships: []
      }
      ezc_so_cancel_items: {
        Row: {
          esci_back_end_item: string | null
          esci_back_end_order: string | null
          esci_comments: string | null
          esci_ext1: string | null
          esci_ext2: string | null
          esci_ext3: string | null
          esci_id: number | null
          esci_inv_item: string | null
          esci_inv_num: string | null
          esci_mat_code: string | null
          esci_mat_desc: string | null
          esci_plant: string | null
          esci_quantity: string | null
          esci_rej_reason: string | null
          esci_req_qty: string | null
          esci_ret_mat: string | null
          esci_ret_qty: string | null
          esci_retmat_np: string | null
          esci_so_dch: string | null
          esci_so_div: string | null
          esci_so_item: string | null
          esci_so_num: string | null
          esci_so_sorg: string | null
          esci_status: string | null
          esci_type: string | null
        }
        Insert: {
          esci_back_end_item?: string | null
          esci_back_end_order?: string | null
          esci_comments?: string | null
          esci_ext1?: string | null
          esci_ext2?: string | null
          esci_ext3?: string | null
          esci_id?: number | null
          esci_inv_item?: string | null
          esci_inv_num?: string | null
          esci_mat_code?: string | null
          esci_mat_desc?: string | null
          esci_plant?: string | null
          esci_quantity?: string | null
          esci_rej_reason?: string | null
          esci_req_qty?: string | null
          esci_ret_mat?: string | null
          esci_ret_qty?: string | null
          esci_retmat_np?: string | null
          esci_so_dch?: string | null
          esci_so_div?: string | null
          esci_so_item?: string | null
          esci_so_num?: string | null
          esci_so_sorg?: string | null
          esci_status?: string | null
          esci_type?: string | null
        }
        Update: {
          esci_back_end_item?: string | null
          esci_back_end_order?: string | null
          esci_comments?: string | null
          esci_ext1?: string | null
          esci_ext2?: string | null
          esci_ext3?: string | null
          esci_id?: number | null
          esci_inv_item?: string | null
          esci_inv_num?: string | null
          esci_mat_code?: string | null
          esci_mat_desc?: string | null
          esci_plant?: string | null
          esci_quantity?: string | null
          esci_rej_reason?: string | null
          esci_req_qty?: string | null
          esci_ret_mat?: string | null
          esci_ret_qty?: string | null
          esci_retmat_np?: string | null
          esci_so_dch?: string | null
          esci_so_div?: string | null
          esci_so_item?: string | null
          esci_so_num?: string | null
          esci_so_sorg?: string | null
          esci_status?: string | null
          esci_type?: string | null
        }
        Relationships: []
      }
      ezc_so_dyn_partner: {
        Row: {
          esdp_ship_to_cust: string | null
          esdp_so_n0: string | null
        }
        Insert: {
          esdp_ship_to_cust?: string | null
          esdp_so_n0?: string | null
        }
        Update: {
          esdp_ship_to_cust?: string | null
          esdp_so_n0?: string | null
        }
        Relationships: []
      }
      ezc_split_conditions: {
        Row: {
          esc_attr_key: string | null
          esc_attr_value: string | null
          esc_cond_key: string | null
          esc_cond_value: string | null
          esc_ref_key: string | null
          esc_sequence: number
          esc_site_id: number
        }
        Insert: {
          esc_attr_key?: string | null
          esc_attr_value?: string | null
          esc_cond_key?: string | null
          esc_cond_value?: string | null
          esc_ref_key?: string | null
          esc_sequence: number
          esc_site_id: number
        }
        Update: {
          esc_attr_key?: string | null
          esc_attr_value?: string | null
          esc_cond_key?: string | null
          esc_cond_value?: string | null
          esc_ref_key?: string | null
          esc_sequence?: number
          esc_site_id?: number
        }
        Relationships: []
      }
      ezc_sys_admin_messges: {
        Row: {
          esam_admin_user_id: string | null
          esam_client: number | null
          esam_creation_date: string | null
          esam_creation_time: string | null
          esam_lnk_ext_info: string | null
          esam_msg_content1: string | null
          esam_msg_content2: string | null
          esam_msg_content3: string | null
          esam_msg_content4: string | null
          esam_msg_header: string | null
          esam_msg_id: string | null
          esam_msg_type: string | null
          esam_priority_flag: string | null
        }
        Insert: {
          esam_admin_user_id?: string | null
          esam_client?: number | null
          esam_creation_date?: string | null
          esam_creation_time?: string | null
          esam_lnk_ext_info?: string | null
          esam_msg_content1?: string | null
          esam_msg_content2?: string | null
          esam_msg_content3?: string | null
          esam_msg_content4?: string | null
          esam_msg_header?: string | null
          esam_msg_id?: string | null
          esam_msg_type?: string | null
          esam_priority_flag?: string | null
        }
        Update: {
          esam_admin_user_id?: string | null
          esam_client?: number | null
          esam_creation_date?: string | null
          esam_creation_time?: string | null
          esam_lnk_ext_info?: string | null
          esam_msg_content1?: string | null
          esam_msg_content2?: string | null
          esam_msg_content3?: string | null
          esam_msg_content4?: string | null
          esam_msg_header?: string | null
          esam_msg_id?: string | null
          esam_msg_type?: string | null
          esam_priority_flag?: string | null
        }
        Relationships: []
      }
      ezc_system_auth: {
        Row: {
          esa_auth_key: string | null
          esa_auth_value: string | null
          esa_sys_no: number | null
        }
        Insert: {
          esa_auth_key?: string | null
          esa_auth_value?: string | null
          esa_sys_no?: number | null
        }
        Update: {
          esa_auth_key?: string | null
          esa_auth_value?: string | null
          esa_sys_no?: number | null
        }
        Relationships: []
      }
      ezc_system_defaults: {
        Row: {
          esd_key: string | null
          esd_sys_no: number | null
          esd_value: string | null
        }
        Insert: {
          esd_key?: string | null
          esd_sys_no?: number | null
          esd_value?: string | null
        }
        Update: {
          esd_key?: string | null
          esd_sys_no?: number | null
          esd_value?: string | null
        }
        Relationships: []
      }
      ezc_system_desc: {
        Row: {
          esd_lang: string | null
          esd_sys_desc: string | null
          esd_sys_no: number | null
          esd_sys_type: number | null
        }
        Insert: {
          esd_lang?: string | null
          esd_sys_desc?: string | null
          esd_sys_no?: number | null
          esd_sys_type?: number | null
        }
        Update: {
          esd_lang?: string | null
          esd_sys_desc?: string | null
          esd_sys_no?: number | null
          esd_sys_type?: number | null
        }
        Relationships: []
      }
      ezc_system_group_link: {
        Row: {
          esgl_group_id: number | null
          esgl_sys_no: number | null
        }
        Insert: {
          esgl_group_id?: number | null
          esgl_sys_no?: number | null
        }
        Update: {
          esgl_group_id?: number | null
          esgl_sys_no?: number | null
        }
        Relationships: []
      }
      ezc_system_key_desc: {
        Row: {
          eskd_lang: string | null
          eskd_supp_cust_flag: string | null
          eskd_sync_flag: string | null
          eskd_sys_key: string | null
          eskd_sys_key_desc: string | null
          eskd_sys_no: number | null
        }
        Insert: {
          eskd_lang?: string | null
          eskd_supp_cust_flag?: string | null
          eskd_sync_flag?: string | null
          eskd_sys_key?: string | null
          eskd_sys_key_desc?: string | null
          eskd_sys_no?: number | null
        }
        Update: {
          eskd_lang?: string | null
          eskd_supp_cust_flag?: string | null
          eskd_sync_flag?: string | null
          eskd_sys_key?: string | null
          eskd_sys_key_desc?: string | null
          eskd_sys_no?: number | null
        }
        Relationships: []
      }
      ezc_system_transaction_link: {
        Row: {
          estl_audit_flag: string | null
          estl_sys_no: number | null
          estl_transaction: string | null
        }
        Insert: {
          estl_audit_flag?: string | null
          estl_sys_no?: number | null
          estl_transaction?: string | null
        }
        Update: {
          estl_audit_flag?: string | null
          estl_sys_no?: number | null
          estl_transaction?: string | null
        }
        Relationships: []
      }
      ezc_system_type_defaults: {
        Row: {
          estd_default_desc: string | null
          estd_default_key: string | null
          estd_default_type: string | null
          estd_lang: string | null
          estd_supp_cust_flag: string | null
          estd_sys_type: number | null
        }
        Insert: {
          estd_default_desc?: string | null
          estd_default_key?: string | null
          estd_default_type?: string | null
          estd_lang?: string | null
          estd_supp_cust_flag?: string | null
          estd_sys_type?: number | null
        }
        Update: {
          estd_default_desc?: string | null
          estd_default_key?: string | null
          estd_default_type?: string | null
          estd_lang?: string | null
          estd_supp_cust_flag?: string | null
          estd_sys_type?: number | null
        }
        Relationships: []
      }
      ezc_system_types: {
        Row: {
          est_desc: string | null
          est_lang: string | null
          est_sys_type: number | null
          est_version: string | null
        }
        Insert: {
          est_desc?: string | null
          est_lang?: string | null
          est_sys_type?: number | null
          est_version?: string | null
        }
        Update: {
          est_desc?: string | null
          est_lang?: string | null
          est_sys_type?: number | null
          est_version?: string | null
        }
        Relationships: []
      }
      ezc_temp_catalog_categories: {
        Row: {
          ecc_catalog_id: string | null
          ecc_category_id: string | null
        }
        Insert: {
          ecc_catalog_id?: string | null
          ecc_category_id?: string | null
        }
        Update: {
          ecc_catalog_id?: string | null
          ecc_category_id?: string | null
        }
        Relationships: []
      }
      ezc_temp_categories: {
        Row: {
          ec_catalog_id: string | null
          ec_code: string | null
          ec_image: string | null
          ec_mat_count: string | null
          ec_parent: string | null
          ec_sort: number | null
          ec_status: string | null
          ec_thumb: string | null
          ec_visible: string | null
        }
        Insert: {
          ec_catalog_id?: string | null
          ec_code?: string | null
          ec_image?: string | null
          ec_mat_count?: string | null
          ec_parent?: string | null
          ec_sort?: number | null
          ec_status?: string | null
          ec_thumb?: string | null
          ec_visible?: string | null
        }
        Update: {
          ec_catalog_id?: string | null
          ec_code?: string | null
          ec_image?: string | null
          ec_mat_count?: string | null
          ec_parent?: string | null
          ec_sort?: number | null
          ec_status?: string | null
          ec_thumb?: string | null
          ec_visible?: string | null
        }
        Relationships: []
      }
      ezc_temp_category_description: {
        Row: {
          ecd_catalog_id: string | null
          ecd_code: string | null
          ecd_desc: string | null
          ecd_lang: string | null
          ecd_profit_center: string | null
          ecd_text: string | null
        }
        Insert: {
          ecd_catalog_id?: string | null
          ecd_code?: string | null
          ecd_desc?: string | null
          ecd_lang?: string | null
          ecd_profit_center?: string | null
          ecd_text?: string | null
        }
        Update: {
          ecd_catalog_id?: string | null
          ecd_code?: string | null
          ecd_desc?: string | null
          ecd_lang?: string | null
          ecd_profit_center?: string | null
          ecd_text?: string | null
        }
        Relationships: []
      }
      ezc_temp_category_products: {
        Row: {
          ecp_catalog_id: string | null
          ecp_category_code: string | null
          ecp_product_code: string | null
          ecp_sort: number | null
        }
        Insert: {
          ecp_catalog_id?: string | null
          ecp_category_code?: string | null
          ecp_product_code?: string | null
          ecp_sort?: number | null
        }
        Update: {
          ecp_catalog_id?: string | null
          ecp_category_code?: string | null
          ecp_product_code?: string | null
          ecp_sort?: number | null
        }
        Relationships: []
      }
      ezc_temp_category_products1: {
        Row: {
          ecp_catalog_id: string | null
          ecp_category_code: string | null
          ecp_product_code: string | null
          ecp_sort: number | null
        }
        Insert: {
          ecp_catalog_id?: string | null
          ecp_category_code?: string | null
          ecp_product_code?: string | null
          ecp_sort?: number | null
        }
        Update: {
          ecp_catalog_id?: string | null
          ecp_category_code?: string | null
          ecp_product_code?: string | null
          ecp_sort?: number | null
        }
        Relationships: []
      }
      ezc_temp_mats: {
        Row: {
          ezm_batch: string | null
          ezm_expiration: string | null
          ezm_ext1: string | null
          ezm_prod_desc: string | null
          ezm_product_id: string | null
        }
        Insert: {
          ezm_batch?: string | null
          ezm_expiration?: string | null
          ezm_ext1?: string | null
          ezm_prod_desc?: string | null
          ezm_product_id?: string | null
        }
        Update: {
          ezm_batch?: string | null
          ezm_expiration?: string | null
          ezm_ext1?: string | null
          ezm_prod_desc?: string | null
          ezm_product_id?: string | null
        }
        Relationships: []
      }
      ezc_temp_product_descriptions: {
        Row: {
          epd_catalog_id: string | null
          epd_lang_code: string | null
          epd_product_code: string | null
          epd_product_desc: string | null
          epd_product_details: string | null
          epd_product_prop1: string | null
        }
        Insert: {
          epd_catalog_id?: string | null
          epd_lang_code?: string | null
          epd_product_code?: string | null
          epd_product_desc?: string | null
          epd_product_details?: string | null
          epd_product_prop1?: string | null
        }
        Update: {
          epd_catalog_id?: string | null
          epd_lang_code?: string | null
          epd_product_code?: string | null
          epd_product_desc?: string | null
          epd_product_details?: string | null
          epd_product_prop1?: string | null
        }
        Relationships: []
      }
      ezc_temp_product_descriptions1: {
        Row: {
          epd_catalog_id: string | null
          epd_lang_code: string | null
          epd_product_code: string | null
          epd_product_desc: string | null
          epd_product_details: string | null
          epd_product_prop1: string | null
        }
        Insert: {
          epd_catalog_id?: string | null
          epd_lang_code?: string | null
          epd_product_code?: string | null
          epd_product_desc?: string | null
          epd_product_details?: string | null
          epd_product_prop1?: string | null
        }
        Update: {
          epd_catalog_id?: string | null
          epd_lang_code?: string | null
          epd_product_code?: string | null
          epd_product_desc?: string | null
          epd_product_details?: string | null
          epd_product_prop1?: string | null
        }
        Relationships: []
      }
      ezc_temp_products: {
        Row: {
          ezp_alternate1: string | null
          ezp_alternate2: string | null
          ezp_alternate3: string | null
          ezp_attr1: string | null
          ezp_attr2: string | null
          ezp_attr3: string | null
          ezp_attr4: string | null
          ezp_attr5: string | null
          ezp_batch_managed: string | null
          ezp_brand: string | null
          ezp_catalog_id: string | null
          ezp_category: string | null
          ezp_color: string | null
          ezp_curr_eff_date: string | null
          ezp_curr_price: number | null
          ezp_discontinue_date: string | null
          ezp_discontinued: string | null
          ezp_erp_code: string | null
          ezp_family: string | null
          ezp_featured: string | null
          ezp_finish: string | null
          ezp_future_eff_date: string | null
          ezp_future_price: number | null
          ezp_gross_weight: string | null
          ezp_item_cat: string | null
          ezp_length: string | null
          ezp_length_uom: string | null
          ezp_luxury: string | null
          ezp_mat_pric_group: string | null
          ezp_model: string | null
          ezp_new_from: string | null
          ezp_new_to: string | null
          ezp_product_code: string | null
          ezp_profit_center: string | null
          ezp_replaces_item: string | null
          ezp_serial_profile: string | null
          ezp_size: string | null
          ezp_sort: number | null
          ezp_status: string | null
          ezp_style: string | null
          ezp_sub_category: string | null
          ezp_sub_type: string | null
          ezp_type: string | null
          ezp_upc_code: string | null
          ezp_volume: string | null
          ezp_volume_uom: string | null
          ezp_web_prod_id: string | null
          ezp_web_sku: string | null
          ezp_weight: string | null
          ezp_weight_uom: string | null
          ezp_width: string | null
        }
        Insert: {
          ezp_alternate1?: string | null
          ezp_alternate2?: string | null
          ezp_alternate3?: string | null
          ezp_attr1?: string | null
          ezp_attr2?: string | null
          ezp_attr3?: string | null
          ezp_attr4?: string | null
          ezp_attr5?: string | null
          ezp_batch_managed?: string | null
          ezp_brand?: string | null
          ezp_catalog_id?: string | null
          ezp_category?: string | null
          ezp_color?: string | null
          ezp_curr_eff_date?: string | null
          ezp_curr_price?: number | null
          ezp_discontinue_date?: string | null
          ezp_discontinued?: string | null
          ezp_erp_code?: string | null
          ezp_family?: string | null
          ezp_featured?: string | null
          ezp_finish?: string | null
          ezp_future_eff_date?: string | null
          ezp_future_price?: number | null
          ezp_gross_weight?: string | null
          ezp_item_cat?: string | null
          ezp_length?: string | null
          ezp_length_uom?: string | null
          ezp_luxury?: string | null
          ezp_mat_pric_group?: string | null
          ezp_model?: string | null
          ezp_new_from?: string | null
          ezp_new_to?: string | null
          ezp_product_code?: string | null
          ezp_profit_center?: string | null
          ezp_replaces_item?: string | null
          ezp_serial_profile?: string | null
          ezp_size?: string | null
          ezp_sort?: number | null
          ezp_status?: string | null
          ezp_style?: string | null
          ezp_sub_category?: string | null
          ezp_sub_type?: string | null
          ezp_type?: string | null
          ezp_upc_code?: string | null
          ezp_volume?: string | null
          ezp_volume_uom?: string | null
          ezp_web_prod_id?: string | null
          ezp_web_sku?: string | null
          ezp_weight?: string | null
          ezp_weight_uom?: string | null
          ezp_width?: string | null
        }
        Update: {
          ezp_alternate1?: string | null
          ezp_alternate2?: string | null
          ezp_alternate3?: string | null
          ezp_attr1?: string | null
          ezp_attr2?: string | null
          ezp_attr3?: string | null
          ezp_attr4?: string | null
          ezp_attr5?: string | null
          ezp_batch_managed?: string | null
          ezp_brand?: string | null
          ezp_catalog_id?: string | null
          ezp_category?: string | null
          ezp_color?: string | null
          ezp_curr_eff_date?: string | null
          ezp_curr_price?: number | null
          ezp_discontinue_date?: string | null
          ezp_discontinued?: string | null
          ezp_erp_code?: string | null
          ezp_family?: string | null
          ezp_featured?: string | null
          ezp_finish?: string | null
          ezp_future_eff_date?: string | null
          ezp_future_price?: number | null
          ezp_gross_weight?: string | null
          ezp_item_cat?: string | null
          ezp_length?: string | null
          ezp_length_uom?: string | null
          ezp_luxury?: string | null
          ezp_mat_pric_group?: string | null
          ezp_model?: string | null
          ezp_new_from?: string | null
          ezp_new_to?: string | null
          ezp_product_code?: string | null
          ezp_profit_center?: string | null
          ezp_replaces_item?: string | null
          ezp_serial_profile?: string | null
          ezp_size?: string | null
          ezp_sort?: number | null
          ezp_status?: string | null
          ezp_style?: string | null
          ezp_sub_category?: string | null
          ezp_sub_type?: string | null
          ezp_type?: string | null
          ezp_upc_code?: string | null
          ezp_volume?: string | null
          ezp_volume_uom?: string | null
          ezp_web_prod_id?: string | null
          ezp_web_sku?: string | null
          ezp_weight?: string | null
          ezp_weight_uom?: string | null
          ezp_width?: string | null
        }
        Relationships: []
      }
      ezc_temp_products1: {
        Row: {
          ezp_alternate1: string | null
          ezp_alternate2: string | null
          ezp_alternate3: string | null
          ezp_attr1: string | null
          ezp_attr2: string | null
          ezp_attr3: string | null
          ezp_attr4: string | null
          ezp_attr5: string | null
          ezp_batch_managed: string | null
          ezp_brand: string | null
          ezp_catalog_id: string | null
          ezp_category: string | null
          ezp_color: string | null
          ezp_curr_eff_date: string | null
          ezp_curr_price: number | null
          ezp_discontinue_date: string | null
          ezp_discontinued: string | null
          ezp_erp_code: string | null
          ezp_family: string | null
          ezp_featured: string | null
          ezp_finish: string | null
          ezp_future_eff_date: string | null
          ezp_future_price: number | null
          ezp_gross_weight: string | null
          ezp_item_cat: string | null
          ezp_length: string | null
          ezp_length_uom: string | null
          ezp_luxury: string | null
          ezp_mat_pric_group: string | null
          ezp_model: string | null
          ezp_new_from: string | null
          ezp_new_to: string | null
          ezp_product_code: string | null
          ezp_profit_center: string | null
          ezp_replaces_item: string | null
          ezp_serial_profile: string | null
          ezp_size: string | null
          ezp_sort: number | null
          ezp_status: string | null
          ezp_style: string | null
          ezp_sub_category: string | null
          ezp_sub_type: string | null
          ezp_type: string | null
          ezp_upc_code: string | null
          ezp_volume: string | null
          ezp_volume_uom: string | null
          ezp_web_prod_id: string | null
          ezp_web_sku: string | null
          ezp_weight: string | null
          ezp_weight_uom: string | null
          ezp_width: string | null
        }
        Insert: {
          ezp_alternate1?: string | null
          ezp_alternate2?: string | null
          ezp_alternate3?: string | null
          ezp_attr1?: string | null
          ezp_attr2?: string | null
          ezp_attr3?: string | null
          ezp_attr4?: string | null
          ezp_attr5?: string | null
          ezp_batch_managed?: string | null
          ezp_brand?: string | null
          ezp_catalog_id?: string | null
          ezp_category?: string | null
          ezp_color?: string | null
          ezp_curr_eff_date?: string | null
          ezp_curr_price?: number | null
          ezp_discontinue_date?: string | null
          ezp_discontinued?: string | null
          ezp_erp_code?: string | null
          ezp_family?: string | null
          ezp_featured?: string | null
          ezp_finish?: string | null
          ezp_future_eff_date?: string | null
          ezp_future_price?: number | null
          ezp_gross_weight?: string | null
          ezp_item_cat?: string | null
          ezp_length?: string | null
          ezp_length_uom?: string | null
          ezp_luxury?: string | null
          ezp_mat_pric_group?: string | null
          ezp_model?: string | null
          ezp_new_from?: string | null
          ezp_new_to?: string | null
          ezp_product_code?: string | null
          ezp_profit_center?: string | null
          ezp_replaces_item?: string | null
          ezp_serial_profile?: string | null
          ezp_size?: string | null
          ezp_sort?: number | null
          ezp_status?: string | null
          ezp_style?: string | null
          ezp_sub_category?: string | null
          ezp_sub_type?: string | null
          ezp_type?: string | null
          ezp_upc_code?: string | null
          ezp_volume?: string | null
          ezp_volume_uom?: string | null
          ezp_web_prod_id?: string | null
          ezp_web_sku?: string | null
          ezp_weight?: string | null
          ezp_weight_uom?: string | null
          ezp_width?: string | null
        }
        Update: {
          ezp_alternate1?: string | null
          ezp_alternate2?: string | null
          ezp_alternate3?: string | null
          ezp_attr1?: string | null
          ezp_attr2?: string | null
          ezp_attr3?: string | null
          ezp_attr4?: string | null
          ezp_attr5?: string | null
          ezp_batch_managed?: string | null
          ezp_brand?: string | null
          ezp_catalog_id?: string | null
          ezp_category?: string | null
          ezp_color?: string | null
          ezp_curr_eff_date?: string | null
          ezp_curr_price?: number | null
          ezp_discontinue_date?: string | null
          ezp_discontinued?: string | null
          ezp_erp_code?: string | null
          ezp_family?: string | null
          ezp_featured?: string | null
          ezp_finish?: string | null
          ezp_future_eff_date?: string | null
          ezp_future_price?: number | null
          ezp_gross_weight?: string | null
          ezp_item_cat?: string | null
          ezp_length?: string | null
          ezp_length_uom?: string | null
          ezp_luxury?: string | null
          ezp_mat_pric_group?: string | null
          ezp_model?: string | null
          ezp_new_from?: string | null
          ezp_new_to?: string | null
          ezp_product_code?: string | null
          ezp_profit_center?: string | null
          ezp_replaces_item?: string | null
          ezp_serial_profile?: string | null
          ezp_size?: string | null
          ezp_sort?: number | null
          ezp_status?: string | null
          ezp_style?: string | null
          ezp_sub_category?: string | null
          ezp_sub_type?: string | null
          ezp_type?: string | null
          ezp_upc_code?: string | null
          ezp_volume?: string | null
          ezp_volume_uom?: string | null
          ezp_web_prod_id?: string | null
          ezp_web_sku?: string | null
          ezp_weight?: string | null
          ezp_weight_uom?: string | null
          ezp_width?: string | null
        }
        Relationships: []
      }
      ezc_terms: {
        Row: {
          et_content: string | null
          et_modified_by: string | null
          et_modified_date: string | null
        }
        Insert: {
          et_content?: string | null
          et_modified_by?: string | null
          et_modified_date?: string | null
        }
        Update: {
          et_content?: string | null
          et_modified_by?: string | null
          et_modified_date?: string | null
        }
        Relationships: []
      }
      ezc_trigger_listeners: {
        Row: {
          listener_name: string | null
          trigger_group: string | null
          trigger_name: string | null
        }
        Insert: {
          listener_name?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Update: {
          listener_name?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      ezc_triggers: {
        Row: {
          calendar_name: string | null
          description: string | null
          end_time: number | null
          is_volatile: string | null
          job_data: string | null
          job_group: string | null
          job_name: string | null
          misfire_instr: number | null
          next_fire_time: number | null
          prev_fire_time: number | null
          priority: number | null
          start_time: number
          trigger_group: string | null
          trigger_name: string | null
          trigger_state: string | null
          trigger_type: string | null
        }
        Insert: {
          calendar_name?: string | null
          description?: string | null
          end_time?: number | null
          is_volatile?: string | null
          job_data?: string | null
          job_group?: string | null
          job_name?: string | null
          misfire_instr?: number | null
          next_fire_time?: number | null
          prev_fire_time?: number | null
          priority?: number | null
          start_time: number
          trigger_group?: string | null
          trigger_name?: string | null
          trigger_state?: string | null
          trigger_type?: string | null
        }
        Update: {
          calendar_name?: string | null
          description?: string | null
          end_time?: number | null
          is_volatile?: string | null
          job_data?: string | null
          job_group?: string | null
          job_name?: string | null
          misfire_instr?: number | null
          next_fire_time?: number | null
          prev_fire_time?: number | null
          priority?: number | null
          start_time?: number
          trigger_group?: string | null
          trigger_name?: string | null
          trigger_state?: string | null
          trigger_type?: string | null
        }
        Relationships: []
      }
      ezc_upload_docs: {
        Row: {
          eud_created_by: string | null
          eud_created_on: string | null
          eud_object_no: string | null
          eud_object_type: string | null
          eud_status: string | null
          eud_syskey: string | null
          eud_upload_no: number | null
        }
        Insert: {
          eud_created_by?: string | null
          eud_created_on?: string | null
          eud_object_no?: string | null
          eud_object_type?: string | null
          eud_status?: string | null
          eud_syskey?: string | null
          eud_upload_no?: number | null
        }
        Update: {
          eud_created_by?: string | null
          eud_created_on?: string | null
          eud_object_no?: string | null
          eud_object_type?: string | null
          eud_status?: string | null
          eud_syskey?: string | null
          eud_upload_no?: number | null
        }
        Relationships: []
      }
      ezc_uploaddoc_files: {
        Row: {
          euf_client_file_name: string | null
          euf_server_file_name: string | null
          euf_type: string | null
          euf_upload_no: number | null
        }
        Insert: {
          euf_client_file_name?: string | null
          euf_server_file_name?: string | null
          euf_type?: string | null
          euf_upload_no?: number | null
        }
        Update: {
          euf_client_file_name?: string | null
          euf_server_file_name?: string | null
          euf_type?: string | null
          euf_upload_no?: number | null
        }
        Relationships: []
      }
      ezc_url_mapping: {
        Row: {
          eum_actual_url: string | null
          eum_short_url: string | null
        }
        Insert: {
          eum_actual_url?: string | null
          eum_short_url?: string | null
        }
        Update: {
          eum_actual_url?: string | null
          eum_short_url?: string | null
        }
        Relationships: []
      }
      ezc_user_auth: {
        Row: {
          eua_auth_key: string | null
          eua_auth_value: string | null
          eua_role_or_auth: string | null
          eua_sys_no: number | null
          eua_user_id: string | null
        }
        Insert: {
          eua_auth_key?: string | null
          eua_auth_value?: string | null
          eua_role_or_auth?: string | null
          eua_sys_no?: number | null
          eua_user_id?: string | null
        }
        Update: {
          eua_auth_key?: string | null
          eua_auth_value?: string | null
          eua_role_or_auth?: string | null
          eua_sys_no?: number | null
          eua_user_id?: string | null
        }
        Relationships: []
      }
      ezc_user_defaults: {
        Row: {
          eud_cust_no: string | null
          eud_default_flag: string | null
          eud_is_usera_key: string | null
          eud_key: string | null
          eud_sys_key: string | null
          eud_user_id: string | null
          eud_value: string | null
        }
        Insert: {
          eud_cust_no?: string | null
          eud_default_flag?: string | null
          eud_is_usera_key?: string | null
          eud_key?: string | null
          eud_sys_key?: string | null
          eud_user_id?: string | null
          eud_value?: string | null
        }
        Update: {
          eud_cust_no?: string | null
          eud_default_flag?: string | null
          eud_is_usera_key?: string | null
          eud_key?: string | null
          eud_sys_key?: string | null
          eud_user_id?: string | null
          eud_value?: string | null
        }
        Relationships: []
      }
      ezc_user_groups: {
        Row: {
          eug_auto_correction_yesno: string | null
          eug_conn_exist: string | null
          eug_conn_log: string | null
          eug_connect_type: number | null
          eug_cust_info_access: number | null
          eug_data_sync_type: number | null
          eug_db_mem_cache: number | null
          eug_db_no_of_conn: number | null
          eug_db_no_of_retry: number | null
          eug_history_read: number | null
          eug_history_write: number | null
          eug_id: number | null
          eug_logfile_path: string | null
          eug_logsize: number | null
          eug_material_access: number | null
          eug_name: string | null
          eug_r3_check_auth: string | null
          eug_r3_client: string | null
          eug_r3_code_page: number | null
          eug_r3_gateway_host: string | null
          eug_r3_group_name: string | null
          eug_r3_host: string | null
          eug_r3_lang: string | null
          eug_r3_load_balance: string | null
          eug_r3_msg_server: string | null
          eug_r3_no_of_conn: number | null
          eug_r3_no_of_retry: number | null
          eug_r3_passwd: string | null
          eug_r3_sys_name: string | null
          eug_r3_sys_no: number | null
          eug_r3_user_id: string | null
          eug_sys_no: number | null
          eug_transaction_auto_retry: number | null
          eug_validation_type: number | null
          eug_xml_exchange_path: string | null
        }
        Insert: {
          eug_auto_correction_yesno?: string | null
          eug_conn_exist?: string | null
          eug_conn_log?: string | null
          eug_connect_type?: number | null
          eug_cust_info_access?: number | null
          eug_data_sync_type?: number | null
          eug_db_mem_cache?: number | null
          eug_db_no_of_conn?: number | null
          eug_db_no_of_retry?: number | null
          eug_history_read?: number | null
          eug_history_write?: number | null
          eug_id?: number | null
          eug_logfile_path?: string | null
          eug_logsize?: number | null
          eug_material_access?: number | null
          eug_name?: string | null
          eug_r3_check_auth?: string | null
          eug_r3_client?: string | null
          eug_r3_code_page?: number | null
          eug_r3_gateway_host?: string | null
          eug_r3_group_name?: string | null
          eug_r3_host?: string | null
          eug_r3_lang?: string | null
          eug_r3_load_balance?: string | null
          eug_r3_msg_server?: string | null
          eug_r3_no_of_conn?: number | null
          eug_r3_no_of_retry?: number | null
          eug_r3_passwd?: string | null
          eug_r3_sys_name?: string | null
          eug_r3_sys_no?: number | null
          eug_r3_user_id?: string | null
          eug_sys_no?: number | null
          eug_transaction_auto_retry?: number | null
          eug_validation_type?: number | null
          eug_xml_exchange_path?: string | null
        }
        Update: {
          eug_auto_correction_yesno?: string | null
          eug_conn_exist?: string | null
          eug_conn_log?: string | null
          eug_connect_type?: number | null
          eug_cust_info_access?: number | null
          eug_data_sync_type?: number | null
          eug_db_mem_cache?: number | null
          eug_db_no_of_conn?: number | null
          eug_db_no_of_retry?: number | null
          eug_history_read?: number | null
          eug_history_write?: number | null
          eug_id?: number | null
          eug_logfile_path?: string | null
          eug_logsize?: number | null
          eug_material_access?: number | null
          eug_name?: string | null
          eug_r3_check_auth?: string | null
          eug_r3_client?: string | null
          eug_r3_code_page?: number | null
          eug_r3_gateway_host?: string | null
          eug_r3_group_name?: string | null
          eug_r3_host?: string | null
          eug_r3_lang?: string | null
          eug_r3_load_balance?: string | null
          eug_r3_msg_server?: string | null
          eug_r3_no_of_conn?: number | null
          eug_r3_no_of_retry?: number | null
          eug_r3_passwd?: string | null
          eug_r3_sys_name?: string | null
          eug_r3_sys_no?: number | null
          eug_r3_user_id?: string | null
          eug_sys_no?: number | null
          eug_transaction_auto_retry?: number | null
          eug_validation_type?: number | null
          eug_xml_exchange_path?: string | null
        }
        Relationships: []
      }
      ezc_user_product_favorites: {
        Row: {
          epf_catalog_no: number | null
          epf_favourite_group: string | null
          epf_itemcat: string | null
          epf_mat_no: string | null
          epf_mm_id: number | null
          epf_product_sequence: number | null
          epf_sys_key: string | null
          epf_type: string | null
          epf_user_id: string | null
        }
        Insert: {
          epf_catalog_no?: number | null
          epf_favourite_group?: string | null
          epf_itemcat?: string | null
          epf_mat_no?: string | null
          epf_mm_id?: number | null
          epf_product_sequence?: number | null
          epf_sys_key?: string | null
          epf_type?: string | null
          epf_user_id?: string | null
        }
        Update: {
          epf_catalog_no?: number | null
          epf_favourite_group?: string | null
          epf_itemcat?: string | null
          epf_mat_no?: string | null
          epf_mm_id?: number | null
          epf_product_sequence?: number | null
          epf_sys_key?: string | null
          epf_type?: string | null
          epf_user_id?: string | null
        }
        Relationships: []
      }
      ezc_user_product_group_fav: {
        Row: {
          epgf_product_group: string | null
          epgf_product_group_sequence: number | null
          epgf_sys_no: number | null
          epgf_user_id: string | null
        }
        Insert: {
          epgf_product_group?: string | null
          epgf_product_group_sequence?: number | null
          epgf_sys_no?: number | null
          epgf_user_id?: string | null
        }
        Update: {
          epgf_product_group?: string | null
          epgf_product_group_sequence?: number | null
          epgf_sys_no?: number | null
          epgf_user_id?: string | null
        }
        Relationships: []
      }
      ezc_user_roles: {
        Row: {
          eur_bus_domain: string | null
          eur_component: string | null
          eur_deleted_flag: string | null
          eur_language: string | null
          eur_role_description: string | null
          eur_role_nr: string | null
          eur_role_type: string | null
        }
        Insert: {
          eur_bus_domain?: string | null
          eur_component?: string | null
          eur_deleted_flag?: string | null
          eur_language?: string | null
          eur_role_description?: string | null
          eur_role_nr?: string | null
          eur_role_type?: string | null
        }
        Update: {
          eur_bus_domain?: string | null
          eur_component?: string | null
          eur_deleted_flag?: string | null
          eur_language?: string | null
          eur_role_description?: string | null
          eur_role_nr?: string | null
          eur_role_type?: string | null
        }
        Relationships: []
      }
      ezc_users: {
        Row: {
          eu_business_partner: string | null
          eu_changed_by: string | null
          eu_changed_date: string | null
          eu_created_date: string | null
          eu_current_number: number | null
          eu_deletion_flag: string | null
          eu_email: string | null
          eu_fax: string | null
          eu_first_name: string | null
          eu_id: string
          eu_is_built_in_user: string | null
          eu_last_login_date: string | null
          eu_last_login_time: string | null
          eu_last_name: string | null
          eu_middle_initial: string | null
          eu_mobile: string | null
          eu_otp: string | null
          eu_otp_valid: string | null
          eu_password: string | null
          eu_telephone: string | null
          eu_telephone_ext: string | null
          eu_type: number | null
          eu_valid_to_date: string | null
          eug_id: number | null
          supabase_user_id: string | null
        }
        Insert: {
          eu_business_partner?: string | null
          eu_changed_by?: string | null
          eu_changed_date?: string | null
          eu_created_date?: string | null
          eu_current_number?: number | null
          eu_deletion_flag?: string | null
          eu_email?: string | null
          eu_fax?: string | null
          eu_first_name?: string | null
          eu_id: string
          eu_is_built_in_user?: string | null
          eu_last_login_date?: string | null
          eu_last_login_time?: string | null
          eu_last_name?: string | null
          eu_middle_initial?: string | null
          eu_mobile?: string | null
          eu_otp?: string | null
          eu_otp_valid?: string | null
          eu_password?: string | null
          eu_telephone?: string | null
          eu_telephone_ext?: string | null
          eu_type?: number | null
          eu_valid_to_date?: string | null
          eug_id?: number | null
          supabase_user_id?: string | null
        }
        Update: {
          eu_business_partner?: string | null
          eu_changed_by?: string | null
          eu_changed_date?: string | null
          eu_created_date?: string | null
          eu_current_number?: number | null
          eu_deletion_flag?: string | null
          eu_email?: string | null
          eu_fax?: string | null
          eu_first_name?: string | null
          eu_id?: string
          eu_is_built_in_user?: string | null
          eu_last_login_date?: string | null
          eu_last_login_time?: string | null
          eu_last_name?: string | null
          eu_middle_initial?: string | null
          eu_mobile?: string | null
          eu_otp?: string | null
          eu_otp_valid?: string | null
          eu_password?: string | null
          eu_telephone?: string | null
          eu_telephone_ext?: string | null
          eu_type?: number | null
          eu_valid_to_date?: string | null
          eug_id?: number | null
          supabase_user_id?: string | null
        }
        Relationships: []
      }
      ezc_value_mapping: {
        Row: {
          map_type: string | null
          value1: string | null
          value2: string | null
        }
        Insert: {
          map_type?: string | null
          value1?: string | null
          value2?: string | null
        }
        Update: {
          map_type?: string | null
          value1?: string | null
          value2?: string | null
        }
        Relationships: []
      }
      ezc_warranty_claims_comments: {
        Row: {
          ewcc_comments: string | null
          ewcc_date: string
          ewcc_doc_id: string | null
          ewcc_ext1: string | null
          ewcc_ext2: string | null
          ewcc_user_id: string | null
          ewcc_visibility: string | null
        }
        Insert: {
          ewcc_comments?: string | null
          ewcc_date: string
          ewcc_doc_id?: string | null
          ewcc_ext1?: string | null
          ewcc_ext2?: string | null
          ewcc_user_id?: string | null
          ewcc_visibility?: string | null
        }
        Update: {
          ewcc_comments?: string | null
          ewcc_date?: string
          ewcc_doc_id?: string | null
          ewcc_ext1?: string | null
          ewcc_ext2?: string | null
          ewcc_user_id?: string | null
          ewcc_visibility?: string | null
        }
        Relationships: []
      }
      ezc_warranty_claims_header: {
        Row: {
          ewch_addr_line_1: string | null
          ewch_addr_line_2: string | null
          ewch_city: string | null
          ewch_claim_no: string | null
          ewch_comments: string | null
          ewch_country: string | null
          ewch_created_by: string | null
          ewch_created_on: string | null
          ewch_customer_po: string | null
          ewch_email: string | null
          ewch_equip_name: string | null
          ewch_ext1: string | null
          ewch_ext2: string | null
          ewch_ext3: string | null
          ewch_failed_date: string | null
          ewch_first_name: string | null
          ewch_last_name: string | null
          ewch_modified_by: string | null
          ewch_modified_on: string | null
          ewch_phone_no: string | null
          ewch_sales_org: string | null
          ewch_sell_sold_to: string | null
          ewch_serial_no: string | null
          ewch_ship_addr: string | null
          ewch_ship_city: string | null
          ewch_ship_country: string | null
          ewch_ship_name: string | null
          ewch_ship_phone: string | null
          ewch_ship_state: string | null
          ewch_ship_to: string | null
          ewch_ship_zip_code: string | null
          ewch_sold_to_name: string | null
          ewch_state: string | null
          ewch_status: string | null
          ewch_unit_installed_date: string | null
          ewch_unit_name: string | null
          ewch_uuid: string | null
          ewch_zip: string | null
        }
        Insert: {
          ewch_addr_line_1?: string | null
          ewch_addr_line_2?: string | null
          ewch_city?: string | null
          ewch_claim_no?: string | null
          ewch_comments?: string | null
          ewch_country?: string | null
          ewch_created_by?: string | null
          ewch_created_on?: string | null
          ewch_customer_po?: string | null
          ewch_email?: string | null
          ewch_equip_name?: string | null
          ewch_ext1?: string | null
          ewch_ext2?: string | null
          ewch_ext3?: string | null
          ewch_failed_date?: string | null
          ewch_first_name?: string | null
          ewch_last_name?: string | null
          ewch_modified_by?: string | null
          ewch_modified_on?: string | null
          ewch_phone_no?: string | null
          ewch_sales_org?: string | null
          ewch_sell_sold_to?: string | null
          ewch_serial_no?: string | null
          ewch_ship_addr?: string | null
          ewch_ship_city?: string | null
          ewch_ship_country?: string | null
          ewch_ship_name?: string | null
          ewch_ship_phone?: string | null
          ewch_ship_state?: string | null
          ewch_ship_to?: string | null
          ewch_ship_zip_code?: string | null
          ewch_sold_to_name?: string | null
          ewch_state?: string | null
          ewch_status?: string | null
          ewch_unit_installed_date?: string | null
          ewch_unit_name?: string | null
          ewch_uuid?: string | null
          ewch_zip?: string | null
        }
        Update: {
          ewch_addr_line_1?: string | null
          ewch_addr_line_2?: string | null
          ewch_city?: string | null
          ewch_claim_no?: string | null
          ewch_comments?: string | null
          ewch_country?: string | null
          ewch_created_by?: string | null
          ewch_created_on?: string | null
          ewch_customer_po?: string | null
          ewch_email?: string | null
          ewch_equip_name?: string | null
          ewch_ext1?: string | null
          ewch_ext2?: string | null
          ewch_ext3?: string | null
          ewch_failed_date?: string | null
          ewch_first_name?: string | null
          ewch_last_name?: string | null
          ewch_modified_by?: string | null
          ewch_modified_on?: string | null
          ewch_phone_no?: string | null
          ewch_sales_org?: string | null
          ewch_sell_sold_to?: string | null
          ewch_serial_no?: string | null
          ewch_ship_addr?: string | null
          ewch_ship_city?: string | null
          ewch_ship_country?: string | null
          ewch_ship_name?: string | null
          ewch_ship_phone?: string | null
          ewch_ship_state?: string | null
          ewch_ship_to?: string | null
          ewch_ship_zip_code?: string | null
          ewch_sold_to_name?: string | null
          ewch_state?: string | null
          ewch_status?: string | null
          ewch_unit_installed_date?: string | null
          ewch_unit_name?: string | null
          ewch_uuid?: string | null
          ewch_zip?: string | null
        }
        Relationships: []
      }
      ezc_warranty_claims_items: {
        Row: {
          ewci_comments: string | null
          ewci_defect_code: string | null
          ewci_description: string | null
          ewci_item_type: string | null
          ewci_labour_key: string | null
          ewci_material: string | null
          ewci_quantity: string | null
          ewci_resolution: string | null
          ewci_status: string | null
          ewci_uuid: string | null
        }
        Insert: {
          ewci_comments?: string | null
          ewci_defect_code?: string | null
          ewci_description?: string | null
          ewci_item_type?: string | null
          ewci_labour_key?: string | null
          ewci_material?: string | null
          ewci_quantity?: string | null
          ewci_resolution?: string | null
          ewci_status?: string | null
          ewci_uuid?: string | null
        }
        Update: {
          ewci_comments?: string | null
          ewci_defect_code?: string | null
          ewci_description?: string | null
          ewci_item_type?: string | null
          ewci_labour_key?: string | null
          ewci_material?: string | null
          ewci_quantity?: string | null
          ewci_resolution?: string | null
          ewci_status?: string | null
          ewci_uuid?: string | null
        }
        Relationships: []
      }
      ezc_web_stats: {
        Row: {
          ews_ip: string | null
          ews_logged_in: string | null
          ews_logged_out: string | null
          ews_sold_to: string | null
          ews_syskey: string | null
          ews_user_id: string | null
        }
        Insert: {
          ews_ip?: string | null
          ews_logged_in?: string | null
          ews_logged_out?: string | null
          ews_sold_to?: string | null
          ews_syskey?: string | null
          ews_user_id?: string | null
        }
        Update: {
          ews_ip?: string | null
          ews_logged_in?: string | null
          ews_logged_out?: string | null
          ews_sold_to?: string | null
          ews_syskey?: string | null
          ews_user_id?: string | null
        }
        Relationships: []
      }
      ezc_wf_actions: {
        Row: {
          ewa_availability_condition: string | null
          ewa_code: number | null
          ewa_description: string | null
          ewa_direction: string | null
          ewa_lang: string | null
          ewa_statoraction: string | null
        }
        Insert: {
          ewa_availability_condition?: string | null
          ewa_code?: number | null
          ewa_description?: string | null
          ewa_direction?: string | null
          ewa_lang?: string | null
          ewa_statoraction?: string | null
        }
        Update: {
          ewa_availability_condition?: string | null
          ewa_code?: number | null
          ewa_description?: string | null
          ewa_direction?: string | null
          ewa_lang?: string | null
          ewa_statoraction?: string | null
        }
        Relationships: []
      }
      ezc_wf_audit_trail: {
        Row: {
          ewat_audit_no: string | null
          ewat_comments: string | null
          ewat_date: string | null
          ewat_dest_participant: string | null
          ewat_dest_participant_type: string | null
          ewat_doc_id: string | null
          ewat_source_participant: string | null
          ewat_source_participant_type: string | null
          ewat_type: string | null
        }
        Insert: {
          ewat_audit_no?: string | null
          ewat_comments?: string | null
          ewat_date?: string | null
          ewat_dest_participant?: string | null
          ewat_dest_participant_type?: string | null
          ewat_doc_id?: string | null
          ewat_source_participant?: string | null
          ewat_source_participant_type?: string | null
          ewat_type?: string | null
        }
        Update: {
          ewat_audit_no?: string | null
          ewat_comments?: string | null
          ewat_date?: string | null
          ewat_dest_participant?: string | null
          ewat_dest_participant_type?: string | null
          ewat_doc_id?: string | null
          ewat_source_participant?: string | null
          ewat_source_participant_type?: string | null
          ewat_type?: string | null
        }
        Relationships: []
      }
      ezc_wf_auditlog: {
        Row: {
          ewa_action_by: string | null
          ewa_action_on: string | null
          ewa_audit_no: string | null
          ewa_doc_cat: string | null
          ewa_doc_no: string | null
          ewa_elapsed_period: number | null
          ewa_line_type: string | null
          ewa_query_period: number | null
          ewa_reject_period: number | null
        }
        Insert: {
          ewa_action_by?: string | null
          ewa_action_on?: string | null
          ewa_audit_no?: string | null
          ewa_doc_cat?: string | null
          ewa_doc_no?: string | null
          ewa_elapsed_period?: number | null
          ewa_line_type?: string | null
          ewa_query_period?: number | null
          ewa_reject_period?: number | null
        }
        Update: {
          ewa_action_by?: string | null
          ewa_action_on?: string | null
          ewa_audit_no?: string | null
          ewa_doc_cat?: string | null
          ewa_doc_no?: string | null
          ewa_elapsed_period?: number | null
          ewa_line_type?: string | null
          ewa_query_period?: number | null
          ewa_reject_period?: number | null
        }
        Relationships: []
      }
      ezc_wf_conditions_assignement: {
        Row: {
          ewca_auth_key: string | null
          ewca_bus_domain: string | null
          ewca_condition_id: number | null
          ewca_condition_text: string | null
          ewca_conditions: string | null
          ewca_descritpion: string | null
          ewca_doc_no: string | null
          ewca_doc_type: string | null
          ewca_result: string | null
        }
        Insert: {
          ewca_auth_key?: string | null
          ewca_bus_domain?: string | null
          ewca_condition_id?: number | null
          ewca_condition_text?: string | null
          ewca_conditions?: string | null
          ewca_descritpion?: string | null
          ewca_doc_no?: string | null
          ewca_doc_type?: string | null
          ewca_result?: string | null
        }
        Update: {
          ewca_auth_key?: string | null
          ewca_bus_domain?: string | null
          ewca_condition_id?: number | null
          ewca_condition_text?: string | null
          ewca_conditions?: string | null
          ewca_descritpion?: string | null
          ewca_doc_no?: string | null
          ewca_doc_type?: string | null
          ewca_result?: string | null
        }
        Relationships: []
      }
      ezc_wf_delegation_conditions: {
        Row: {
          ewdc_condition_id: number | null
          ewdc_delegation_id: string | null
        }
        Insert: {
          ewdc_condition_id?: number | null
          ewdc_delegation_id?: string | null
        }
        Update: {
          ewdc_condition_id?: number | null
          ewdc_delegation_id?: string | null
        }
        Relationships: []
      }
      ezc_wf_delegation_info: {
        Row: {
          ewdi_delegation_id: string | null
          ewdi_dest_user: string | null
          ewdi_source_user: string | null
          ewdi_template_code: number | null
          ewdi_valid_from: string | null
          ewdi_valid_to: string | null
        }
        Insert: {
          ewdi_delegation_id?: string | null
          ewdi_dest_user?: string | null
          ewdi_source_user?: string | null
          ewdi_template_code?: number | null
          ewdi_valid_from?: string | null
          ewdi_valid_to?: string | null
        }
        Update: {
          ewdi_delegation_id?: string | null
          ewdi_dest_user?: string | null
          ewdi_source_user?: string | null
          ewdi_template_code?: number | null
          ewdi_valid_from?: string | null
          ewdi_valid_to?: string | null
        }
        Relationships: []
      }
      ezc_wf_doc_history_details: {
        Row: {
          ewdhd_action_by: string | null
          ewdhd_action_on: string | null
          ewdhd_comments: string | null
          ewdhd_key: number | null
          ewdhd_this_step: number | null
          ewdhd_wf_action: number | null
          ewdhd_wf_status: string | null
        }
        Insert: {
          ewdhd_action_by?: string | null
          ewdhd_action_on?: string | null
          ewdhd_comments?: string | null
          ewdhd_key?: number | null
          ewdhd_this_step?: number | null
          ewdhd_wf_action?: number | null
          ewdhd_wf_status?: string | null
        }
        Update: {
          ewdhd_action_by?: string | null
          ewdhd_action_on?: string | null
          ewdhd_comments?: string | null
          ewdhd_key?: number | null
          ewdhd_this_step?: number | null
          ewdhd_wf_action?: number | null
          ewdhd_wf_status?: string | null
        }
        Relationships: []
      }
      ezc_wf_doc_history_header: {
        Row: {
          ewdhh_auth_key: string | null
          ewdhh_created_by: string | null
          ewdhh_created_on: string | null
          ewdhh_current_step: number | null
          ewdhh_d_participant_type: string | null
          ewdhh_doc_date: string | null
          ewdhh_doc_id: string | null
          ewdhh_key: number | null
          ewdhh_modified_by: string | null
          ewdhh_modified_on: string | null
          ewdhh_next_d_participant: string | null
          ewdhh_next_participant: string | null
          ewdhh_participant_type: string | null
          ewdhh_ref1: string | null
          ewdhh_ref2: string | null
          ewdhh_sold_to: string | null
          ewdhh_syskey: string | null
          ewdhh_template_code: number | null
          ewdhh_wf_status: string | null
        }
        Insert: {
          ewdhh_auth_key?: string | null
          ewdhh_created_by?: string | null
          ewdhh_created_on?: string | null
          ewdhh_current_step?: number | null
          ewdhh_d_participant_type?: string | null
          ewdhh_doc_date?: string | null
          ewdhh_doc_id?: string | null
          ewdhh_key?: number | null
          ewdhh_modified_by?: string | null
          ewdhh_modified_on?: string | null
          ewdhh_next_d_participant?: string | null
          ewdhh_next_participant?: string | null
          ewdhh_participant_type?: string | null
          ewdhh_ref1?: string | null
          ewdhh_ref2?: string | null
          ewdhh_sold_to?: string | null
          ewdhh_syskey?: string | null
          ewdhh_template_code?: number | null
          ewdhh_wf_status?: string | null
        }
        Update: {
          ewdhh_auth_key?: string | null
          ewdhh_created_by?: string | null
          ewdhh_created_on?: string | null
          ewdhh_current_step?: number | null
          ewdhh_d_participant_type?: string | null
          ewdhh_doc_date?: string | null
          ewdhh_doc_id?: string | null
          ewdhh_key?: number | null
          ewdhh_modified_by?: string | null
          ewdhh_modified_on?: string | null
          ewdhh_next_d_participant?: string | null
          ewdhh_next_participant?: string | null
          ewdhh_participant_type?: string | null
          ewdhh_ref1?: string | null
          ewdhh_ref2?: string | null
          ewdhh_sold_to?: string | null
          ewdhh_syskey?: string | null
          ewdhh_template_code?: number | null
          ewdhh_wf_status?: string | null
        }
        Relationships: []
      }
      ezc_wf_doc_status_view: {
        Row: {
          ewdhh_auth_key: string | null
          ewdhh_created_by: string | null
          ewdhh_created_on: string | null
          ewdhh_current_step: number | null
          ewdhh_doc_date: string | null
          ewdhh_doc_id: string | null
          ewdhh_key: number | null
          ewdhh_modified_by: string | null
          ewdhh_modified_on: string | null
          ewdhh_next_participant: string | null
          ewdhh_participant_type: string | null
          ewdhh_ref1: string | null
          ewdhh_ref2: string | null
          ewdhh_sold_to: string | null
          ewdhh_syskey: string | null
          ewdhh_template_code: number | null
          ewdhh_wf_status: string | null
          ezpa_created_by: string | null
          ezpa_created_on: string | null
          ezpa_doc_date: string | null
          ezpa_doc_no: string | null
          ezpa_doc_status: string | null
          ezpa_ext1: string | null
          ezpa_ext2: string | null
          ezpa_ext3: string | null
          ezpa_header_text: string | null
          ezpa_modified_on: string | null
          ezpa_sold_to: string | null
          ezpa_sys_key: string | null
        }
        Insert: {
          ewdhh_auth_key?: string | null
          ewdhh_created_by?: string | null
          ewdhh_created_on?: string | null
          ewdhh_current_step?: number | null
          ewdhh_doc_date?: string | null
          ewdhh_doc_id?: string | null
          ewdhh_key?: number | null
          ewdhh_modified_by?: string | null
          ewdhh_modified_on?: string | null
          ewdhh_next_participant?: string | null
          ewdhh_participant_type?: string | null
          ewdhh_ref1?: string | null
          ewdhh_ref2?: string | null
          ewdhh_sold_to?: string | null
          ewdhh_syskey?: string | null
          ewdhh_template_code?: number | null
          ewdhh_wf_status?: string | null
          ezpa_created_by?: string | null
          ezpa_created_on?: string | null
          ezpa_doc_date?: string | null
          ezpa_doc_no?: string | null
          ezpa_doc_status?: string | null
          ezpa_ext1?: string | null
          ezpa_ext2?: string | null
          ezpa_ext3?: string | null
          ezpa_header_text?: string | null
          ezpa_modified_on?: string | null
          ezpa_sold_to?: string | null
          ezpa_sys_key?: string | null
        }
        Update: {
          ewdhh_auth_key?: string | null
          ewdhh_created_by?: string | null
          ewdhh_created_on?: string | null
          ewdhh_current_step?: number | null
          ewdhh_doc_date?: string | null
          ewdhh_doc_id?: string | null
          ewdhh_key?: number | null
          ewdhh_modified_by?: string | null
          ewdhh_modified_on?: string | null
          ewdhh_next_participant?: string | null
          ewdhh_participant_type?: string | null
          ewdhh_ref1?: string | null
          ewdhh_ref2?: string | null
          ewdhh_sold_to?: string | null
          ewdhh_syskey?: string | null
          ewdhh_template_code?: number | null
          ewdhh_wf_status?: string | null
          ezpa_created_by?: string | null
          ezpa_created_on?: string | null
          ezpa_doc_date?: string | null
          ezpa_doc_no?: string | null
          ezpa_doc_status?: string | null
          ezpa_ext1?: string | null
          ezpa_ext2?: string | null
          ezpa_ext3?: string | null
          ezpa_header_text?: string | null
          ezpa_modified_on?: string | null
          ezpa_sold_to?: string | null
          ezpa_sys_key?: string | null
        }
        Relationships: []
      }
      ezc_wf_escalation: {
        Row: {
          ewe_code: number | null
          ewe_description: string | null
          ewe_duration: number | null
          ewe_group_id: string | null
          ewe_lang: string | null
          ewe_level: string | null
          ewe_move: string | null
          ewe_role_id: string | null
          ewe_template: number | null
          ewe_type: string | null
          ewe_user_id: string | null
        }
        Insert: {
          ewe_code?: number | null
          ewe_description?: string | null
          ewe_duration?: number | null
          ewe_group_id?: string | null
          ewe_lang?: string | null
          ewe_level?: string | null
          ewe_move?: string | null
          ewe_role_id?: string | null
          ewe_template?: number | null
          ewe_type?: string | null
          ewe_user_id?: string | null
        }
        Update: {
          ewe_code?: number | null
          ewe_description?: string | null
          ewe_duration?: number | null
          ewe_group_id?: string | null
          ewe_lang?: string | null
          ewe_level?: string | null
          ewe_move?: string | null
          ewe_role_id?: string | null
          ewe_template?: number | null
          ewe_type?: string | null
          ewe_user_id?: string | null
        }
        Relationships: []
      }
      ezc_wf_orgonagram: {
        Row: {
          ewo_code: number | null
          ewo_description: string | null
          ewo_lang: string | null
          ewo_syskey: string | null
          ewo_template: number | null
        }
        Insert: {
          ewo_code?: number | null
          ewo_description?: string | null
          ewo_lang?: string | null
          ewo_syskey?: string | null
          ewo_template?: number | null
        }
        Update: {
          ewo_code?: number | null
          ewo_description?: string | null
          ewo_lang?: string | null
          ewo_syskey?: string | null
          ewo_template?: number | null
        }
        Relationships: []
      }
      ezc_wf_orgonagram_details: {
        Row: {
          ewod_code: number | null
          ewod_description: string | null
          ewod_lang: string | null
          ewod_level: number | null
          ewod_parent: string | null
          ewod_participant: string | null
          ewod_participant_type: string | null
        }
        Insert: {
          ewod_code?: number | null
          ewod_description?: string | null
          ewod_lang?: string | null
          ewod_level?: number | null
          ewod_parent?: string | null
          ewod_participant?: string | null
          ewod_participant_type?: string | null
        }
        Update: {
          ewod_code?: number | null
          ewod_description?: string | null
          ewod_lang?: string | null
          ewod_level?: number | null
          ewod_parent?: string | null
          ewod_participant?: string | null
          ewod_participant_type?: string | null
        }
        Relationships: []
      }
      ezc_wf_role_rules: {
        Row: {
          ewrc_authkey: string | null
          ewrc_condition_text: string | null
          ewrc_conditions: string | null
          ewrc_descritpion: string | null
          ewrc_result: string | null
          ewrc_rolenr: string | null
          ewrc_rule_id: number | null
        }
        Insert: {
          ewrc_authkey?: string | null
          ewrc_condition_text?: string | null
          ewrc_conditions?: string | null
          ewrc_descritpion?: string | null
          ewrc_result?: string | null
          ewrc_rolenr?: string | null
          ewrc_rule_id?: number | null
        }
        Update: {
          ewrc_authkey?: string | null
          ewrc_condition_text?: string | null
          ewrc_conditions?: string | null
          ewrc_descritpion?: string | null
          ewrc_result?: string | null
          ewrc_rolenr?: string | null
          ewrc_rule_id?: number | null
        }
        Relationships: []
      }
      ezc_wf_template_code: {
        Row: {
          ewtc_auth_key: string | null
          ewtc_code: number | null
          ewtc_desc: string | null
          ewtc_lang: string | null
        }
        Insert: {
          ewtc_auth_key?: string | null
          ewtc_code?: number | null
          ewtc_desc?: string | null
          ewtc_lang?: string | null
        }
        Update: {
          ewtc_auth_key?: string | null
          ewtc_code?: number | null
          ewtc_desc?: string | null
          ewtc_lang?: string | null
        }
        Relationships: []
      }
      ezc_wf_template_steps: {
        Row: {
          ewts_code: number | null
          ewts_fyi_participant: string | null
          ewts_fyi_participant_type: string | null
          ewts_is_mandatory: string | null
          ewts_owner_participant: string | null
          ewts_owner_participant_type: string | null
          ewts_role: string | null
          ewts_step: number | null
          ewts_step_desc: string | null
        }
        Insert: {
          ewts_code?: number | null
          ewts_fyi_participant?: string | null
          ewts_fyi_participant_type?: string | null
          ewts_is_mandatory?: string | null
          ewts_owner_participant?: string | null
          ewts_owner_participant_type?: string | null
          ewts_role?: string | null
          ewts_step?: number | null
          ewts_step_desc?: string | null
        }
        Update: {
          ewts_code?: number | null
          ewts_fyi_participant?: string | null
          ewts_fyi_participant_type?: string | null
          ewts_is_mandatory?: string | null
          ewts_owner_participant?: string | null
          ewts_owner_participant_type?: string | null
          ewts_role?: string | null
          ewts_step?: number | null
          ewts_step_desc?: string | null
        }
        Relationships: []
      }
      ezc_wf_workgroup_users: {
        Row: {
          ewwu_effective_from: string | null
          ewwu_effective_to: string | null
          ewwu_group: string | null
          ewwu_sold_to: string | null
          ewwu_syskey: string | null
          ewwu_user: string | null
        }
        Insert: {
          ewwu_effective_from?: string | null
          ewwu_effective_to?: string | null
          ewwu_group?: string | null
          ewwu_sold_to?: string | null
          ewwu_syskey?: string | null
          ewwu_user?: string | null
        }
        Update: {
          ewwu_effective_from?: string | null
          ewwu_effective_to?: string | null
          ewwu_group?: string | null
          ewwu_sold_to?: string | null
          ewwu_syskey?: string | null
          ewwu_user?: string | null
        }
        Relationships: []
      }
      ezc_wf_workgroups: {
        Row: {
          eww_description: string | null
          eww_group: string | null
          eww_lang: string | null
          eww_role_no: string | null
          eww_type: string | null
        }
        Insert: {
          eww_description?: string | null
          eww_group?: string | null
          eww_lang?: string | null
          eww_role_no?: string | null
          eww_type?: string | null
        }
        Update: {
          eww_description?: string | null
          eww_group?: string | null
          eww_lang?: string | null
          eww_role_no?: string | null
          eww_type?: string | null
        }
        Relationships: []
      }
      ezc_whats_new: {
        Row: {
          ewn_image_name: string | null
          ewn_url: string | null
        }
        Insert: {
          ewn_image_name?: string | null
          ewn_url?: string | null
        }
        Update: {
          ewn_image_name?: string | null
          ewn_url?: string | null
        }
        Relationships: []
      }
      ezc_workflow_procedure: {
        Row: {
          ewp_cause_action: string | null
          ewp_copy_to_role: string | null
          ewp_mandatory_step: string | null
          ewp_procedure_type: string | null
          ewp_step_number: number | null
          ewp_user_role: string | null
        }
        Insert: {
          ewp_cause_action?: string | null
          ewp_copy_to_role?: string | null
          ewp_mandatory_step?: string | null
          ewp_procedure_type?: string | null
          ewp_step_number?: number | null
          ewp_user_role?: string | null
        }
        Update: {
          ewp_cause_action?: string | null
          ewp_copy_to_role?: string | null
          ewp_mandatory_step?: string | null
          ewp_procedure_type?: string | null
          ewp_step_number?: number | null
          ewp_user_role?: string | null
        }
        Relationships: []
      }
      ezc_xml_doctype: {
        Row: {
          exd_xml_doctype: string | null
          exd_xml_doctype_despription: string | null
        }
        Insert: {
          exd_xml_doctype?: string | null
          exd_xml_doctype_despription?: string | null
        }
        Update: {
          exd_xml_doctype?: string | null
          exd_xml_doctype_despription?: string | null
        }
        Relationships: []
      }
      ezc_xml_erp_mapping: {
        Row: {
          exe_client: number | null
          exe_erp_mandatory: string | null
          exe_erp_system: string | null
          exe_erp_version: string | null
          exe_structure_flag: string | null
          exe_xml_attribute: string | null
          exe_xml_data_type: string | null
          exe_xml_doctype: string | null
          exe_xml_element: string | null
          exe_xml_erp_class: string | null
          exe_xml_ezc_container: string | null
          exe_xml_ezc_fieldtype: string | null
          exe_xml_ezc_structure: string | null
          exe_xml_ezc_structure_fields: string | null
          exe_xml_parent_element: string | null
          exe_xml_res1: string | null
          exe_xml_sequence_id: number | null
          exe_xml_standard: string | null
        }
        Insert: {
          exe_client?: number | null
          exe_erp_mandatory?: string | null
          exe_erp_system?: string | null
          exe_erp_version?: string | null
          exe_structure_flag?: string | null
          exe_xml_attribute?: string | null
          exe_xml_data_type?: string | null
          exe_xml_doctype?: string | null
          exe_xml_element?: string | null
          exe_xml_erp_class?: string | null
          exe_xml_ezc_container?: string | null
          exe_xml_ezc_fieldtype?: string | null
          exe_xml_ezc_structure?: string | null
          exe_xml_ezc_structure_fields?: string | null
          exe_xml_parent_element?: string | null
          exe_xml_res1?: string | null
          exe_xml_sequence_id?: number | null
          exe_xml_standard?: string | null
        }
        Update: {
          exe_client?: number | null
          exe_erp_mandatory?: string | null
          exe_erp_system?: string | null
          exe_erp_version?: string | null
          exe_structure_flag?: string | null
          exe_xml_attribute?: string | null
          exe_xml_data_type?: string | null
          exe_xml_doctype?: string | null
          exe_xml_element?: string | null
          exe_xml_erp_class?: string | null
          exe_xml_ezc_container?: string | null
          exe_xml_ezc_fieldtype?: string | null
          exe_xml_ezc_structure?: string | null
          exe_xml_ezc_structure_fields?: string | null
          exe_xml_parent_element?: string | null
          exe_xml_res1?: string | null
          exe_xml_sequence_id?: number | null
          exe_xml_standard?: string | null
        }
        Relationships: []
      }
      ezc_xml_method_mapping: {
        Row: {
          exm_erp_class: string | null
          exm_erp_method: string | null
          exm_erp_return: string | null
          exm_erp_system: string | null
          exm_erp_version: string | null
          exm_package: string | null
          exm_system_type: string | null
          exm_xml_doctype: string | null
          exm_xml_standard: string | null
          exm_xml_transaction_id: string | null
        }
        Insert: {
          exm_erp_class?: string | null
          exm_erp_method?: string | null
          exm_erp_return?: string | null
          exm_erp_system?: string | null
          exm_erp_version?: string | null
          exm_package?: string | null
          exm_system_type?: string | null
          exm_xml_doctype?: string | null
          exm_xml_standard?: string | null
          exm_xml_transaction_id?: string | null
        }
        Update: {
          exm_erp_class?: string | null
          exm_erp_method?: string | null
          exm_erp_return?: string | null
          exm_erp_system?: string | null
          exm_erp_version?: string | null
          exm_package?: string | null
          exm_system_type?: string | null
          exm_xml_doctype?: string | null
          exm_xml_standard?: string | null
          exm_xml_transaction_id?: string | null
        }
        Relationships: []
      }
      ezc_xml_standard: {
        Row: {
          exs_xml_standard: string | null
          exs_xml_standard_despription: string | null
        }
        Insert: {
          exs_xml_standard?: string | null
          exs_xml_standard_despription?: string | null
        }
        Update: {
          exs_xml_standard?: string | null
          exs_xml_standard_despription?: string | null
        }
        Relationships: []
      }
      part_smart_documents: {
        Row: {
          created_at: string
          file_content_type: string | null
          file_file_name: string | null
          file_file_size: number | null
          file_updated_at: string
          id: number
          updated_at: string
        }
        Insert: {
          created_at: string
          file_content_type?: string | null
          file_file_name?: string | null
          file_file_size?: number | null
          file_updated_at: string
          id: number
          updated_at: string
        }
        Update: {
          created_at?: string
          file_content_type?: string | null
          file_file_name?: string | null
          file_file_size?: number | null
          file_updated_at?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          eu_business_partner: string | null
          eu_id: string | null
          eu_type: number | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          eu_business_partner?: string | null
          eu_id?: string | null
          eu_type?: number | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          eu_business_partner?: string | null
          eu_id?: string | null
          eu_type?: number | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_eu_id_fkey"
            columns: ["eu_id"]
            isOneToOne: false
            referencedRelation: "ezc_users"
            referencedColumns: ["eu_id"]
          },
        ]
      }
      qrtz_blob_triggers: {
        Row: {
          blob_data: string | null
          trigger_group: string | null
          trigger_name: string | null
        }
        Insert: {
          blob_data?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Update: {
          blob_data?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      qrtz_calendars: {
        Row: {
          calendar: string | null
          calendar_name: string | null
        }
        Insert: {
          calendar?: string | null
          calendar_name?: string | null
        }
        Update: {
          calendar?: string | null
          calendar_name?: string | null
        }
        Relationships: []
      }
      qrtz_cron_triggers: {
        Row: {
          cron_expression: string | null
          time_zone_id: string | null
          trigger_group: string | null
          trigger_name: string | null
        }
        Insert: {
          cron_expression?: string | null
          time_zone_id?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Update: {
          cron_expression?: string | null
          time_zone_id?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      qrtz_fired_triggers: {
        Row: {
          entry_id: string | null
          fired_time: number
          instance_name: string | null
          is_stateful: unknown | null
          is_volatile: unknown
          job_group: string | null
          job_name: string | null
          priority: number
          requests_recovery: unknown | null
          state: string | null
          trigger_group: string | null
          trigger_name: string | null
        }
        Insert: {
          entry_id?: string | null
          fired_time: number
          instance_name?: string | null
          is_stateful?: unknown | null
          is_volatile: unknown
          job_group?: string | null
          job_name?: string | null
          priority: number
          requests_recovery?: unknown | null
          state?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Update: {
          entry_id?: string | null
          fired_time?: number
          instance_name?: string | null
          is_stateful?: unknown | null
          is_volatile?: unknown
          job_group?: string | null
          job_name?: string | null
          priority?: number
          requests_recovery?: unknown | null
          state?: string | null
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      qrtz_job_details: {
        Row: {
          description: string | null
          is_durable: unknown
          is_stateful: unknown
          is_volatile: unknown
          job_class_name: string | null
          job_data: string | null
          job_group: string | null
          job_name: string | null
          requests_recovery: unknown
        }
        Insert: {
          description?: string | null
          is_durable: unknown
          is_stateful: unknown
          is_volatile: unknown
          job_class_name?: string | null
          job_data?: string | null
          job_group?: string | null
          job_name?: string | null
          requests_recovery: unknown
        }
        Update: {
          description?: string | null
          is_durable?: unknown
          is_stateful?: unknown
          is_volatile?: unknown
          job_class_name?: string | null
          job_data?: string | null
          job_group?: string | null
          job_name?: string | null
          requests_recovery?: unknown
        }
        Relationships: []
      }
      qrtz_job_listeners: {
        Row: {
          job_group: string | null
          job_listener: string | null
          job_name: string | null
        }
        Insert: {
          job_group?: string | null
          job_listener?: string | null
          job_name?: string | null
        }
        Update: {
          job_group?: string | null
          job_listener?: string | null
          job_name?: string | null
        }
        Relationships: []
      }
      qrtz_locks: {
        Row: {
          lock_name: string | null
        }
        Insert: {
          lock_name?: string | null
        }
        Update: {
          lock_name?: string | null
        }
        Relationships: []
      }
      qrtz_paused_trigger_grps: {
        Row: {
          trigger_group: string | null
        }
        Insert: {
          trigger_group?: string | null
        }
        Update: {
          trigger_group?: string | null
        }
        Relationships: []
      }
      qrtz_scheduler_state: {
        Row: {
          checkin_interval: number
          instance_name: string | null
          last_checkin_time: number
        }
        Insert: {
          checkin_interval: number
          instance_name?: string | null
          last_checkin_time: number
        }
        Update: {
          checkin_interval?: number
          instance_name?: string | null
          last_checkin_time?: number
        }
        Relationships: []
      }
      qrtz_simple_triggers: {
        Row: {
          repeat_count: number
          repeat_interval: number
          times_triggered: number
          trigger_group: string | null
          trigger_name: string | null
        }
        Insert: {
          repeat_count: number
          repeat_interval: number
          times_triggered: number
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Update: {
          repeat_count?: number
          repeat_interval?: number
          times_triggered?: number
          trigger_group?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      qrtz_trigger_listeners: {
        Row: {
          trigger_group: string | null
          trigger_listener: string | null
          trigger_name: string | null
        }
        Insert: {
          trigger_group?: string | null
          trigger_listener?: string | null
          trigger_name?: string | null
        }
        Update: {
          trigger_group?: string | null
          trigger_listener?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      qrtz_triggers: {
        Row: {
          calendar_name: string | null
          description: string | null
          end_time: number | null
          is_volatile: unknown
          job_data: string | null
          job_group: string | null
          job_name: string | null
          misfire_instr: number | null
          next_fire_time: number | null
          prev_fire_time: number | null
          priority: number | null
          start_time: number
          trigger_group: string | null
          trigger_name: string | null
          trigger_state: string | null
          trigger_type: string | null
        }
        Insert: {
          calendar_name?: string | null
          description?: string | null
          end_time?: number | null
          is_volatile: unknown
          job_data?: string | null
          job_group?: string | null
          job_name?: string | null
          misfire_instr?: number | null
          next_fire_time?: number | null
          prev_fire_time?: number | null
          priority?: number | null
          start_time: number
          trigger_group?: string | null
          trigger_name?: string | null
          trigger_state?: string | null
          trigger_type?: string | null
        }
        Update: {
          calendar_name?: string | null
          description?: string | null
          end_time?: number | null
          is_volatile?: unknown
          job_data?: string | null
          job_group?: string | null
          job_name?: string | null
          misfire_instr?: number | null
          next_fire_time?: number | null
          prev_fire_time?: number | null
          priority?: number | null
          start_time?: number
          trigger_group?: string | null
          trigger_name?: string | null
          trigger_state?: string | null
          trigger_type?: string | null
        }
        Relationships: []
      }
      sap_credentials: {
        Row: {
          api_path: string
          created_at: string
          distribution_channel: string | null
          division: string | null
          ecc_client: string | null
          ecc_language: string | null
          ecc_server: string | null
          ecc_system_id: string | null
          id: string
          sales_organization: string | null
          sap_password: string
          sap_system_type: string | null
          sap_user: string
          server: string
        }
        Insert: {
          api_path?: string
          created_at?: string
          distribution_channel?: string | null
          division?: string | null
          ecc_client?: string | null
          ecc_language?: string | null
          ecc_server?: string | null
          ecc_system_id?: string | null
          id?: string
          sales_organization?: string | null
          sap_password: string
          sap_system_type?: string | null
          sap_user: string
          server?: string
        }
        Update: {
          api_path?: string
          created_at?: string
          distribution_channel?: string | null
          division?: string | null
          ecc_client?: string | null
          ecc_language?: string | null
          ecc_server?: string | null
          ecc_system_id?: string | null
          id?: string
          sales_organization?: string | null
          sap_password?: string
          sap_system_type?: string | null
          sap_user?: string
          server?: string
        }
        Relationships: []
      }
      web_mat_details: {
        Row: {
          emd_desc: string | null
          emd_specs1: string | null
          emd_specs2: string | null
          emd_specs3: string | null
          emd_specs4: string | null
          emm_avail_quantity: number | null
          emm_catalog_no: number | null
          emm_color: string | null
          emm_curr_key: string | null
          emm_deletion_flag: string | null
          emm_ean_upc_no: string | null
          emm_effective_date: string | null
          emm_ext_no: string | null
          emm_family: string | null
          emm_finish: string | null
          emm_future_price: number | null
          emm_id: number | null
          emm_image_flag: string | null
          emm_image_path: string | null
          emm_length: string | null
          emm_manufacturer: string | null
          emm_no: string | null
          emm_size: string | null
          emm_specs: string | null
          emm_status: string | null
          emm_type: string | null
          emm_unit_of_measure: string | null
          emm_unit_price: number | null
          emm_variable_price_flag: string | null
          emm_width: string | null
        }
        Insert: {
          emd_desc?: string | null
          emd_specs1?: string | null
          emd_specs2?: string | null
          emd_specs3?: string | null
          emd_specs4?: string | null
          emm_avail_quantity?: number | null
          emm_catalog_no?: number | null
          emm_color?: string | null
          emm_curr_key?: string | null
          emm_deletion_flag?: string | null
          emm_ean_upc_no?: string | null
          emm_effective_date?: string | null
          emm_ext_no?: string | null
          emm_family?: string | null
          emm_finish?: string | null
          emm_future_price?: number | null
          emm_id?: number | null
          emm_image_flag?: string | null
          emm_image_path?: string | null
          emm_length?: string | null
          emm_manufacturer?: string | null
          emm_no?: string | null
          emm_size?: string | null
          emm_specs?: string | null
          emm_status?: string | null
          emm_type?: string | null
          emm_unit_of_measure?: string | null
          emm_unit_price?: number | null
          emm_variable_price_flag?: string | null
          emm_width?: string | null
        }
        Update: {
          emd_desc?: string | null
          emd_specs1?: string | null
          emd_specs2?: string | null
          emd_specs3?: string | null
          emd_specs4?: string | null
          emm_avail_quantity?: number | null
          emm_catalog_no?: number | null
          emm_color?: string | null
          emm_curr_key?: string | null
          emm_deletion_flag?: string | null
          emm_ean_upc_no?: string | null
          emm_effective_date?: string | null
          emm_ext_no?: string | null
          emm_family?: string | null
          emm_finish?: string | null
          emm_future_price?: number | null
          emm_id?: number | null
          emm_image_flag?: string | null
          emm_image_path?: string | null
          emm_length?: string | null
          emm_manufacturer?: string | null
          emm_no?: string | null
          emm_size?: string | null
          emm_specs?: string | null
          emm_status?: string | null
          emm_type?: string | null
          emm_unit_of_measure?: string | null
          emm_unit_price?: number | null
          emm_variable_price_flag?: string | null
          emm_width?: string | null
        }
        Relationships: []
      }
      zcat_staging: {
        Row: {
          wa: string | null
        }
        Insert: {
          wa?: string | null
        }
        Update: {
          wa?: string | null
        }
        Relationships: []
      }
      zmatman_staging: {
        Row: {
          custgroup2: string | null
          grp2: string | null
          listprice: number | null
          luxury: string | null
          netsheet: string | null
          pricegroup: string | null
          productline: string | null
          rate1: number | null
          rate2: number | null
          rate3: number | null
          rate4: number | null
          region: string | null
          scale1: number | null
          scale2: number | null
          scale3: number | null
          scale4: number | null
          scaleuom: string | null
          sku: string | null
        }
        Insert: {
          custgroup2?: string | null
          grp2?: string | null
          listprice?: number | null
          luxury?: string | null
          netsheet?: string | null
          pricegroup?: string | null
          productline?: string | null
          rate1?: number | null
          rate2?: number | null
          rate3?: number | null
          rate4?: number | null
          region?: string | null
          scale1?: number | null
          scale2?: number | null
          scale3?: number | null
          scale4?: number | null
          scaleuom?: string | null
          sku?: string | null
        }
        Update: {
          custgroup2?: string | null
          grp2?: string | null
          listprice?: number | null
          luxury?: string | null
          netsheet?: string | null
          pricegroup?: string | null
          productline?: string | null
          rate1?: number | null
          rate2?: number | null
          rate3?: number | null
          rate4?: number | null
          region?: string | null
          scale1?: number | null
          scale2?: number | null
          scale3?: number | null
          scale4?: number | null
          scaleuom?: string | null
          sku?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_next_business_partner_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_next_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_ship_to_options: {
        Args: { sold_to: string }
        Returns: {
          customer_no: string
          customer_name: string
          reference_no: number
        }[]
      }
      get_user_permissions: {
        Args: { user_id: string }
        Returns: {
          auth_key: string
          auth_value: string
        }[]
      }
      get_user_sold_to_options: {
        Args: { user_id: string }
        Returns: {
          customer_no: string
          customer_name: string
          sys_key: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
