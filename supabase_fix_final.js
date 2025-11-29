
/**
 * FINAL FIX FOR PERMISSIONS
 * ----------------------------------------------------------------------------
 * 1. Open Supabase Dashboard > SQL Editor.
 * 2. Copy the content inside `FINAL_FIX_SQL` below.
 * 3. Run it.
 * ----------------------------------------------------------------------------
 */

export const FINAL_FIX_SQL = `
-- 1. DISABLE RLS TEMPORARILY (To confirm it is a permission issue)
ALTER TABLE public.modules DISABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING COMPLEX POLICIES
DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can insert modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can update modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can delete modules" ON public.modules;
DROP POLICY IF EXISTS "Public Read Access" ON public.modules;

-- 3. RE-ENABLE RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- 4. CREATE A "SUPER PERMISSIVE" POLICY FOR LOGGED IN USERS
-- This removes the complex check against the 'profiles' table which might be failing.
-- CAUTION: This allows ANY logged-in user to edit/delete modules.
-- Use this to verify functionality, then we can tighten it later.

CREATE POLICY "Authenticated users can manage modules"
ON public.modules
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. READ ONLY FOR ANONYMOUS (Public)
CREATE POLICY "Public can view modules"
ON public.modules
FOR SELECT
TO anon
USING (true);
`;
