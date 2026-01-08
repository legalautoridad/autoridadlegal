-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- CASES (Needed for referencing in transactions)
create table if not exists cases (
  id uuid default uuid_generate_v4() primary key,
  status text not null default 'NEW', -- NEW, ASSIGNED, UNREACHABLE, CANCELLED_BY_CLIENT, CLOSED
  assigned_lawyer_id uuid references auth.users(id),
  honorarios numeric(10, 2) not null default 0,
  reservation_amount numeric(10, 2) default 0,
  close_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LAWYER WALLETS
create table if not exists lawyer_wallets (
  lawyer_id uuid references auth.users(id) on delete cascade not null primary key,
  balance numeric(10, 2) not null default 0 check (balance >= 0),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WALLET TRANSACTIONS
create table if not exists wallet_transactions (
  id uuid default uuid_generate_v4() primary key,
  lawyer_id uuid references lawyer_wallets(lawyer_id) on delete cascade not null,
  amount numeric(10, 2) not null, -- Negative for deductions, Positive for deposits/refunds
  case_id uuid references cases(id), -- Nullable
  type text not null check (type in ('DEPOSIT', 'CASE_FEE', 'REFUND_UNREACHABLE', 'REFUND_CANCELLED')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LAWYER STATS
create table if not exists lawyer_stats (
  lawyer_id uuid references auth.users(id) on delete cascade not null primary key,
  cases_assigned int default 0,
  cases_cancelled int default 0,
  suspicion_score float default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table cases enable row level security;
alter table lawyer_wallets enable row level security;
alter table wallet_transactions enable row level security;
alter table lawyer_stats enable row level security;

-- Policies (Simplified for MVP/Admin context)
-- Lawyers can view their own wallet
create policy "Lawyers can view own wallet" on lawyer_wallets
  for select using (auth.uid() = lawyer_id);

-- Lawyers can view their own transactions
create policy "Lawyers can view own transactions" on wallet_transactions
  for select using (auth.uid() = lawyer_id);

-- Lawyers can view their own stats
create policy "Lawyers can view own stats" on lawyer_stats
  for select using (auth.uid() = lawyer_id);
