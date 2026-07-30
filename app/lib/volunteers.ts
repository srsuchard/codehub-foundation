/**
 * Volunteer pipeline vocabulary. Client-safe — no server-only imports, so the
 * management UI can render labels without pulling in the auth module.
 */

export type VolunteerStatus =
  | "new"
  | "screening"
  | "background_check"
  | "training"
  | "active"
  | "inactive"
  | "declined";

export type BackgroundCheckStatus =
  | "not_required"
  | "pending"
  | "cleared"
  | "not_cleared";

export const VOLUNTEER_STATUS_LABELS: Record<VolunteerStatus, string> = {
  new: "New",
  screening: "Screening",
  background_check: "Background check",
  training: "Training",
  active: "Active",
  inactive: "Inactive",
  declined: "Declined",
};

/** Pill colours. `active` is green, terminal/negative states are muted. */
export const VOLUNTEER_STATUS_STYLES: Record<VolunteerStatus, string> = {
  new: "border-neon-blue/40 bg-neon-blue/10 text-neon-blue",
  screening: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple",
  background_check: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  training: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple",
  active: "border-neon-green/40 bg-neon-green/10 text-neon-green",
  inactive: "border-line bg-white/5 text-slate-400",
  declined: "border-line bg-white/5 text-slate-500",
};

export const BACKGROUND_CHECK_LABELS: Record<BackgroundCheckStatus, string> = {
  not_required: "Not required",
  pending: "Pending",
  cleared: "Cleared",
  not_cleared: "Not cleared",
};

export const VOLUNTEER_STATUSES = Object.keys(
  VOLUNTEER_STATUS_LABELS,
) as VolunteerStatus[];

export const BACKGROUND_CHECK_STATUSES = Object.keys(
  BACKGROUND_CHECK_LABELS,
) as BackgroundCheckStatus[];

export type Volunteer = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  profession: string;
  skills: string;
  experience: string | null;
  availability: string;
  status: VolunteerStatus;
  background_check: BackgroundCheckStatus;
  training_completed_at: string | null;
  assigned_programs: string | null;
  internal_notes: string | null;
  updated_at: string | null;
};
