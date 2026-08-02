-- CodeHub Foundation — application tables
-- Run this in the Supabase SQL Editor for your project.
--
-- RLS is enabled with NO policies, so the anon/public key cannot read or write
-- these tables at all. The site writes to them from Server Actions using the
-- service role key, which bypasses RLS. That combination means applicant data
-- is never reachable from the browser.

create table if not exists public.student_applications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  grade       text not null,
  school      text,
  interests   text,
  experience  text not null,
  goals       text
);

create table if not exists public.mentor_applications (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  profession   text not null,
  skills       text not null,
  experience   text,
  availability text not null
);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  topic      text not null,
  message    text not null
);

create table if not exists public.board_applications (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  experience text not null,
  skills     text not null,
  motivation text not null
);

create table if not exists public.sponsor_inquiries (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company    text not null,
  name       text not null,
  email      text not null,
  interest   text not null,
  message    text
);

alter table public.student_applications enable row level security;
alter table public.mentor_applications  enable row level security;
alter table public.contact_messages     enable row level security;
alter table public.board_applications   enable row level security;
alter table public.sponsor_inquiries    enable row level security;

create index if not exists student_applications_created_at_idx
  on public.student_applications (created_at desc);
create index if not exists mentor_applications_created_at_idx
  on public.mentor_applications (created_at desc);
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists board_applications_created_at_idx
  on public.board_applications (created_at desc);
create index if not exists sponsor_inquiries_created_at_idx
  on public.sponsor_inquiries (created_at desc);
