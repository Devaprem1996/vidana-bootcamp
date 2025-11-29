
/**
 * SUPABASE REPAIR SCRIPT
 * ----------------------------------------------------------------------------
 * 1. Open Supabase Dashboard > SQL Editor.
 * 2. Copy the content inside `REPAIR_SQL` below.
 * 3. Run it.
 * ----------------------------------------------------------------------------
 * 
 * WHAT THIS DOES:
 * - Finds any users who signed up but don't have a profile.
 * - Creates their profile automatically.
 * - Re-enforces the trigger so future signups work.
 */

export const REPAIR_SQL = `
-- 1. BACKFILL MISSING PROFILES (The Fix)
insert into public.profiles (id, email, full_name, role, avatar_url)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  'intern',
  raw_user_meta_data->>'avatar_url'
from auth.users
where id not in (select id from public.profiles);

-- 2. VERIFY TRIGGER EXISTS (Re-run just in case)
create or replace function public.handle_new_user() returns trigger as $$
declare
  username text;
  safe_email text;
begin
  safe_email := coalesce(new.email, 'unknown@example.com');
  username := coalesce(new.raw_user_meta_data->>'full_name', split_part(safe_email, '@', 1));
  
  insert into public.profiles (id, email, full_name, role, avatar_url)
  values (
    new.id, 
    safe_email, 
    username,
    'intern',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name;
    
  return new;
end;
$$ language plpgsql security definer;

-- Drop and Re-create trigger to be 100% sure
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created 
  after insert on auth.users 
  for each row execute procedure public.handle_new_user();

-- 3. CONFIRMATION
select count(*) as profiles_fixed from public.profiles;
`;
