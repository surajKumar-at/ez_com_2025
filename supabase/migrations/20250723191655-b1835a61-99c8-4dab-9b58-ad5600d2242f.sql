
-- Insert 100 sample records into ezc_adverse_event_info table using actual column names
INSERT INTO ezc_adverse_event_info (
  eaei_patient_first_name,
  eaei_patient_last_name,
  eaei_patient_middle_initial,
  eaei_patient_dob,
  eaei_patient_age,
  eaei_sex,
  eaei_patient_weight,
  eaei_patient_height,
  eaei_patient_medical_record_no,
  eaei_adverse_events_description,
  eaei_adverse_event_onset,
  eaei_event_location,
  eaei_event_severity,
  eaei_event_outcome,
  eaei_reporter_name,
  eaei_reporter_title,
  eaei_reporter_contact,
  eaei_device_name,
  eaei_device_model,
  eaei_device_serial,
  eaei_device_lot,
  eaei_medication_name,
  eaei_medication_dose,
  eaei_medication_route,
  eaei_medication_frequency,
  eaei_concomitant_meds,
  eaei_medical_history,
  eaei_lab_values,
  eaei_actions_taken,
  eaei_followup_required,
  eaei_report_to_fda,
  eaei_report_to_manufacturer,
  eaei_status,
  eaei_assigned_to,
  eaei_priority,
  eaei_creation_date,
  eaei_changed_date
)
SELECT 
  -- Patient Information
  CASE (i % 10)
    WHEN 0 THEN 'John'
    WHEN 1 THEN 'Jane'
    WHEN 2 THEN 'Michael'
    WHEN 3 THEN 'Sarah'
    WHEN 4 THEN 'David'
    WHEN 5 THEN 'Emily'
    WHEN 6 THEN 'Robert'
    WHEN 7 THEN 'Lisa'
    WHEN 8 THEN 'James'
    ELSE 'Maria'
  END as eaei_patient_first_name,
  
  CASE (i % 10)
    WHEN 0 THEN 'Smith'
    WHEN 1 THEN 'Johnson'
    WHEN 2 THEN 'Williams'
    WHEN 3 THEN 'Brown'
    WHEN 4 THEN 'Jones'
    WHEN 5 THEN 'Garcia'
    WHEN 6 THEN 'Miller'
    WHEN 7 THEN 'Davis'
    WHEN 8 THEN 'Rodriguez'
    ELSE 'Wilson'
  END as eaei_patient_last_name,
  
  CASE WHEN i % 3 = 0 THEN 
    CASE (i % 5)
      WHEN 0 THEN 'A'
      WHEN 1 THEN 'B'
      WHEN 2 THEN 'C'
      WHEN 3 THEN 'D'
      ELSE 'E'
    END
  ELSE NULL END as eaei_patient_middle_initial,
  
  ('1950-01-01'::timestamp + (i * 100) * interval '1 day')::timestamp as eaei_patient_dob,
  (25 + (i % 50))::numeric as eaei_patient_age,
  
  CASE WHEN i % 2 = 0 THEN 'Male' ELSE 'Female' END as eaei_sex,
  
  (50.0 + (i % 80))::numeric as eaei_patient_weight,
  (150.0 + (i % 50))::numeric as eaei_patient_height,
  
  'MR' || LPAD(i::text, 6, '0') as eaei_patient_medical_record_no,
  
  -- Event Information
  CASE (i % 8)
    WHEN 0 THEN 'Patient experienced allergic reaction after device placement'
    WHEN 1 THEN 'Device malfunction during procedure'
    WHEN 2 THEN 'Post-operative infection at implant site'
    WHEN 3 THEN 'Unexpected bleeding during device insertion'
    WHEN 4 THEN 'Device displacement noted on follow-up imaging'
    WHEN 5 THEN 'Patient reported pain at device site'
    WHEN 6 THEN 'Device battery depletion earlier than expected'
    ELSE 'Patient experienced adverse drug reaction'
  END as eaei_adverse_events_description,
  
  ('2024-01-01'::timestamp + (i * 2) * interval '1 day')::timestamp as eaei_adverse_event_onset,
  
  CASE (i % 6)
    WHEN 0 THEN 'Operating Room 1'
    WHEN 1 THEN 'Operating Room 2'
    WHEN 2 THEN 'ICU'
    WHEN 3 THEN 'Emergency Department'
    WHEN 4 THEN 'Patient Room'
    ELSE 'Cardiac Cath Lab'
  END as eaei_event_location,
  
  CASE (i % 4)
    WHEN 0 THEN 'Mild'
    WHEN 1 THEN 'Moderate'
    WHEN 2 THEN 'Severe'
    ELSE 'Life-threatening'
  END as eaei_event_severity,
  
  CASE (i % 5)
    WHEN 0 THEN 'Patient recovered completely'
    WHEN 1 THEN 'Patient recovered with treatment'
    WHEN 2 THEN 'Patient stabilized'
    WHEN 3 THEN 'Ongoing treatment required'
    ELSE 'Patient transferred to specialist care'
  END as eaei_event_outcome,
  
  -- Reporter Information
  'Dr. Reporter' || (i % 20 + 1) as eaei_reporter_name,
  
  CASE (i % 4)
    WHEN 0 THEN 'Physician'
    WHEN 1 THEN 'Surgeon'
    WHEN 2 THEN 'Nurse'
    ELSE 'Specialist'
  END as eaei_reporter_title,
  
  'reporter' || (i % 20 + 1) || '@hospital.com' as eaei_reporter_contact,
  
  -- Device Information
  CASE (i % 8)
    WHEN 0 THEN 'CardioStent Pro'
    WHEN 1 THEN 'HeartGuide Monitor'
    WHEN 2 THEN 'Neural Stimulator'
    WHEN 3 THEN 'Vascular Graft'
    WHEN 4 THEN 'Bone Anchor'
    WHEN 5 THEN 'Pacemaker Device'
    WHEN 6 THEN 'Insulin Pump'
    ELSE 'Hearing Implant'
  END as eaei_device_name,
  
  'Model-' || (i % 20 + 1000) as eaei_device_model,
  'SN' || LPAD(i::text, 8, '0') as eaei_device_serial,
  'LOT-2024-' || LPAD((i % 100)::text, 3, '0') as eaei_device_lot,
  
  -- Medication Information
  CASE (i % 8)
    WHEN 0 THEN 'Epinephrine'
    WHEN 1 THEN 'Heparin'
    WHEN 2 THEN 'Cefazolin'
    WHEN 3 THEN 'Protamine'
    WHEN 4 THEN 'Morphine'
    WHEN 5 THEN 'Aspirin'
    WHEN 6 THEN 'Metformin'
    ELSE NULL
  END as eaei_medication_name,
  
  CASE (i % 8)
    WHEN 0 THEN '0.3mg'
    WHEN 1 THEN '5000 units'
    WHEN 2 THEN '1g'
    WHEN 3 THEN '50mg'
    WHEN 4 THEN '2mg'
    WHEN 5 THEN '81mg'
    WHEN 6 THEN '500mg'
    ELSE NULL
  END as eaei_medication_dose,
  
  CASE (i % 8)
    WHEN 0 THEN 'Intramuscular'
    WHEN 1 THEN 'Intravenous'
    WHEN 2 THEN 'Intravenous'
    WHEN 3 THEN 'Intravenous'
    WHEN 4 THEN 'Intravenous'
    WHEN 5 THEN 'Oral'
    WHEN 6 THEN 'Oral'
    ELSE NULL
  END as eaei_medication_route,
  
  CASE (i % 8)
    WHEN 0 THEN 'Single dose'
    WHEN 1 THEN 'Single dose'
    WHEN 2 THEN 'Every 8 hours'
    WHEN 3 THEN 'Single dose'
    WHEN 4 THEN 'Every 4 hours PRN'
    WHEN 5 THEN 'Daily'
    WHEN 6 THEN 'BID'
    ELSE NULL
  END as eaei_medication_frequency,
  
  -- Additional Medical Information
  CASE (i % 6)
    WHEN 0 THEN 'Aspirin 81mg daily'
    WHEN 1 THEN 'Metformin 500mg BID'
    WHEN 2 THEN 'Ibuprofen 600mg PRN'
    WHEN 3 THEN 'Birth control pills'
    WHEN 4 THEN 'Lisinopril 10mg daily'
    ELSE 'None reported'
  END as eaei_concomitant_meds,
  
  CASE (i % 7)
    WHEN 0 THEN 'Hypertension, Diabetes Type 2'
    WHEN 1 THEN 'CAD, Previous MI'
    WHEN 2 THEN 'Chronic back pain'
    WHEN 3 THEN 'No significant history'
    WHEN 4 THEN 'Osteoarthritis'
    WHEN 5 THEN 'COPD, Hypertension'
    ELSE 'Anxiety, Depression'
  END as eaei_medical_history,
  
  CASE (i % 6)
    WHEN 0 THEN 'WBC: 12,000, Glucose: 180mg/dL'
    WHEN 1 THEN 'Troponin: 0.8, Creatinine: 1.2mg/dL'
    WHEN 2 THEN 'WBC: 15,000, CRP: 25mg/L'
    WHEN 3 THEN 'Hemoglobin: 9.5g/dL, Platelets: 150,000'
    WHEN 4 THEN 'Normal CBC, BMP within limits'
    ELSE 'Pending lab results'
  END as eaei_lab_values,
  
  CASE (i % 6)
    WHEN 0 THEN 'Administered epinephrine, IV steroids'
    WHEN 1 THEN 'Device replaced, procedure completed'
    WHEN 2 THEN 'Started antibiotic therapy, wound care'
    WHEN 3 THEN 'Pressure applied, bleeding stopped'
    WHEN 4 THEN 'Patient counseled, follow-up scheduled'
    ELSE 'Medication adjusted, symptoms monitored'
  END as eaei_actions_taken,
  
  CASE WHEN i % 3 = 0 THEN 'Yes' ELSE 'No' END as eaei_followup_required,
  CASE WHEN i % 4 = 0 THEN 'Yes' ELSE 'No' END as eaei_report_to_fda,
  CASE WHEN i % 3 = 0 THEN 'Yes' ELSE 'No' END as eaei_report_to_manufacturer,
  
  -- Status and Assignment
  CASE (i % 4)
    WHEN 0 THEN 'Draft'
    WHEN 1 THEN 'Submitted'
    WHEN 2 THEN 'Under Review'
    ELSE 'Closed'
  END as eaei_status,
  
  'DR' || LPAD(((i % 10) + 1)::text, 3, '0') as eaei_assigned_to,
  
  CASE (i % 4)
    WHEN 0 THEN 'Low'
    WHEN 1 THEN 'Medium'
    WHEN 2 THEN 'High'
    ELSE 'Critical'
  END as eaei_priority,
  
  -- Timestamps
  (NOW() - (i * interval '1 hour'))::timestamp as eaei_creation_date,
  (NOW() - (i * interval '1 hour'))::timestamp as eaei_changed_date

FROM generate_series(1, 100) as i;
