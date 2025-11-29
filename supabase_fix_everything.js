
/**
 * SUPABASE FIX EVERYTHING SCRIPT
 * ----------------------------------------------------------------------------
 * 1. Open Supabase Dashboard > SQL Editor.
 * 2. Copy the content inside `FIX_SQL` below.
 * 3. Run it.
 * ----------------------------------------------------------------------------
 */

export const FIX_SQL = `
-- 1. FORCE CONFIRM EMAIL (Allows you to log in immediately)
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email_confirmed_at IS NULL;

-- 2. FORCE CREATE MISSING PROFILES (Fixes the "Not in DB" issue)
INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 
  'intern',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- 3. CHECK RESULTS
SELECT email, full_name, 'Fixed & Ready' as status FROM public.profiles;
`;
