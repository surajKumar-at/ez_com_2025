-- Create foreign key relationship between auth.users and ezc_users on email
-- First, let's add a supabase_user_id column to ezc_users to link with auth.users
ALTER TABLE public.ezc_users 
ADD COLUMN supabase_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique index on email for ezc_users
CREATE UNIQUE INDEX IF NOT EXISTS idx_ezc_users_email ON public.ezc_users(eu_email);

-- Create sequences for user ID and business partner generation
CREATE SEQUENCE IF NOT EXISTS ezc_user_id_seq START WITH 772 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS ezc_business_partner_seq START WITH 38720 INCREMENT BY 1;

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

-- Create or update profiles table to link with ezc_users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  eu_id TEXT REFERENCES public.ezc_users(eu_id),
  eu_type INTEGER,
  eu_business_partner TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Function to handle new user creation and link with ezc_users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  ezc_user_record RECORD;
BEGIN
  -- Find corresponding ezc_user by email
  SELECT * INTO ezc_user_record 
  FROM public.ezc_users 
  WHERE eu_email = NEW.email;
  
  IF FOUND THEN
    -- Update ezc_users with supabase_user_id
    UPDATE public.ezc_users 
    SET supabase_user_id = NEW.id 
    WHERE eu_id = ezc_user_record.eu_id;
    
    -- Insert into profiles table
    INSERT INTO public.profiles (id, eu_id, eu_type, eu_business_partner)
    VALUES (NEW.id, ezc_user_record.eu_id, ezc_user_record.eu_type, ezc_user_record.eu_business_partner);
  ELSE
    -- Create basic profile for new users
    INSERT INTO public.profiles (id, eu_type)
    VALUES (NEW.id, 1); -- Default to admin type
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user permissions for menu display
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id TEXT)
RETURNS TABLE(auth_key TEXT, auth_value TEXT) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT eua_auth_key, eua_auth_value
  FROM public.ezc_user_auth
  WHERE eua_user_id = user_id;
$$;

-- Function to get user sold-to options
CREATE OR REPLACE FUNCTION public.get_user_sold_to_options(user_id TEXT)
RETURNS TABLE(
  customer_no TEXT,
  customer_name TEXT,
  sys_key TEXT
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT 
    ec.ec_no,
    eca.eca_name,
    ec.ec_sys_key
  FROM public.ezc_customer ec
  JOIN public.ezc_customer_addr eca ON ec.ec_no = eca.eca_no
  JOIN public.ezc_wf_workgroup_users ewwu ON ec.ec_no = ewwu.ewwu_sold_to
  WHERE ewwu.ewwu_user = user_id
    AND ec.ec_deletion_flag = 'N'
    AND eca.eca_deletion_flag != 'Y'
    AND eca.eca_lang = 'EN';
$$;

-- Function to get ship-to options for a sold-to
CREATE OR REPLACE FUNCTION public.get_ship_to_options(sold_to TEXT)
RETURNS TABLE(
  customer_no TEXT,
  customer_name TEXT,
  reference_no INTEGER
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    eca_no,
    eca_name,
    eca_reference_no
  FROM public.ezc_customer_addr
  WHERE eca_no = sold_to
    AND eca_deletion_flag != 'Y'
    AND eca_lang = 'EN'
  ORDER BY eca_reference_no;
$$;