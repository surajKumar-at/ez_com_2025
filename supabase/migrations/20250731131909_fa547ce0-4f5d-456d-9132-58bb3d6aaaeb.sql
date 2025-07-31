-- Insert initial catalog data into EZC_CATALOG_GROUP table
INSERT INTO public.ezc_catalog_group (ecg_catalog_no, ecg_sys_key, ecg_product_group, ecg_index_indicator)
VALUES 
  ('14960', '999001', 'US', 'Y'),
  ('19610', '999002', 'CA', 'Y')
ON CONFLICT (ecg_catalog_no, ecg_sys_key) DO NOTHING;