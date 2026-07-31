#!/usr/bin/env bash
#
# Off-platform export of the CodeHub Foundation database and storage files.
#
#   ./scripts/export-backup.sh ~/codehub-backups
#
# Supabase's own daily backups live inside the project; this exists for the case
# where the project itself is gone. See supabase/BACKUPS.md.
#
# WARNING: the output contains applicant data, including minors' names, schools
# and ages. Keep it on an encrypted disk, out of cloud sync folders and Git, and
# delete old copies.

set -euo pipefail

PROJECT_REF="awrqavzjnnqjmpnkqpko"
DEST="${1:-}"

if [[ -z "$DEST" ]]; then
  echo "usage: $0 <destination-directory>" >&2
  exit 64
fi

# Checked before anything else: refusing an unsafe destination must not depend
# on which tools happen to be installed.
case "$DEST" in
  *Dropbox*|*"Google Drive"*|*OneDrive*|*iCloud*)
    echo "Refusing to export into a cloud-synced folder: $DEST" >&2
    echo "This data should not leave an encrypted local disk." >&2
    exit 1
    ;;
esac

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "pg_dump not found. Install it with: brew install postgresql@17" >&2
  exit 69
fi

STAMP="$(date +%Y-%m-%d-%H%M)"
OUT="$DEST/codehub-backup-$STAMP"
mkdir -p "$OUT/storage"

# Not passed as an argument, so it never lands in shell history.
if [[ -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
  read -rsp "Database password (Supabase → Settings → Database): " SUPABASE_DB_PASSWORD
  echo
fi

# Session pooler: the direct host is IPv6-only on newer projects.
CONN="postgresql://postgres.${PROJECT_REF}:${SUPABASE_DB_PASSWORD}@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

echo "→ Dumping database…"
pg_dump "$CONN" \
  --schema=public \
  --no-owner \
  --no-privileges \
  --file="$OUT/database.sql"

echo "→ Downloading storage objects…"
if [[ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" && -n "${SUPABASE_URL:-}" ]]; then
  # List every object, then fetch each one.
  curl -sS -X POST "$SUPABASE_URL/storage/v1/object/list/documents" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d '{"prefix":"","limit":1000}' > "$OUT/storage/_manifest.json"

  python3 - "$OUT" <<'PY'
import json, os, subprocess, sys
out = sys.argv[1]
manifest = os.path.join(out, "storage", "_manifest.json")
try:
    items = json.load(open(manifest))
except Exception:
    items = []
names = [i["name"] for i in items if isinstance(i, dict) and i.get("name")]
print(f"  {len(names)} object(s)")
for name in names:
    url = f"{os.environ['SUPABASE_URL']}/storage/v1/object/documents/{name}"
    dest = os.path.join(out, "storage", name.replace("/", "_"))
    subprocess.run([
        "curl", "-sS", "-o", dest,
        "-H", f"apikey: {os.environ['SUPABASE_SERVICE_ROLE_KEY']}",
        "-H", f"Authorization: Bearer {os.environ['SUPABASE_SERVICE_ROLE_KEY']}",
        url,
    ], check=False)
PY
else
  echo "  skipped — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to include files"
  echo "  (both are in .env.local)"
fi

chmod -R go-rwx "$OUT"

echo
echo "Export written to: $OUT"
du -sh "$OUT"
echo
echo "This contains personal data. Keep it encrypted and delete old copies."
