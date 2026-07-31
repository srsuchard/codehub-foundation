-- CodeHub Foundation — California AB 506 volunteer screening
-- Run AFTER schema.sql, rbac.sql, volunteers.sql, programs.sql. Safe to re-run.
--
-- AB 506 (California, in force since 2022) requires youth service organizations
-- to screen anyone with regular contact with minors via DOJ *and* FBI
-- fingerprinting (Live Scan), to train them as mandated reporters, and to have
-- a child abuse prevention and reporting policy.
--
-- The generic four-state background_check column is replaced with fields that
-- match what actually has to be evidenced. Not legal advice — confirm scope
-- with counsel — but the shape here follows the statute's three requirements.

-- ---------------------------------------------------------------- enums

do $$
begin
  if not exists (select 1 from pg_type where typname = 'live_scan_status') then
    create type public.live_scan_status as enum (
      'not_started',
      'submitted',   -- fingerprints taken, awaiting DOJ/FBI response
      'cleared',     -- both DOJ and FBI returned clear
      'not_cleared'  -- record returned; do not place with minors
    );
  end if;
end $$;

-- ------------------------------------------------------------- columns

alter table public.mentor_applications
  drop column if exists background_check;

alter table public.mentor_applications
  add column if not exists live_scan public.live_scan_status not null
    default 'not_started',
  add column if not exists live_scan_submitted_on date,
  add column if not exists live_scan_cleared_on date,
  -- Applicant Tracking Identifier from the Live Scan form. A transaction id
  -- for chasing a pending result — never store the report or its contents.
  add column if not exists live_scan_ati text,
  add column if not exists mandated_reporter_training_on date,
  add column if not exists abuse_policy_acknowledged_on date;

-- Single source of truth for "may this adult be placed with students?".
-- Generated, so it can never drift from the fields it summarises.
alter table public.mentor_applications
  add column if not exists ab506_complete boolean
  generated always as (
    live_scan = 'cleared'
    and mandated_reporter_training_on is not null
    and abuse_policy_acknowledged_on is not null
  ) stored;

create index if not exists mentor_applications_ab506_idx
  on public.mentor_applications (ab506_complete);

-- The old enum is unused once the column is gone.
do $$
begin
  if not exists (
    select 1 from pg_attribute a
    join pg_type t on a.atttypid = t.oid
    where t.typname = 'background_check_status' and not a.attisdropped
  ) then
    drop type if exists public.background_check_status;
  end if;
end $$;

-- ------------------------------------------- enforce screening at the DB

-- The UI already filters the picker, but filtering a dropdown is not a control.
-- This makes it impossible to assign an unscreened adult to a program even by
-- a direct API call or a bug in the app.
create or replace function public.enforce_volunteer_compliance()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  compliant boolean;
  current_status public.volunteer_status;
  who text;
begin
  select ab506_complete, status, name
    into compliant, current_status, who
  from public.mentor_applications
  where id = new.mentor_application_id;

  if not coalesce(compliant, false) then
    raise exception
      '% has not completed AB 506 screening (Live Scan cleared, mandated reporter training, abuse-prevention policy acknowledged)',
      coalesce(who, 'This volunteer');
  end if;

  if current_status not in ('training', 'active') then
    raise exception '% must be in Training or Active to be assigned',
      coalesce(who, 'This volunteer');
  end if;

  return new;
end $$;

drop trigger if exists program_volunteers_compliance on public.program_volunteers;
create trigger program_volunteers_compliance
  before insert or update on public.program_volunteers
  for each row execute function public.enforce_volunteer_compliance();
