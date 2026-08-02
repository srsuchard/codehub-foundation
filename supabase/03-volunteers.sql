-- CodeHub Foundation — volunteer & mentor management
-- Run AFTER 01-schema.sql and 02-rbac.sql. Safe to re-run.
--
-- Design note: mentor_applications stays the intake record — what the person
-- actually told us. The columns added here are the *pipeline* on top of it:
-- where they are in screening, whether they cleared a background check, and
-- who last touched any of it. Keeping both on one row avoids a join and a
-- second source of truth while there's still only one intake path.

-- --------------------------------------------------------------- enums

do $$
begin
  if not exists (select 1 from pg_type where typname = 'volunteer_status') then
    create type public.volunteer_status as enum (
      'new',              -- application received, nobody has looked yet
      'screening',        -- interview / reference check underway
      'background_check', -- awaiting background check result
      'training',         -- onboarding in progress
      'active',           -- cleared and placed
      'inactive',         -- previously active, not currently placed
      'declined'          -- not proceeding
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'background_check_status') then
    create type public.background_check_status as enum (
      'not_required',
      'pending',
      'cleared',
      'not_cleared'
    );
  end if;
end $$;

-- ------------------------------------------------------ pipeline columns

alter table public.mentor_applications
  add column if not exists status public.volunteer_status not null default 'new',
  add column if not exists background_check public.background_check_status
    not null default 'not_required',
  add column if not exists training_completed_at timestamptz,
  -- Free text until a programs table exists (roadmap section 4), at which
  -- point this becomes a join table rather than a string.
  add column if not exists assigned_programs text,
  add column if not exists internal_notes text,
  add column if not exists updated_at timestamptz,
  add column if not exists updated_by uuid references public.profiles (id);

create index if not exists mentor_applications_status_idx
  on public.mentor_applications (status);

-- ------------------------------------------------------------- policies

-- Staff may now update the pipeline fields, not just read. Reads were already
-- granted by rbac.sql; this adds write.
drop policy if exists "staff update" on public.mentor_applications;
create policy "staff update" on public.mentor_applications
  for update using (public.is_staff()) with check (public.is_staff());

-- Stamp who changed what. This is a last-writer record, not a full audit log —
-- that belongs with the audit work in the security section of the roadmap.
create or replace function public.stamp_volunteer_update()
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

drop trigger if exists mentor_applications_stamp on public.mentor_applications;
create trigger mentor_applications_stamp
  before update on public.mentor_applications
  for each row execute function public.stamp_volunteer_update();
