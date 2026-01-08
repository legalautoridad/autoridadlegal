-- Create Leads Schema
-- Tracks real customer leads with reservation data

create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  vertical text not null,
  city text not null,
  
  -- Customer Data (Collected at Checkout)
  customer_name text,
  customer_email text,
  customer_phone text,

  -- Financials
  agreed_price numeric not null default 0,
  amount_paid numeric not null default 0,
  status text default 'new' check (status in ('new', 'reserved', 'claimed', 'resolved', 'expired')),
  
  -- Platform Data
  unlock_price numeric default 150,
  is_test_data boolean default false,
  
  exclusive_winner_id uuid references lawyers(id),
  created_at timestamp with time zone default now()
);

-- RLS
alter table leads enable row level security;

-- Policy: Lawyers can read leads (add specific rules later)
create policy "Lawyers can view new leads" on leads
  for select using (auth.role() = 'authenticated');
