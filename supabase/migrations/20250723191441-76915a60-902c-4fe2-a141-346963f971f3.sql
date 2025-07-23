
-- Get the actual column structure of ezc_adverse_event_info table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'ezc_adverse_event_info' 
ORDER BY ordinal_position;
