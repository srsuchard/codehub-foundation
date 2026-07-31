# Backups and recovery

Runbook for the `codehub-foundation` Supabase project (`awrqavzjnnqjmpnkqpko`,
`us-west-2`).

## What already exists

Supabase takes **automated daily physical backups** of the Postgres database.
Verified present and completing. Nothing needs to be set up for this to happen.

Check them any time: Supabase → Database → Backups.

## What those backups do not cover

Four gaps, in rough order of how likely they are to hurt.

### 1. Storage files are a separate system

Daily database backups snapshot Postgres. Board documents, bylaws, and minutes
live in the **`documents` storage bucket**, which is object storage, not
Postgres. Restoring the database would bring back every `documents` row —
title, category, visibility, `storage_path` — pointing at files that may no
longer exist.

Confirm the coverage of your plan with Supabase directly rather than assuming
either way. Until then, treat uploaded files as **not backed up** and keep the
originals wherever they came from.

### 2. Point-in-time recovery is off

`pitr_enabled: false`. Recovery granularity is therefore a **daily snapshot**,
so a failure at 23:00 can cost most of a day's submissions. PITR is a paid
add-on that reduces this to seconds.

Worth the money once real applications are arriving. Not worth it while the
tables are empty.

### 3. Deleting the project deletes its backups

Backups live inside the project. If it is deleted — accidentally, or for
non-payment — the backups go with it. Nothing here protects against that except
an export held somewhere else. See below.

### 4. An untested restore is not a backup

Nobody has ever restored this database. The first attempt should not be during
an actual incident.

## Taking an off-platform export

`scripts/export-backup.sh` writes a compressed dump plus every storage object to
a local directory.

```bash
./scripts/export-backup.sh ~/codehub-backups
```

Requires `pg_dump` (`brew install postgresql@17`) and the database password from
Supabase → Settings → Database.

**These exports contain applicant data, including minors' names, schools, and
ages.** Treat them accordingly:

- Keep them on an encrypted disk. FileVault is on by default on macOS — confirm
  it is actually enabled.
- Do not put them in Dropbox, Google Drive, email, or any Git repository.
- Delete old exports. An export from a year ago is a liability, not an asset.
- If you keep one off your machine, encrypt it first:
  `gpg -c codehub-backup-YYYY-MM-DD.tar.gz`

A sensible rhythm is monthly, plus immediately before any migration that alters
existing tables.

## Restoring

### From a Supabase daily backup

1. Supabase → Database → Backups
2. Pick a backup, **Restore**
3. Confirm. This **overwrites the current database** — everything since that
   snapshot is lost.

Restores take the project offline briefly. The public site keeps serving
(the pages are static), but forms will fail while it happens.

### From an export

```bash
psql "$DATABASE_URL" < codehub-backup-YYYY-MM-DD/database.sql
```

Restore storage files by re-uploading `storage/` through the admin Documents
page, or with the Supabase CLI.

## Verifying a restore actually worked

After any restore, check that authorization survived — a database that comes
back with its policies wrong is worse than one that stays down, because it
looks fine while being open.

```sql
-- Expect: every table true, and audit_log admin-only.
select tablename, rowsecurity from pg_tables where schemaname = 'public';

-- Expect: is_admin, is_staff, is_board, mfa_satisfied all present.
select proname from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('is_admin','is_staff','is_board','mfa_satisfied');

-- Expect: at least one admin, or nobody can administer anything.
select email, role from public.profiles where role = 'admin';
```

Then sign in and confirm the admin pages load.

## Rehearsal

Restore into a **throwaway Supabase project**, not this one, and run the checks
above. Worth doing once before real applications arrive, and again after any
change to the schema.
