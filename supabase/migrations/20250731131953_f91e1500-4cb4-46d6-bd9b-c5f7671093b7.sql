-- Insert initial catalog data into EZC_CATALOG_GROUP table
INSERT INTO public.ezc_catalog_group (ecg_catalog_no, ecg_sys_key, ecg_product_group, ecg_index_indicator)
SELECT '14960', '999001', 'US', 'Y'
WHERE NOT EXISTS (
  SELECT 1 FROM public.ezc_catalog_group 
  WHERE ecg_catalog_no = '14960' AND ecg_sys_key = '999001'
);

INSERT INTO public.ezc_catalog_group (ecg_catalog_no, ecg_sys_key, ecg_product_group, ecg_index_indicator)
SELECT '19610', '999002', 'CA', 'Y'
WHERE NOT EXISTS (
  SELECT 1 FROM public.ezc_catalog_group 
  WHERE ecg_catalog_no = '19610' AND ecg_sys_key = '999002'
);