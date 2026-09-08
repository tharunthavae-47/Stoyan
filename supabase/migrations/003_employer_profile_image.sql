-- Employer/company profile image
alter table public.companies
  add column if not exists avatar_url text;

-- The existing employee-media bucket/policies are reused for employer avatars.
-- Employer avatar paths use: <owner_id>/employer-avatar.<ext>
