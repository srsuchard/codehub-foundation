-- CodeHub Foundation — document centre and board portal
-- Run AFTER 01-schema.sql through 06-audit.sql. Safe to re-run.
--
-- Bylaws, policies, agendas and minutes have a different audience to applicant
-- data: board members must read them, but board members must NOT see student
-- or volunteer records. This file adds the third access tier that makes that
-- distinction possible.

-- ---------------------------------------------------------------- enums

do $$
begin
  if not exists (select 1 from pg_type where typname = 'document_category') then
    create type public.document_category as enum (
      'bylaws',
      'policy',
      'agreement',
      'form',
      'minutes',
      'agenda',
      'financial',
      'other'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'document_visibility') then
    create type public.document_visibility as enum (
      'board',      -- board members, staff and admins
      'staff',      -- staff and admins only
      'admin_only'  -- admins only (e.g. anything sensitive)
    );
  end if;
end $$;

-- ------------------------------------------------------- board-level access

-- Third tier alongside is_staff() and is_admin(). Board members sit outside
-- staff deliberately: governance documents yes, applicant data no.
create or replace function public.is_board()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'staff', 'board_member')
  )
$$;

-- ------------------------------------------------------------- meetings

create table if not exists public.board_meetings (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title      text not null,
  meets_on   date not null,
  location   text,
  summary    text,
  updated_at timestamptz,
  updated_by uuid references public.profiles (id)
);

create index if not exists board_meetings_meets_on_idx
  on public.board_meetings (meets_on desc);

-- ------------------------------------------------------------ documents

create table if not exists public.documents (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  description  text,
  category     public.document_category not null default 'other',
  visibility   public.document_visibility not null default 'board',
  -- Path within the private 'documents' storage bucket.
  storage_path text not null unique,
  file_name    text not null,
  mime_type    text,
  size_bytes   bigint,
  uploaded_by  uuid references public.profiles (id),
  -- Optional link to the meeting an agenda or minutes belongs to.
  meeting_id   uuid references public.board_meetings (id) on delete set null
);

create index if not exists documents_category_idx on public.documents (category);
create index if not exists documents_meeting_idx on public.documents (meeting_id);

-- -------------------------------------------------------------- policies

alter table public.board_meetings enable row level security;
alter table public.documents      enable row level security;

drop policy if exists "board read meetings"  on public.board_meetings;
drop policy if exists "staff write meetings" on public.board_meetings;

create policy "board read meetings" on public.board_meetings
  for select using (public.is_board());

create policy "staff write meetings" on public.board_meetings
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "read by visibility" on public.documents;
drop policy if exists "staff write docs"   on public.documents;

-- The visibility column decides the audience, evaluated per row.
create policy "read by visibility" on public.documents
  for select using (
    (visibility = 'board'      and public.is_board())
    or (visibility = 'staff'      and public.is_staff())
    or (visibility = 'admin_only' and public.is_admin())
  );

create policy "staff write docs" on public.documents
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------- storage

-- Private bucket. No public policies are created, so nothing is readable by
-- URL. Files are served only through short-lived signed URLs minted after the
-- metadata row above has already passed its RLS check — which means the
-- policies on public.documents govern file access too.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do update set public = false;

-- ------------------------------------------------------------ audit trail

drop trigger if exists audit_documents on public.documents;
create trigger audit_documents
  after insert or update or delete on public.documents
  for each row execute function public.audit_changes(
    'title', 'category', 'visibility'
  );

drop trigger if exists audit_board_meetings on public.board_meetings;
create trigger audit_board_meetings
  after insert or update or delete on public.board_meetings
  for each row execute function public.audit_changes('title', 'meets_on');

create or replace function public.stamp_meeting_update()
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

drop trigger if exists board_meetings_stamp on public.board_meetings;
create trigger board_meetings_stamp
  before update on public.board_meetings
  for each row execute function public.stamp_meeting_update();
