
-- Insert sample adverse event data with correct column names
INSERT INTO ezc_adverse_event_info (
  eaei_patient_fname,
  eaei_patient_lname,
  eaei_patient_mname,
  eaei_patient_dob,
  eaei_patient_age,
  eaei_patient_gender,
  eaei_patient_weight,
  eaei_patient_height,
  eaei_patient_medical_record_no,
  eaei_event_description,
  eaei_event_date,
  eaei_event_time,
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
  eaei_created_on,
  eaei_modified_on
) VALUES
-- Sample record 1
('John', 'Smith', 'Michael', '1985-05-15', 38, 'Male', 75.5, 180.2, 'MR001234', 
'Patient experienced allergic reaction after device placement', '2024-01-15', '14:30:00', 
'Operating Room 3', 'Moderate', 'Recovered with treatment', 'Dr. Sarah Johnson', 'Surgeon', 
'sarah.johnson@hospital.com', 'CardioStent Pro', 'CS-2000X', 'CS240115001', 'LOT-2024-A1', 
'Epinephrine', '0.3mg', 'Intramuscular', 'Single dose', 'Aspirin 81mg daily', 
'Hypertension, Diabetes Type 2', 'WBC: 12,000, Glucose: 180mg/dL', 'Administered epinephrine, IV steroids', 
'Yes', 'Yes', 'Yes', 'Submitted', 'DR001', 'High', 
'2024-01-15 15:00:00'::timestamp, '2024-01-15 15:00:00'::timestamp),

-- Sample record 2
('Maria', 'Garcia', 'Elena', '1972-11-22', 51, 'Female', 68.0, 165.5, 'MR002345', 
'Device malfunction during procedure', '2024-01-20', '09:15:00', 'Cardiac Cath Lab', 
'Severe', 'Procedure completed with alternate device', 'Dr. Robert Chen', 'Cardiologist', 
'robert.chen@hospital.com', 'HeartGuide Monitor', 'HG-3500', 'HG240120002', 'LOT-2024-B2', 
'Heparin', '5000 units', 'Intravenous', 'Single dose', 'Metformin 500mg BID', 
'CAD, Previous MI', 'Troponin: 0.8, Creatinine: 1.2mg/dL', 'Device replaced, procedure completed', 
'Yes', 'Yes', 'Yes', 'Under Review', 'DR002', 'Critical', 
'2024-01-20 10:00:00'::timestamp, '2024-01-20 10:00:00'::timestamp),

-- Sample record 3
('David', 'Wilson', 'James', '1990-03-08', 34, 'Male', 82.1, 178.0, 'MR003456', 
'Post-operative infection at implant site', '2024-01-25', '16:45:00', 'Recovery Room', 
'Mild', 'Treated with antibiotics', 'Nurse Jennifer Brown', 'RN', 
'jennifer.brown@hospital.com', 'Neural Stimulator', 'NS-1200', 'NS240125003', 'LOT-2024-C3', 
'Cefazolin', '1g', 'Intravenous', 'Every 8 hours', 'Ibuprofen 600mg PRN', 
'Chronic back pain', 'WBC: 15,000, CRP: 25mg/L', 'Started antibiotic therapy, wound care', 
'Yes', 'No', 'Yes', 'Draft', 'DR003', 'Medium', 
'2024-01-25 17:30:00'::timestamp, '2024-01-25 17:30:00'::timestamp),

-- Sample record 4
('Lisa', 'Anderson', 'Marie', '1988-07-14', 35, 'Female', 59.5, 162.8, 'MR004567', 
'Unexpected bleeding during device insertion', '2024-02-01', '11:20:00', 'OR Suite 2', 
'Moderate', 'Bleeding controlled, patient stable', 'Dr. Michael Torres', 'Interventionist', 
'michael.torres@hospital.com', 'Vascular Graft', 'VG-4500', 'VG240201004', 'LOT-2024-D4', 
'Protamine', '50mg', 'Intravenous', 'Single dose', 'Birth control pills', 
'No significant history', 'Hemoglobin: 9.5g/dL, Platelets: 150,000', 'Pressure applied, bleeding stopped', 
'Yes', 'No', 'No', 'Closed', 'DR004', 'Medium', 
'2024-02-01 12:00:00'::timestamp, '2024-02-01 12:00:00'::timestamp),

