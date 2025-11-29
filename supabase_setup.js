
/**
 * SUPABASE SETUP (FINAL FIX)
 * ----------------------------------------------------------------------------
 * 1. Open Supabase Dashboard > SQL Editor.
 * 2. Copy the content inside `SUPABASE_SQL_SCHEMA` below.
 * 3. Run it.
 * ----------------------------------------------------------------------------
 */

export const SUPABASE_SQL_SCHEMA = `
-- 1. RESET (Careful! Deletes data)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;
drop table if exists public.user_progress cascade;
drop table if exists public.resources cascade;
drop table if exists public.modules cascade;
drop table if exists public.topics cascade;
drop table if exists public.profiles cascade;

-- 2. CREATE PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'intern',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PERMISSIONS (Fixes 'Permission Denied' errors)
alter table public.profiles enable row level security;

-- Allow public read access (for debugging/dashboard)
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using ( true );

-- Allow users to insert THEIR OWN profile (Critical for client-side fixes)
create policy "Users can insert their own profile." 
  on public.profiles for insert with check ( auth.uid() = id );

-- Allow users to update THEIR OWN profile
create policy "Users can update own profile." 
  on public.profiles for update using ( auth.uid() = id );

-- 4. ROBUST SERVER-SIDE TRIGGER
-- This runs as 'postgres' (Superuser) to bypass all RLS checks during signup
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
$$ language plpgsql security definer; -- <== IMPORTANT: Runs as superuser

create trigger on_auth_user_created 
  after insert on auth.users 
  for each row execute procedure public.handle_new_user();

-- 5. OTHER TABLES
create table public.topics (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  description text,
  icon text,
  total_modules int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.topics enable row level security;
create policy "Topics Public" on public.topics for select using (true);

create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  topic_slug text references public.topics(slug) on delete cascade,
  day_number int not null,
  title text not null,
  description text,
  time_estimate text,
  outcomes text[], 
  key_concepts text[],
  homework_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(topic_slug, day_number)
);
alter table public.modules enable row level security;
create policy "Modules Public" on public.modules for select using (true);

create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references public.modules(id) on delete set null,
  title text not null,
  type text,
  url text not null,
  duration text,
  difficulty text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.resources enable row level security;
create policy "Resources Public" on public.resources for select using (true);

create table public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  topic_slug text references public.topics(slug) not null,
  completed_days int[] default '{}',
  notes jsonb default '{}'::jsonb,
  last_active timestamp with time zone default now(),
  unique(user_id, topic_slug)
);
alter table public.user_progress enable row level security;
create policy "Users manage own progress" on public.user_progress for all using (auth.uid() = user_id);


-- 6. SEED DATA
insert into public.topics (slug, title, description, icon, total_modules) values 
('n8n', 'n8n Automation', 'Master workflow automation.', 'Workflow', 9),
('vibe-coding', 'Vibe Coding', 'AI-assisted coding.', 'Code', 5),
('prompt-engineering', 'Prompt Engineering', 'LLM prompting mastery.', 'MessageSquare', 4),
('ai-tools', 'AI Tools Suite', 'Modern AI productivity.', 'Cpu', 6)
on conflict (slug) do nothing;
`;
