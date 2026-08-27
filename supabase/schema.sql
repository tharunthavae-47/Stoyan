-- STOYAN: separate database schema
create extension if not exists "pgcrypto";

create type public.user_role as enum ('employee', 'employer');
create type public.application_status as enum ('pending', 'reviewing', 'accepted', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  first_name text,
  last_name text,
  email text,
  phone text,
  city text,
  postal_code text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employee_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  profession text,
  bio text,
  education text,
  years_experience numeric(4,1) default 0,
  desired_salary_min integer,
  desired_salary_max integer,
  desired_employment_percent integer default 100,
  preferred_radius_km integer default 30,
  available_from date,
  remote_ok boolean not null default false,
  shift_work_ok boolean not null default false,
  driving_license_b boolean not null default false,
  skills text[] not null default '{}',
  languages text[] not null default '{}',
  profile_visible boolean not null default true,
  contact_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employee_images (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employee_profiles(id) on delete cascade,
  image_url text not null,
  image_name text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  industry text,
  website text,
  city text,
  postal_code text,
  employee_count integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text not null,
  profession text,
  city text,
  postal_code text,
  employment_min integer default 80,
  employment_max integer default 100,
  salary_min integer,
  salary_max integer,
  experience_min numeric(4,1) default 0,
  education text,
  radius_km integer default 30,
  remote_ok boolean not null default false,
  shift_work boolean not null default false,
  driving_license_b boolean not null default false,
  skills text[] not null default '{}',
  languages text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  employee_id uuid not null references public.employee_profiles(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  reasons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique(job_id, employee_id)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  employee_id uuid not null references public.employee_profiles(id) on delete cascade,
  status public.application_status not null default 'pending',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_id, employee_id)
);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles(id) on delete cascade,
  employee_id uuid not null references public.employee_profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.employee_profiles enable row level security;
alter table public.employee_images enable row level security;
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.matches enable row level security;
alter table public.applications enable row level security;
alter table public.contact_requests enable row level security;

create policy "profiles own read" on public.profiles for select using (auth.uid() = id);
create policy "profiles own insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles own update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "employees own profile" on public.employee_profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "visible employee profiles" on public.employee_profiles for select using (profile_visible = true);

create policy "employee images own access" on public.employee_images for all using (auth.uid() = employee_id) with check (auth.uid() = employee_id);
create policy "employee images visible read" on public.employee_images for select using (exists (select 1 from public.employee_profiles e where e.id = employee_id and e.profile_visible = true));

create policy "company owner access" on public.companies for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "employer jobs access" on public.jobs for all using (exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid())) with check (exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid()));
create policy "active jobs readable" on public.jobs for select using (active = true);

create policy "employee matches" on public.matches for select using (auth.uid() = employee_id or exists (select 1 from public.jobs j join public.companies c on c.id = j.company_id where j.id = job_id and c.owner_id = auth.uid()));
create policy "employee applications" on public.applications for all using (auth.uid() = employee_id or exists (select 1 from public.jobs j join public.companies c on c.id = j.company_id where j.id = job_id and c.owner_id = auth.uid()));
create policy "contact participants" on public.contact_requests for all using (auth.uid() = employee_id or auth.uid() = employer_id);

insert into storage.buckets (id, name, public) values ('employee-media','employee-media',true) on conflict (id) do nothing;

create policy "employee media insert own" on storage.objects for insert with check (bucket_id = 'employee-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "employee media update own" on storage.objects for update using (bucket_id = 'employee-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "employee media delete own" on storage.objects for delete using (bucket_id = 'employee-media' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "employee media public read" on storage.objects for select using (bucket_id = 'employee-media');

create index jobs_active_idx on public.jobs(active);
create index jobs_profession_idx on public.jobs(profession);
create index employee_profession_idx on public.employee_profiles(profession);
create index employee_skills_idx on public.employee_profiles using gin(skills);
create index job_skills_idx on public.jobs using gin(skills);
create index employee_images_employee_idx on public.employee_images(employee_id, sort_order);
