/** Document centre vocabulary. Client-safe — no server-only imports. */

export type DocumentCategory =
  | "bylaws"
  | "policy"
  | "agreement"
  | "form"
  | "minutes"
  | "agenda"
  | "financial"
  | "other";

export type DocumentVisibility = "board" | "staff" | "admin_only";

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  bylaws: "Bylaws",
  policy: "Policy",
  agreement: "Agreement",
  form: "Form",
  minutes: "Minutes",
  agenda: "Agenda",
  financial: "Financial",
  other: "Other",
};

export const VISIBILITY_LABELS: Record<DocumentVisibility, string> = {
  board: "Board + staff",
  staff: "Staff only",
  admin_only: "Admins only",
};

export const VISIBILITY_STYLES: Record<DocumentVisibility, string> = {
  board: "border-neon-blue/40 bg-neon-blue/10 text-neon-blue",
  staff: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple",
  admin_only: "border-amber-500/40 bg-amber-500/10 text-amber-300",
};

export const DOCUMENT_CATEGORIES = Object.keys(
  DOCUMENT_CATEGORY_LABELS,
) as DocumentCategory[];

export const VISIBILITIES = Object.keys(
  VISIBILITY_LABELS,
) as DocumentVisibility[];

export type DocumentRow = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  category: DocumentCategory;
  visibility: DocumentVisibility;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  meeting_id: string | null;
};

export type BoardMeeting = {
  id: string;
  title: string;
  meets_on: string;
  location: string | null;
  summary: string | null;
};

/** Keep in step with serverActions.bodySizeLimit in next.config.ts. */
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDay(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
}
