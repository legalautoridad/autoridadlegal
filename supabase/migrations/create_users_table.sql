-- 1. Create User Role Type (if not exists)
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'app_user_role') then
        create type app_user_role as enum ('ADMIN', 'SUPERADMIN');
    end if;
end $$;

-- 2. Delete old table if it exists
drop table if exists public.web_admins;

-- 3. Create Users table for Administrators
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  role app_user_role default 'ADMIN' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS
alter table public.users enable row level security;

-- 5. Policies
create policy "Admins can view their own profile."
  on users for select
  using ( auth.uid() = id );
