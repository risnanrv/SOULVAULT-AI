-- 1. Properly structure Beneficiaries columns
ALTER TABLE public.beneficiaries 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'limited',
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

-- 2. Properly structure Assets columns
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS asset_type TEXT DEFAULT 'Other',
ADD COLUMN IF NOT EXISTS encrypted_data TEXT,
ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT false;

-- Data Migration (Optional: If you want to move existing JSON data to the new columns)
-- UPDATE public.beneficiaries 
-- SET phone = (relationship::json)->>'phone',
--     access_level = (relationship::json)->>'access_level',
--     is_primary = ((relationship::json)->>'is_primary')::boolean,
--     relationship = (relationship::json)->>'relation'
-- WHERE relationship LIKE '{%';
