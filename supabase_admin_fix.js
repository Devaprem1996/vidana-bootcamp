
/**
 * ADMIN PERMISSIONS FIX
 * ----------------------------------------------------------------------------
 * 1. Open Supabase Dashboard > SQL Editor.
 * 2. Copy the content inside `ADMIN_FIX_SQL` below.
 * 3. Run it.
 * ----------------------------------------------------------------------------
 */

export const ADMIN_FIX_SQL = `
-- 1. DROP EXISTING RESTRICTIVE POLICY
drop policy if exists "Users manage own progress" on public.user_progress;

-- 2. CREATE NEW POLICY: Users see their own, but Admins see ALL.
-- Note: This assumes your 'profiles' table is publicly readable (which we set up earlier).
create policy "Users see own, Admins see all" 
on public.user_progress 
for all 
using (
  auth.uid() = user_id 
  OR 
  exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and role = 'admin'
  )
);

-- 3. ENSURE PROFILES ARE READABLE BY ADMINS TOO
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." 
on public.profiles for select using ( true );

-- 4. VERIFY ADMIN ROLE (Optional: Make yourself admin if not already)
-- Replace 'your-email@example.com' with your actual email to force-promote yourself
-- update public.profiles set role = 'admin' where email = 'your-email@example.com';
`;
