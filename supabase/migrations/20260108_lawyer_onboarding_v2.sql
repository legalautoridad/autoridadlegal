-- MIGRATION: 20260108_lawyer_onboarding_v2.sql
-- OBJECTIVE: Ensure Tables exist and have correct columns for V2 Flow (Idempotent)

-- 1. Ensure lawyer_profiles table
create table if not exists lawyer_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns safely if they don't exist
do $$ 
begin
    -- Document Type
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'document_type') then
        alter table lawyer_profiles add column document_type text check (document_type in ('DNI', 'NIF'));
    end if;

    -- Document Number
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'document_number') then
        alter table lawyer_profiles add column document_number text;
    end if;

    -- Bar Association
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'bar_association') then
        alter table lawyer_profiles add column bar_association text;
    end if;

    -- Bar Number
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'bar_number') then
        alter table lawyer_profiles add column bar_number text;
    end if;

    -- Office Address
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'office_address') then
        alter table lawyer_profiles add column office_address text;
    end if;

    -- Notification Email
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'notification_email') then
        alter table lawyer_profiles add column notification_email text;
    end if;

    -- Notification Phone
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'notification_phone') then
        alter table lawyer_profiles add column notification_phone text;
    end if;

    -- Website URL
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'website_url') then
        alter table lawyer_profiles add column website_url text;
    end if;

    -- Verification Status
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'is_verified') then
        alter table lawyer_profiles add column is_verified boolean default false;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_profiles' and column_name = 'verification_status') then
        alter table lawyer_profiles add column verification_status text default 'PENDING' check (verification_status in ('PENDING', 'VERIFIED', 'REJECTED'));
    end if;
end $$;


-- 2. Ensure lawyer_subscriptions table
create table if not exists lawyer_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  lawyer_id uuid references lawyer_profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

do $$ 
begin
    -- Active Zones
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_subscriptions' and column_name = 'active_zones') then
        alter table lawyer_subscriptions add column active_zones text[] default '{}'::text[];
    end if;

    -- Active Matters
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_subscriptions' and column_name = 'active_matters') then
        alter table lawyer_subscriptions add column active_matters text[] default '{}'::text[];
    end if;

    -- Monthly Fee
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_subscriptions' and column_name = 'monthly_fee') then
        alter table lawyer_subscriptions add column monthly_fee numeric(10, 2);
    end if;

    -- Stripe Subscription ID
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_subscriptions' and column_name = 'stripe_subscription_id') then
        alter table lawyer_subscriptions add column stripe_subscription_id text;
    end if;

    -- Status
    if not exists (select 1 from information_schema.columns where table_name = 'lawyer_subscriptions' and column_name = 'status') then
        alter table lawyer_subscriptions add column status text default 'ACTIVE' check (status in ('ACTIVE', 'PAST_DUE', 'CANCELED'));
    end if;
end $$;

-- 3. RLS Check (Ensure Enabled)
alter table lawyer_profiles enable row level security;
alter table lawyer_subscriptions enable row level security;

-- Policies (Re-apply safely dropping first is good practice if script is re-runnable, handled in previous migration but ensuring here merely exists is safest via strict checks, but for now assuming previous migration ran partially or fully)
-- We won't re-create policies here to avoid noise, assuming V1 migration handled it or user can run V1. 
-- This V2 is mainly for column consistency.
