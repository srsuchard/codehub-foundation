-- CodeHub Foundation — roles and row-level authorization
-- Run AFTER schema.sql, in the Supabase SQL Editor. Safe to re-run.
--
-- Design notes:
--
-- 1. Authorization lives in the database, not in app code. The dashboard reads
--    with the signed-in user's own session, so Postgres — not a forgotten `if`
--    in a route — decides what each person can see.
--
-- 2. Policies that check a role must not query `profiles` directly, or the
--    policy on `profiles` re-triggers itself and Postgres errors with infinite
--    recursion. The helper functions below are SECURITY DEFINER, which runs
--    them as the owner and bypasses RLS for that lookup only.
--
-- 3. Public form submissions still insert via the service role, which bypasses
--    RLS entirely. Those paths are unchanged.

-- ---------------------------------------------------------------- roles enum

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum (
      'admin',        -- full access, can assign roles
      'staff',        -- can read applications and submissions
      'board_member', -- board portal (not yet built)
      'volunteer',    -- volunteer/mentor portal (not yet built)
      'student'       -- student portal (not yet built); default for new signups
    );
  end if;
end $$;

-- ----------------------------------------------------------------- profiles

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  role       public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create index if not exists profiles_role_idx on public.profiles (role);

-- ------------------------------------------------------- role helper lookups

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

-- Staff-level access: admins and staff. This is the gate for applicant data.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  )
$$;

-- --------------------------------------------- auto-provision a profile row

-- Supabase permits public sign-up by default, so anyone can create an auth
-- user. They land here as 'student', which no policy below grants anything to.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'student')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------- block self-promotion to admin

-- Without this, the "update your own profile" policy would let any signed-in
-- user set their own role to 'admin'.
--
-- `auth.uid() is null` means there is no end user on the request — the service
-- role or a direct SQL session. Those are already omnipotent (the service key
-- can drop the table), so gating them buys nothing and makes bootstrapping the
-- very first admin impossible. The check that matters is the one on requests
-- that DO carry a user.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only an admin may change a role';
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- ----------------------------------------------------- policies: profiles

drop policy if exists "read own profile"      on public.profiles;
drop policy if exists "staff read profiles"   on public.profiles;
drop policy if exists "update own profile"    on public.profiles;
drop policy if exists "admin writes profiles" on public.profiles;

create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "staff read profiles" on public.profiles
  for select using (public.is_staff());

-- Role changes are still blocked by the trigger above.
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "admin writes profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------ policies: submission tables

-- Read-only, staff-only. Inserts continue to arrive via the service role.
do $$
declare
  t text;
begin
  foreach t in array array[
    'student_applications',
    'mentor_applications',
    'sponsor_inquiries',
    'board_applications',
    'contact_messages'
  ]
  loop
    execute format('drop policy if exists "staff read" on public.%I', t);
    execute format(
      'create policy "staff read" on public.%I for select using (public.is_staff())',
      t
    );
  end loop;
end $$;

-- ------------------------------------------------------------- first admin
--
-- Seeded separately so no personal email is committed to a public repo:
--
--   update public.profiles set role = 'admin' where email = 'you@example.com';
--
-- At least one admin must exist or nobody can assign roles.
