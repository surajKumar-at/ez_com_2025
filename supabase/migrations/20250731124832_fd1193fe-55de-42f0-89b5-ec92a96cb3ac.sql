-- Insert default catalog data into EZC_CATALOG_GROUP table
-- First, let's check if these records already exist before inserting
DO $$
BEGIN
    -- Insert first record if it doesn't exist
    INSERT INTO ezc_catalog_group (ecg_catalog_no, ecg_sys_key, ecg_product_group, ecg_index_indicator)
    SELECT '14960', '999001', 'US', 'Y'
    WHERE NOT EXISTS (
        SELECT 1 FROM ezc_catalog_group 
        WHERE ecg_catalog_no = '14960' AND ecg_sys_key = '999001'
    );
    
    -- Insert second record if it doesn't exist
    INSERT INTO ezc_catalog_group (ecg_catalog_no, ecg_sys_key, ecg_product_group, ecg_index_indicator)
    SELECT '19610', '999002', 'CA', 'Y'
    WHERE NOT EXISTS (
        SELECT 1 FROM ezc_catalog_group 
        WHERE ecg_catalog_no = '19610' AND ecg_sys_key = '999002'
    );
END $$;

-- Create business partner creation table if not exists
CREATE TABLE IF NOT EXISTS ezc_business_partner_creation (
  ebpc_id SERIAL PRIMARY KEY,
  ebpc_company_name VARCHAR(255) NOT NULL,
  ebpc_description TEXT,
  ebpc_catalog_no VARCHAR(50),
  ebpc_unlimited_users BOOLEAN DEFAULT FALSE,
  ebpc_number_of_users INTEGER,
  ebpc_intranet_business_partner BOOLEAN DEFAULT FALSE,
  ebpc_is_serves_partner BOOLEAN,
  ebpc_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ebpc_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ebpc_created_by VARCHAR(255),
  ebpc_status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Create trigger for updating timestamp
CREATE OR REPLACE FUNCTION update_ebpc_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ebpc_updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_ebpc_updated_at ON ezc_business_partner_creation;
CREATE TRIGGER trigger_update_ebpc_updated_at
    BEFORE UPDATE ON ezc_business_partner_creation
    FOR EACH ROW
    EXECUTE FUNCTION update_ebpc_updated_at();