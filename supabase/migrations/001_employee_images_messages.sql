-- Stoyan additions: employee gallery + internal messaging
create table if not exists public.employee_images (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employee_profiles(id) on delete cascade,
  image_url text not null,
  image_name text,
  image_position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  contact_request_id uuid references public.contact_requests(id) on delete set null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.employee_images enable row level security;
alter table public.messages enable row level security;

create policy "employee own images" on public.employee_images for all using (auth.uid() = employee_id) with check (auth.uid() = employee_id);
create policy "visible employee images" on public.employee_images for select using (exists (select 1 from public.employee_profiles e where e.id = employee_id and e.profile_visible = true));
create policy "message participants" on public.messages for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "send messages" on public.messages for insert with check (auth.uid() = sender_id);
create policy "recipient mark read" on public.messages for update using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);

create index if not exists employee_images_employee_idx on public.employee_images(employee_id, image_position);
create index if not exists messages_recipient_idx on public.messages(recipient_id, created_at desc);
create index if not exists messages_sender_idx on public.messages(sender_id, created_at desc);

insert into storage.buckets (id,name,public) values ('employee-media','employee-media',true) on conflict (id) do nothing;

create policy "employee media upload" on storage.objects for insert with check (bucket_id = 'employee-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "employee media update" on storage.objects for update using (bucket_id = 'employee-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "employee media delete" on storage.objects for delete using (bucket_id = 'employee-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "employee media public read" on storage.objects for select using (bucket_id = 'employee-media');
