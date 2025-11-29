
/**
 * CRITICAL FIX FOR DELETE PERMISSIONS
 * ----------------------------------------------------------------------------
 * 1. Open Supabase Dashboard > SQL Editor.
 * 2. Copy the content inside `FIX_DELETE_SQL` below.
 * 3. Run it.
 * ----------------------------------------------------------------------------
 */

export const FIX_DELETE_SQL = `
-- 1. EMERGENCY PROMOTION (Optional but recommended for dev)
-- This ensures YOU are an admin so you can actually delete things.
UPDATE public.profiles
SET role = 'admin';

-- 2. RESET POLICIES FOR MODULES
-- We drop everything to ensure a clean slate.
DROP POLICY IF EXISTS "Public Read Access" ON public.modules;
DROP POLICY IF EXISTS "Admins can insert modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can update modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can delete modules" ON public.modules;
DROP POLICY IF EXISTS "Modules Public" ON public.modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;

-- 3. ENABLE RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- 4. CREATE SIMPLE, POWERFUL POLICIES

-- READ: Everyone can see modules
CREATE POLICY "Public Read Access"
ON public.modules FOR SELECT
USING (true);

-- WRITE (INSERT, UPDATE, DELETE): Only Admins
CREATE POLICY "Admins can manage modules"
ON public.modules
FOR ALL
USING (
  exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

-- 5. VERIFY
select * from public.profiles where role = 'admin';
`;
