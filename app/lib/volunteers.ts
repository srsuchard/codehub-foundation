/**
 * Volunteer pipeline vocabulary. Client-safe — no server-only imports.
 *
 * Screening fields follow California AB 506, which requires youth service
 * organizations to Live Scan (DOJ + FBI) anyone with regular contact with
 * minors, train them as mandated reporters, and have them acknowledge a child
 * abuse prevention policy. All three must be complete before a volunteer can
 * be assigned to a program — enforced by a database trigger, not just here.
 */

export type VolunteerStatus =
  | "new"
  | "screening"
  | "background_check"
  | "training"
  | "active"
  | "inactive"
  | "declined";

export type LiveScanStatus =
  | "not_started"
  | "submitted"
  | "cleared"
  | "not_cleared";

export const VOLUNTEER_STATUS_LABELS: Record<VolunteerStatus, string> = {
  new: "New",
  screening: "Screening",
  background_check: "Live Scan",
  training: "Training",
  active: "Active",
  inactive: "Inactive",
  declined: "Declined",
};

export const VOLUNTEER_STATUS_STYLES: Record<VolunteerStatus, string> = {
  new: "border-neon-blue/40 bg-neon-blue/10 text-neon-blue",
  screening: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple",
  background_check: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  training: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple",
  active: "border-neon-green/40 bg-neon-green/10 text-neon-green",
  inactive: "border-line bg-white/5 text-slate-400",
  declined: "border-line bg-white/5 text-slate-500",
};

export const LIVE_SCAN_LABELS: Record<LiveScanStatus, string> = {
  not_started: "Not started",
  submitted: "Submitted — awaiting result",
  cleared: "Cleared (DOJ + FBI)",
  not_cleared: "Not cleared",
};

export const VOLUNTEER_STATUSES = Object.keys(
  VOLUNTEER_STATUS_LABELS,
) as VolunteerStatus[];

export const LIVE_SCAN_STATUSES = Object.keys(
  LIVE_SCAN_LABELS,
) as LiveScanStatus[];

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
  live_scan: LiveScanStatus;
  live_scan_submitted_on: string | null;
  live_scan_cleared_on: string | null;
  live_scan_ati: string | null;
  mandated_reporter_training_on: string | null;
  abuse_policy_acknowledged_on: string | null;
  /** Generated in Postgres — all three AB 506 requirements met. */
  ab506_complete: boolean;
  training_completed_at: string | null;
  internal_notes: string | null;
  updated_at: string | null;
};

/** The three AB 506 requirements, for rendering a checklist. */
export function ab506Checklist(volunteer: Volunteer) {
  return [
    {
      label: "Live Scan cleared (DOJ + FBI)",
      done: volunteer.live_scan === "cleared",
    },
    {
      label: "Mandated reporter training",
      done: Boolean(volunteer.mandated_reporter_training_on),
    },
    {
      label: "Abuse prevention policy acknowledged",
      done: Boolean(volunteer.abuse_policy_acknowledged_on),
    },
  ];
}
