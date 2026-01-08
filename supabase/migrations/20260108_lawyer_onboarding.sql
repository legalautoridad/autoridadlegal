-- MIGRATION: 20260108_lawyer_onboarding.sql
-- OBJECTIVE: Create Lawyer Identity and Subscription Tables (Idempotent)

-- 1. LAWYER PROFILES
-- Central identity table for lawyers, linked 1:1 to auth.users
create table if not exists lawyer_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  document_type text check (document_type in ('DNI', 'NIF')),
  document_number text not null,
  bar_association text not null, -- Colegio de Abogados
  bar_number text not null, -- Nª Colegiado
  office_address text not null,
  notification_email text not null,
  notification_phone text not null,
  website_url text, -- Optional
  is_verified boolean default false not null,
  verification_status text default 'PENDING' check (verification_status in ('PENDING', 'VERIFIED', 'REJECTED')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Lawyer Profiles
alter table lawyer_profiles enable row level security;

-- SAFE POLICY CREATION (Drop first to avoid conflicts)
drop policy if exists "Lawyers can view own profile" on lawyer_profiles;
create policy "Lawyers can view own profile" on lawyer_profiles
  for select using (auth.uid() = id);

drop policy if exists "Lawyers can update own profile" on lawyer_profiles;
create policy "Lawyers can update own profile" on lawyer_profiles
  for update using (auth.uid() = id);

drop policy if exists "Lawyers can insert own profile" on lawyer_profiles;
create policy "Lawyers can insert own profile" on lawyer_profiles
  for insert with check (auth.uid() = id);


-- 2. LAWYER SUBSCRIPTIONS
-- Connects lawyers to their contracted zones and matters
create table if not exists lawyer_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  lawyer_id uuid references lawyer_profiles(id) on delete cascade not null,
  active_zones text[] default '{}'::text[], -- e.g. ['BCN', 'MARESME']
  active_matters text[] default '{}'::text[], -- e.g. ['ALCOHOLEMIA']
  monthly_fee numeric(10, 2) not null,
  stripe_subscription_id text,
  status text default 'ACTIVE' check (status in ('ACTIVE', 'PAST_DUE', 'CANCELED')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Subscriptions
alter table lawyer_subscriptions enable row level security;

drop policy if exists "Lawyers can view own subscriptions" on lawyer_subscriptions;
create policy "Lawyers can view own subscriptions" on lawyer_subscriptions
  for select using (auth.uid() = lawyer_id);


-- 3. UPDATED_AT TRIGGER
-- Automatically update updated_at timestamp for profiles
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

drop trigger if exists update_lawyer_profiles_updated_at on lawyer_profiles;
create trigger update_lawyer_profiles_updated_at
before update on lawyer_profiles
for each row
execute procedure update_updated_at_column();
