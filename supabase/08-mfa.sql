-- CodeHub Foundation — two-factor enforcement
-- Run AFTER 02-rbac.sql and 07-documents.sql. Safe to re-run.
--
-- Enrolment on its own is decoration: a user could enrol a TOTP factor and the
-- application could still hand them data on a password-only session. The check
-- therefore goes into the three helper functions every RLS policy already
-- routes through, so it covers every table at once — existing and future.
--
-- The rule is conditional on purpose:
--
--   * A user WITH a verified factor must be at aal2 (they completed 2FA).
--   * A user WITHOUT one is unaffected.
--
-- Unconditional enforcement would lock out every existing account the moment
-- this ran, including the only admin. This way 2FA tightens access for whoever
-- turns it on, and nobody gets stranded.

create or replace function public.mfa_satisfied()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    -- Session already stepped up to 2FA.
    coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
    -- …or this user has nothing enrolled to step up with.
    or not exists (
      select 1 from auth.mfa_factors
      where user_id = auth.uid() and status = 'verified'
    )
$$;

-- ------------------------------------- fold the check into the role helpers

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.mfa_satisfied() and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.mfa_satisfied() and exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  )
$$;

create or replace function public.is_board()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.mfa_satisfied() and exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'staff', 'board_member')
  )
$$;

-- Note: "read own profile" on public.profiles deliberately does NOT require
-- aal2. A half-authenticated user still needs to load their own row for the
-- app to know who they are and send them to the verification step.
