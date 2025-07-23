-- First, let's add a primary key constraint to ezc_users if it doesn't exist
ALTER TABLE public.ezc_users ADD CONSTRAINT ezc_users_pkey PRIMARY KEY (eu_id);

-- Add supabase_user_id column to ezc_users to link with auth.users
ALTER TABLE public.ezc_users 
ADD COLUMN IF NOT EXISTS supabase_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique index on email for ezc_users
CREATE UNIQUE INDEX IF NOT EXISTS idx_ezc_users_email ON public.ezc_users(eu_email);

-- Create sequences for user ID and business partner generation
CREATE SEQUENCE IF NOT EXISTS ezc_user_id_seq START WITH 773 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS ezc_business_partner_seq START WITH 38721 INCREMENT BY 1;

-- Function to generate next user ID
CREATE OR REPLACE FUNCTION generate_next_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'USER' || LPAD(nextval('ezc_user_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate next business partner ID
CREATE OR REPLACE FUNCTION generate_next_business_partner_id()
RETURNS TEXT AS $$
BEGIN
  RETURN nextval('ezc_business_partner_seq')::TEXT;
END;
$$ LANGUAGE plpgsql;