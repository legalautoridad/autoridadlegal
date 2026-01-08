-- Create Lawyer Billing Schema
-- Adds tracking for Platform Fees pending to be billed to the lawyer

-- Assume 'lawyers' table exists (if not, creating a stub for MVP)
create table if not exists lawyers (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null UNIQUE,
  phone text,
  bar_number text,
  city text,
  status text default 'active'
);

-- Add Billing Columns
alter table lawyers 
add column if not exists pending_fees numeric default 0,
add column if not exists billing_cycle text default 'monthly' check (billing_cycle in ('monthly', 'weekly')),
add column if not exists vat_status text default 'business' check (vat_status in ('business', 'exempt'));

-- RLS
alter table lawyers enable row level security;
