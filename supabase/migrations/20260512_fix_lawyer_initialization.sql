-- MIGRATION: 20260512_fix_lawyer_initialization.sql
-- OBJECTIVE: Ensure all lawyers have a wallet, stats and profile record, and add trigger for automatic creation.

-- 1. Function to initialize lawyer data
create or replace function public.initialize_lawyer_data()
returns trigger as $$
begin
  -- 1. Create Wallet if not exists
  insert into public.lawyer_wallets (lawyer_id, balance)
  values (new.id, 0)
  on conflict (lawyer_id) do nothing;

  -- 2. Create Stats if not exists
  insert into public.lawyer_stats (lawyer_id)
  values (new.id)
  on conflict (lawyer_id) do nothing;

  -- 3. Create Profile if not exists (minimal)
  insert into public.lawyer_profiles (
    id, 
    notification_email, 
    document_number, 
    bar_association, 
    bar_number, 
    office_address, 
    notification_phone
  )
  values (
    new.id, 
    new.email, 
    '', 
    '', 
    '', 
    '', 
    ''
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- 2. Attach trigger to auth.users (after insert)
drop trigger if exists on_auth_user_created_init_lawyer on auth.users;
create trigger on_auth_user_created_init_lawyer
  after insert on auth.users
  for each row execute procedure public.initialize_lawyer_data();

-- 3. Backfill existing lawyers
-- We target users who are in lawyer_members
do $$
declare
  r record;
begin
  for r in select id, email from public.lawyer_members loop
    -- Initialize wallet
    insert into public.lawyer_wallets (lawyer_id, balance)
    values (r.id, 0)
    on conflict (lawyer_id) do nothing;

    -- Initialize stats
    insert into public.lawyer_stats (lawyer_id)
    values (r.id)
    on conflict (lawyer_id) do nothing;

    -- Initialize profile
    insert into public.lawyer_profiles (
      id, 
      notification_email, 
      document_number, 
      bar_association, 
      bar_number, 
      office_address, 
      notification_phone
    )
    values (
      r.id, 
      r.email, 
      '', 
      '', 
      '', 
      '', 
      ''
    )
    on conflict (id) do nothing;
  end loop;
end $$;
