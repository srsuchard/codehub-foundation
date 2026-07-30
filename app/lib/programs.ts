/** Program vocabulary. Client-safe — no server-only imports. */

export type ProgramKind =
  | "class"
  | "workshop"
  | "cybersecurity"
  | "ai_project"
  | "event";

export type ProgramStatus =
  | "draft"
  | "open"
  | "running"
  | "completed"
  | "cancelled";

export const PROGRAM_KIND_LABELS: Record<ProgramKind, string> = {
  class: "Coding class",
  workshop: "Workshop",
  cybersecurity: "Cybersecurity",
  ai_project: "AI project",
  event: "Event",
};

export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
  draft: "Draft",
  open: "Open for enrolment",
  running: "Running",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PROGRAM_STATUS_STYLES: Record<ProgramStatus, string> = {
  draft: "border-line bg-white/5 text-slate-400",
  open: "border-neon-blue/40 bg-neon-blue/10 text-neon-blue",
  running: "border-neon-green/40 bg-neon-green/10 text-neon-green",
  completed: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple",
  cancelled: "border-line bg-white/5 text-slate-500",
};

export const PROGRAM_KINDS = Object.keys(PROGRAM_KIND_LABELS) as ProgramKind[];
export const PROGRAM_STATUSES = Object.keys(
  PROGRAM_STATUS_LABELS,
) as ProgramStatus[];

export type Program = {
  id: string;
  created_at: string;
  name: string;
  kind: ProgramKind;
  status: ProgramStatus;
  summary: string | null;
  instructor: string | null;
  schedule: string | null;
  location: string | null;
  materials_url: string | null;
  capacity: number | null;
  starts_on: string | null;
  ends_on: string | null;
  updated_at: string | null;
};

/** Renders a date-only column without timezone drift. */
export function formatDay(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
}
