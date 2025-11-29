
/**
 * ADMIN DELETE PERMISSIONS FIX
 * ----------------------------------------------------------------------------
 * 1. Open Supabase Dashboard > SQL Editor.
 * 2. Copy the content inside `ADMIN_DELETE_SQL` below.
 * 3. Run it.
 * ----------------------------------------------------------------------------
 */

export const ADMIN_DELETE_SQL = `
-- 1. DROP OLD DELETE POLICIES
drop policy if exists "Admins can delete modules" on public.modules;
drop policy if exists "Admins can insert modules" on public.modules;
drop policy if exists "Admins can update modules" on public.modules;

-- 2. CREATE NEW ROBUST POLICIES
-- Ensure the current user has the 'admin' role in the profiles table

CREATE POLICY "Admins can delete modules"
ON public.modules FOR DELETE
USING (
  exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

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
`;
