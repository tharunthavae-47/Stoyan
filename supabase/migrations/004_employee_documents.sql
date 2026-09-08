-- Private employee documents. Employers receive access only through the application
-- endpoint after a contact request has been accepted.
create table if not exists public.employee_documents (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employee_profiles(id) on delete cascade,
  category text not null check (category in ('lebenslauf','diplome','zeugnisse','arbeitszeugnisse','zertifikate','sonstige')),
  file_name text not null,
  file_path text not null unique,
  mime_type text not null,
  file_size bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists employee_documents_employee_idx
  on public.employee_documents(employee_id, category, created_at desc);

alter table public.employee_documents enable row level security;

drop policy if exists "employee documents own read" on public.employee_documents;
drop policy if exists "employee documents own insert" on public.employee_documents;
drop policy if exists "employee documents own delete" on public.employee_documents;

create policy "employee documents own read"
on public.employee_documents for select to authenticated
using ((select auth.uid()) = employee_id);

create policy "employee documents own insert"
on public.employee_documents for insert to authenticated
with check ((select auth.uid()) = employee_id);

create policy "employee documents own delete"
on public.employee_documents for delete to authenticated
using ((select auth.uid()) = employee_id);

grant select, insert, delete on public.employee_documents to authenticated;

insert into storage.buckets (id, name, public)
values ('employee-documents', 'employee-documents', false)
on conflict (id) do update set public = false;

drop policy if exists "employee documents upload own" on storage.objects;
drop policy if exists "employee documents read own" on storage.objects;
drop policy if exists "employee documents delete own" on storage.objects;

create policy "employee documents upload own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'employee-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "employee documents read own"
on storage.objects for select to authenticated
using (
  bucket_id = 'employee-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "employee documents delete own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'employee-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
