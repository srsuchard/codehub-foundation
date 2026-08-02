-- CodeHub Foundation — program management
-- Run AFTER 01-schema.sql, 02-rbac.sql, and 03-volunteers.sql. Safe to re-run.
--
-- Programs are the thing students enrol in and volunteers are assigned to, so
-- this file also retires mentor_applications.assigned_programs (free text) in
-- favour of a real join. Two places recording the same fact is how they drift.

-- --------------------------------------------------------------- enums

do $$
begin
  if not exists (select 1 from pg_type where typname = 'program_kind') then
    create type public.program_kind as enum (
      'class',        -- multi-week coding class
      'workshop',     -- single session
      'cybersecurity',
      'ai_project',
      'event'         -- hackathon, showcase, meetup
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'program_status') then
    create type public.program_status as enum (
      'draft',      -- being planned, not announced
      'open',       -- accepting students
      'running',    -- underway
      'completed',
      'cancelled'
    );
  end if;
end $$;

-- ------------------------------------------------------------- programs

create table if not exists public.programs (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  kind          public.program_kind not null default 'class',
  status        public.program_status not null default 'draft',
  summary       text,
  -- Free text: an instructor may be a volunteer, a staff member, or someone
  -- external. Assigned volunteers live in program_volunteers below.
  instructor    text,
  schedule      text,
  location      text,
  materials_url text,
  capacity      integer check (capacity is null or capacity > 0),
  starts_on     date,
  ends_on       date,
  updated_at    timestamptz,
  updated_by    uuid references public.profiles (id),
  constraint programs_dates_ordered
    check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create index if not exists programs_status_idx on public.programs (status);
create index if not exists programs_starts_on_idx on public.programs (starts_on);

-- ----------------------------------------------------------- enrolments

-- Links a student who already applied to a program. Collects no new personal
-- data — it records which existing applicant is in which program.
create table if not exists public.program_enrollments (
  id                     uuid primary key default gen_random_uuid(),
  program_id             uuid not null references public.programs (id) on delete cascade,
  student_application_id uuid not null references public.student_applications (id) on delete cascade,
  enrolled_at            timestamptz not null default now(),
  unique (program_id, student_application_id)
);

create index if not exists program_enrollments_program_idx
  on public.program_enrollments (program_id);

-- --------------------------------------------------- volunteer assignment

create table if not exists public.program_volunteers (
  id                     uuid primary key default gen_random_uuid(),
  program_id             uuid not null references public.programs (id) on delete cascade,
  mentor_application_id  uuid not null references public.mentor_applications (id) on delete cascade,
  assigned_at            timestamptz not null default now(),
  unique (program_id, mentor_application_id)
);

create index if not exists program_volunteers_program_idx
  on public.program_volunteers (program_id);
create index if not exists program_volunteers_mentor_idx
  on public.program_volunteers (mentor_application_id);

-- Superseded by program_volunteers. Dropped rather than left to drift.
alter table public.mentor_applications drop column if exists assigned_programs;

-- -------------------------------------------------------------- policies

alter table public.programs            enable row level security;
alter table public.program_enrollments enable row level security;
alter table public.program_volunteers  enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['programs','program_enrollments','program_volunteers']
  loop
    execute format('drop policy if exists "staff all" on public.%I', t);
    execute format(
      'create policy "staff all" on public.%I for all using (public.is_staff()) with check (public.is_staff())',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------- stamps

create or replace function public.stamp_program_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  if auth.uid() is not null then
    new.updated_by := auth.uid();
  end if;
  return new;
end $$;

drop trigger if exists programs_stamp on public.programs;
create trigger programs_stamp
  before update on public.programs
  for each row execute function public.stamp_program_update();
