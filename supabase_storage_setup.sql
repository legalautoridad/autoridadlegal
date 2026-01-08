-- 1. Create a private bucket for case files
insert into storage.buckets (id, name, public)
values ('case-files', 'case-files', false);

-- 2. Set up RLS Policies (Row Level Security)

-- POLICY: Detect/Allow authenticated users to upload their own files
create policy "Users can upload their own case files"
on storage.objects for insert
with check (
  bucket_id = 'case-files' AND
  auth.uid() = owner
);

-- POLICY: Users can view their own files
create policy "Users can view their own case files"
on storage.objects for select
using (
  bucket_id = 'case-files' AND
  auth.uid() = owner
);

-- Note: No update/delete policy for now to preserve evidence chain.
