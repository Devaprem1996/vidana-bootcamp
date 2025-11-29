
/**
 * MODULE PERMISSIONS FIX
 * ----------------------------------------------------------------------------
 * 1. Open Supabase Dashboard > SQL Editor.
 * 2. Copy the content inside `MODULE_POLICIES_SQL` below.
 * 3. Run it.
 * ----------------------------------------------------------------------------
 */

export const MODULE_POLICIES_SQL = `
-- 1. Enable RLS (Ensure it is on)
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Modules Public" ON public.modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
DROP POLICY IF EXISTS "Public Read Access" ON public.modules;
DROP POLICY IF EXISTS "Admins can insert modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can update modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can delete modules" ON public.modules;

-- 3. Create READ policy (Everyone can view modules)
CREATE POLICY "Public Read Access"
ON public.modules FOR SELECT
USING (true);

-- 4. Create WRITE policies (Admin only)
-- We check if the current user has the 'admin' role in the profiles table.

CREATE POLICY "Admins can insert modules"
ON public.modules FOR INSERT
WITH CHECK (
  exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

CREATE POLICY "Admins can update modules"
ON public.modules FOR UPDATE
USING (
  exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

CREATE POLICY "Admins can delete modules"
ON public.modules FOR DELETE
USING (
  exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  )
);
`;
