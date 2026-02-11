-- Create locations table
create table if not exists locations (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  court text not null,
  zone text,
  redirect_slug text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups by slug
create index if not exists locations_slug_idx on locations (slug);

-- Enable RLS
alter table locations enable row level security;

-- Create policy for public read access
create policy "Enable read access for all users" on locations
  for select using (true);
