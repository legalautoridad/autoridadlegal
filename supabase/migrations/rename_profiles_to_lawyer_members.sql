-- SQL Script: Rename 'profiles' to 'lawyer_members'
-- Objective: Safely rename the generic profiles table to the specific lawyer_members table.

-- 1. Rename the table if it exists
do $$ 
begin
    if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles') 
    and not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'lawyer_members') then
        alter table public.profiles rename to lawyer_members;
    end if;
end $$;

-- 2. Ensure RLS is enabled on the renamed table
alter table public.lawyer_members enable row level security;

-- 3. Re-apply Policies (Renaming a table doesn't always rename policies cleanly in some PG versions/Supabase environments)
drop policy if exists "Public profiles are viewable by everyone." on public.lawyer_members;
create policy "Public profiles are viewable by everyone."
  on public.lawyer_members for select
  using ( true );

drop policy if exists "Users can insert their own profile." on public.lawyer_members;
create policy "Users can insert their own profile."
  on public.lawyer_members for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on public.lawyer_members;
create policy "Users can update own profile."
  on public.lawyer_members for update
  using ( auth.uid() = id );

-- 4. Update the Trigger Function to use the new table name
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.lawyer_members (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name;
  return new;
end;
$$ language plpgsql security definer;

-- 5. Re-apply Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Verify
select * from information_schema.tables where table_name = 'lawyer_members';
