-- CodeHub Foundation — audit log
-- Run AFTER 01-schema.sql through 05-ab506.sql.
-- Safe to re-run.
--
-- Deliberate scope: this records WHO changed WHAT DECISION and WHEN — not the
-- contents of records. Each trigger is given an allowlist of columns whose
-- before/after values may be stored (statuses, dates, roles, ids). Any other
-- column that changes is recorded by NAME only, never by value.
--
-- The reason is retention. A log that snapshots whole rows becomes a second
-- copy of every applicant's personal data — including minors' — in a table
-- your deletion process doesn't reach. Names, schools, notes and free text
-- therefore never land here.

create table if not exists public.audit_log (
  id             bigserial primary key,
  occurred_at    timestamptz not null default now(),
  actor_id       uuid references public.profiles (id) on delete set null,
  -- Denormalised so the trail survives the account being deleted.
  actor_email    text,
  action         text not null check (action in ('insert', 'update', 'delete')),
  table_name     text not null,
  record_id      uuid,
  -- Names of every column that changed, values omitted.
  changed_fields text[] not null default '{}',
  -- {column: {from, to}} for allowlisted columns only.
  details        jsonb not null default '{}'::jsonb
);

create index if not exists audit_log_occurred_at_idx
  on public.audit_log (occurred_at desc);
create index if not exists audit_log_table_idx
  on public.audit_log (table_name, occurred_at desc);
create index if not exists audit_log_record_idx
  on public.audit_log (record_id);

-- ------------------------------------------------------- append-only access

alter table public.audit_log enable row level security;

drop policy if exists "admin read" on public.audit_log;
create policy "admin read" on public.audit_log
  for select using (public.is_admin());

-- No insert/update/delete policy exists, and the privileges are revoked, so
-- the log is append-only from the application's point of view. Rows arrive
-- solely through the SECURITY DEFINER trigger below.
revoke insert, update, delete on public.audit_log from authenticated, anon;

-- ----------------------------------------------------------- the recorder

create or replace function public.audit_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  audited  text[] := tg_argv;
  changed  text[] := '{}';
  payload  jsonb  := '{}'::jsonb;
  col      text;
  old_j    jsonb;
  new_j    jsonb;
  rec_id   uuid;
  who      uuid := auth.uid();
  who_mail text;
begin
  if tg_op = 'INSERT' then
    new_j := to_jsonb(new);
    old_j := '{}'::jsonb;
  elsif tg_op = 'DELETE' then
    old_j := to_jsonb(old);
    new_j := '{}'::jsonb;
  else
    old_j := to_jsonb(old);
    new_j := to_jsonb(new);
  end if;

  rec_id := coalesce(new_j->>'id', old_j->>'id')::uuid;

  if tg_op = 'UPDATE' then
    for col in select jsonb_object_keys(new_j) loop
      -- Bookkeeping columns change on every write; logging them is noise.
      if col in ('updated_at', 'updated_by') then
        continue;
      end if;

      if (old_j->col) is distinct from (new_j->col) then
        changed := changed || col;

        if col = any(audited) then
          payload := payload || jsonb_build_object(
            col, jsonb_build_object('from', old_j->col, 'to', new_j->col)
          );
        end if;
      end if;
    end loop;

    -- A save that changed nothing isn't worth a row.
    if array_length(changed, 1) is null then
      return null;
    end if;
  else
    foreach col in array audited loop
      if tg_op = 'INSERT' and new_j ? col then
        payload := payload || jsonb_build_object(col, new_j->col);
      elsif tg_op = 'DELETE' and old_j ? col then
        payload := payload || jsonb_build_object(col, old_j->col);
      end if;
    end loop;
  end if;

  select email into who_mail from public.profiles where id = who;

  insert into public.audit_log (
    actor_id, actor_email, action, table_name, record_id, changed_fields, details
  )
  values (
    who, who_mail, lower(tg_op), tg_table_name, rec_id, changed, payload
  );

  return null; -- AFTER trigger; return value is ignored
end $$;

-- ------------------------------------------------------------- attachments
--
-- Arguments are the columns whose values may be stored. Everything else is
-- name-only.

drop trigger if exists audit_profiles on public.profiles;
create trigger audit_profiles
  after insert or update or delete on public.profiles
  for each row execute function public.audit_changes('role');

drop trigger if exists audit_mentor_applications on public.mentor_applications;
create trigger audit_mentor_applications
  after insert or update or delete on public.mentor_applications
  for each row execute function public.audit_changes(
    'status',
    'live_scan',
    'live_scan_submitted_on',
    'live_scan_cleared_on',
    'mandated_reporter_training_on',
    'abuse_policy_acknowledged_on',
    'ab506_complete',
    'training_completed_at'
  );

drop trigger if exists audit_programs on public.programs;
create trigger audit_programs
  after insert or update or delete on public.programs
  for each row execute function public.audit_changes(
    'name', 'kind', 'status', 'capacity', 'starts_on', 'ends_on'
  );

drop trigger if exists audit_program_enrollments on public.program_enrollments;
create trigger audit_program_enrollments
  after insert or update or delete on public.program_enrollments
  for each row execute function public.audit_changes(
    'program_id', 'student_application_id'
  );

drop trigger if exists audit_program_volunteers on public.program_volunteers;
create trigger audit_program_volunteers
  after insert or update or delete on public.program_volunteers
  for each row execute function public.audit_changes(
    'program_id', 'mentor_application_id'
  );
