-- MIGRATION: 20260105_fix_schema.sql
-- OBJECTIVE: Consolidate Schema & Add Missing Business Logic Tables

-- 1. LAWYER AVAILABILITY
-- Critical replacement for lack of calendar system
create table if not exists lawyer_availability (
  id uuid default uuid_generate_v4() primary key,
  lawyer_id uuid references auth.users(id) on delete cascade not null,
  blocked_date date not null,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Prevent duplicate blocks for same day
  unique(lawyer_id, blocked_date)
);

-- RLS for Availability
alter table lawyer_availability enable row level security;

create policy "Lawyers can manage own unavailability" on lawyer_availability
  for all using (auth.uid() = lawyer_id);


-- 2. UPDATE PROFILES
-- Adding necessary fields for "Silos de Autoridad" assignment algorithm
alter table profiles 
  add column if not exists specialties text[] default '{}',
  add column if not exists judicial_districts text[] default '{}',
  add column if not exists is_active boolean default false;

-- 3. CONSOLIDATE LEADS -> CASES
-- 'cases' is the source of truth (created in financial_system migration).
-- We ensure 'cases' has all fields that might have been in 'leads' or needed for business logic.

-- Ensure cases table exists (redundant if financial migration ran, but safe)
create table if not exists cases (
  id uuid default uuid_generate_v4() primary key,
  status text not null default 'NEW', 
  assigned_lawyer_id uuid references auth.users(id),
  honorarios numeric(10, 2) not null default 0,
  reservation_amount numeric(10, 2) default 0,
  close_reason text,
  client_name text,
  client_phone text,
  client_email text,
  client_city text,
  notes text,
  ai_summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: We are ignoring the old 'leads' table as it is obsolete. 
-- Any new development should target 'cases'.

-- 4. CLEANUP & INDICES
-- Add index for quicker assignment queries
create index if not exists idx_profiles_active on profiles(is_active) where is_active = true;
create index if not exists idx_cases_status on cases(status);
