-- Create Pricing Experiments Table (Supabase/Postgres)
-- Tracks AI negotiation performance and price elasticity

create table if not exists pricing_experiments (
  id uuid default gen_random_uuid() primary key,
  vertical text not null, -- 'alcoholemia', 'accidentes', 'herencias'
  location_tier text not null check (location_tier in ('high', 'mid', 'low')),
  offered_price numeric not null,
  user_response text not null check (user_response in ('accepted', 'rejected', 'negotiated_down')),
  chat_id text, -- Link to specific chat session if available
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table pricing_experiments enable row level security;

-- Policy: Allow anonymous inserts (for now, or restrict to service_role)
create policy "Enable insert for authenticated users only" 
on pricing_experiments for insert 
with check (true); -- Simplified for MVP, ideally restricted
