-- Stoyan: shared private chat for employer <-> employee contact requests
-- The employee request page already uses contact_messages, so both sides
-- intentionally use the same table.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  contact_request_id uuid not null references public.contact_requests(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (length(trim(message)) > 0 and length(message) <= 5000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists contact_messages_request_idx
  on public.contact_messages(contact_request_id, created_at asc);

create index if not exists contact_messages_sender_idx
  on public.contact_messages(sender_id, created_at desc);

alter table public.contact_messages enable row level security;

-- Remove old versions if this migration is re-applied manually.
drop policy if exists "contact messages participants read" on public.contact_messages;
drop policy if exists "contact messages participants insert" on public.contact_messages;
drop policy if exists "contact messages recipient read mark" on public.contact_messages;

create policy "contact messages participants read"
on public.contact_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.contact_requests cr
    where cr.id = contact_request_id
      and cr.status = 'accepted'
      and (cr.employer_id = (select auth.uid()) or cr.employee_id = (select auth.uid()))
  )
);

create policy "contact messages participants insert"
on public.contact_messages
for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1
    from public.contact_requests cr
    where cr.id = contact_request_id
      and cr.status = 'accepted'
      and (cr.employer_id = (select auth.uid()) or cr.employee_id = (select auth.uid()))
  )
);

create policy "contact messages recipient read mark"
on public.contact_messages
for update
to authenticated
using (
  exists (
    select 1
    from public.contact_requests cr
    where cr.id = contact_request_id
      and cr.status = 'accepted'
      and (
        (cr.employer_id = (select auth.uid()) and sender_id = cr.employee_id)
        or
        (cr.employee_id = (select auth.uid()) and sender_id = cr.employer_id)
      )
  )
)
with check (
  exists (
    select 1
    from public.contact_requests cr
    where cr.id = contact_request_id
      and cr.status = 'accepted'
      and (cr.employer_id = (select auth.uid()) or cr.employee_id = (select auth.uid()))
  )
);

grant select, insert, update on public.contact_messages to authenticated;

-- Enable Supabase Realtime for live messages. The DO block avoids an error
-- if the table has already been added to the publication.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'contact_messages'
  ) then
    alter publication supabase_realtime add table public.contact_messages;
  end if;
end
$$;
