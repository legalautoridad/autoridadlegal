-- Migration: 20260211_create_users_and_members.sql
-- Objective: Create 'users' for Admins and 'lawyer_members' for Lawyer Portal.

-- 1. Cleanup old table attempt if it exists
drop table if exists public.web_admins;

-- 2. Create User Role Type
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'app_user_role') then
        create type app_user_role as enum ('ADMIN', 'SUPERADMIN');
    end if;
end $$;

-- 3. Create Users table (For WebAdmin)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  role app_user_role default 'ADMIN' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Lawyer Members table (For Members Area)
create table if not exists public.lawyer_members (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable RLS
alter table public.users enable row level security;
alter table public.lawyer_members enable row level security;

-- 6. Policies for Users (Admins)
create policy "Admins can view their own profile."
  on users for select
  using ( auth.uid() = id );

-- 7. Policies for Lawyer Members
create policy "Members can view their own profile."
  on lawyer_members for select
  using ( auth.uid() = id );

create policy "Members can update their own profile."
  on lawyer_members for update
  using ( auth.uid() = id );

-- 8. Trigger for automatic Member creation on Register
create or replace function public.handle_new_member()
returns trigger as $$
begin
  insert into public.lawyer_members (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Re-apply trigger safely
drop trigger if exists on_auth_user_created_member on auth.users;
create trigger on_auth_user_created_member
  after insert on auth.users
  for each row execute procedure public.handle_new_member();

-- 9. Promotion to Admin (Manual)
-- To make someone an admin, they must be added to the users table:
-- INSERT INTO users (id, email, full_name, role) 
-- SELECT id, email, raw_user_meta_data->>'full_name', 'ADMIN' FROM auth.users WHERE email = 'admin@example.com';
