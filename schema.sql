-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Lawyers)
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  reputation_score integer default 0,
  credit_balance decimal(10, 2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEADS (Vertical specific)
create table if not exists leads (
  id uuid default uuid_generate_v4() primary key,
  vertical text not null, -- e.g., 'alcoholemia', 'herencias'
  status text default 'new' check (status in ('new', 'claimed', 'reserved', 'expired')),
  quality_score integer, -- AI determined score 0-100
  ai_summary text,
  unlock_price decimal(10, 2) not null,
  customer_name text,
  customer_phone text,
  customer_email text,
  agreed_price decimal(10,2),
  amount_paid decimal(10,2) default 0,
  city text,
  is_test_data boolean default false,
  client_data jsonb, -- Encrypted or restricted data
  exclusive_winner_id uuid references profiles(id), -- Single owner
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRANSACTIONS (Wallet history)
create table if not exists transactions (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references profiles(id) not null,
  amount decimal(10, 2) not null,
  description text,
  type text check (type in ('deposit', 'withdrawal', 'lead_purchase')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table profiles enable row level security;
alter table leads enable row level security;
alter table transactions enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile" on profiles 
  for select using (auth.uid() = id);

-- LEADS POLICIES
-- 1. Anonymous Insert (Chat Widget) - CRITICAL FOR LEAD CAPTURE
create policy "Enable insert for everyone" on leads 
  for insert with check (true);

-- 2. View/Update for Anonymous (User seeing their own lead in session? - Not implemented yet, skipping)

-- 3. View for Authenticated Lawyers (Marketplace)
-- Lawyers can see leads that are 'new' (available) or 'reserved' (if they bought it, handled by exclusive_winner check)
create policy "Lawyers can view available leads" on leads 
  for select using (
    auth.role() = 'authenticated' AND (
      exclusive_winner_id is null OR exclusive_winner_id = auth.uid()
    )
  );

-- 4. Update for Lawyers (Claiming a lead)
create policy "Lawyers can update owned leads" on leads 
  for update using (
    auth.uid() = exclusive_winner_id
  );

-- TRANSACTIONS POLICIES
create policy "Users can view own transactions" on transactions 
  for select using (auth.uid() = profile_id);