-- Sample record 5
('Robert', 'Taylor', 'William', '1975-12-30', 48, 'Male', 88.7, 185.4, 'MR005678', 
'Device displacement noted on follow-up imaging', '2024-02-05', '08:30:00', 'Radiology', 
'Mild', 'Patient scheduled for repositioning', 'Dr. Amanda White', 'Radiologist', 
'amanda.white@hospital.com', 'Bone Anchor', 'BA-7800', 'BA240205005', 'LOT-2024-E5', 
NULL, NULL, NULL, NULL, 'Acetaminophen 650mg PRN', 
'Osteoarthritis', 'Normal CBC, BMP within limits', 'Patient counseled, follow-up scheduled', 
'Yes', 'No', 'Yes', 'Submitted', 'DR005', 'Low', 
'2024-02-05 09:15:00'::timestamp, '2024-02-05 09:15:00'::timestamp);

-- Add additional sample records using a more efficient approach
INSERT INTO ezc_adverse_event_info (
  eaei_patient_fname, eaei_patient_lname, eaei_patient_mname, eaei_patient_dob, 
  eaei_patient_age, eaei_patient_gender, eaei_patient_weight, eaei_patient_height,
  eaei_patient_medical_record_no, eaei_event_description, eaei_event_date, eaei_event_time,
  eaei_event_location, eaei_event_severity, eaei_event_outcome, eaei_reporter_name,
  eaei_reporter_title, eaei_reporter_contact, eaei_device_name, eaei_device_model,
  eaei_device_serial, eaei_device_lot, eaei_status, eaei_priority, eaei_created_on, eaei_modified_on
) 
SELECT 
  'Patient' || generate_series,
  'LastName' || generate_series,
  CASE WHEN generate_series % 3 = 0 THEN 'Middle' || generate_series ELSE NULL END,
  ('1950-01-01'::date + (generate_series * interval '100 days'))::text,
  25 + (generate_series % 50),
  CASE WHEN generate_series % 2 = 0 THEN 'Male' ELSE 'Female' END,
  50.0 + (generate_series % 50),
  150.0 + (generate_series % 40),
  'MR' || LPAD(generate_series::text, 6, '0'),
  'Event description for case ' || generate_series,
  ('2024-01-01'::date + (generate_series * interval '1 day'))::text,
  LPAD((8 + generate_series % 10)::text, 2, '0') || ':' || LPAD((generate_series % 60)::text, 2, '0') || ':00',
  CASE generate_series % 4 
    WHEN 0 THEN 'Operating Room'
    WHEN 1 THEN 'ICU'
    WHEN 2 THEN 'Emergency Department'
    ELSE 'Patient Room'
  END,
  CASE generate_series % 4
    WHEN 0 THEN 'Mild'
    WHEN 1 THEN 'Moderate'
    WHEN 2 THEN 'Severe'
    ELSE 'Life-threatening'
  END,
  'Patient recovered',
  'Dr. Reporter' || generate_series,
  'Physician',
  'reporter' || generate_series || '@hospital.com',
  'Device' || generate_series,
  'Model-' || generate_series,
  'SN' || generate_series,
  'LOT-2024-' || generate_series,
  CASE generate_series % 4
    WHEN 0 THEN 'Draft'
    WHEN 1 THEN 'Submitted'
    WHEN 2 THEN 'Under Review'
    ELSE 'Closed'
  END,
  CASE generate_series % 4
    WHEN 0 THEN 'Low'
    WHEN 1 THEN 'Medium'
    WHEN 2 THEN 'High'
    ELSE 'Critical'
  END,
  NOW() - (generate_series * interval '1 hour'),
  NOW() - (generate_series * interval '1 hour')
FROM generate_series(6, 100);
