/** Audit log vocabulary. Client-safe — no server-only imports. */

export type AuditAction = "insert" | "update" | "delete";

export type AuditEntry = {
  id: number;
  occurred_at: string;
  actor_email: string | null;
  action: AuditAction;
  table_name: string;
  record_id: string | null;
  changed_fields: string[];
  /**
   * For updates: {column: {from, to}}. For inserts/deletes: {column: value}.
   * Only allowlisted columns appear — never free text or personal data.
   */
  details: Record<string, unknown>;
};

export const AUDIT_TABLE_LABELS: Record<string, string> = {
  profiles: "Team & roles",
  mentor_applications: "Volunteers",
  programs: "Programs",
  program_enrollments: "Enrolments",
  program_volunteers: "Volunteer assignments",
};

export const AUDIT_ACTION_STYLES: Record<AuditAction, string> = {
  insert: "border-neon-green/40 bg-neon-green/10 text-neon-green",
  update: "border-neon-blue/40 bg-neon-blue/10 text-neon-blue",
  delete: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  insert: "created",
  update: "changed",
  delete: "deleted",
};

/** Column name → human label, for rendering diffs. */
export const FIELD_LABELS: Record<string, string> = {
  role: "Role",
  status: "Status",
  live_scan: "Live Scan",
  live_scan_submitted_on: "Live Scan submitted",
  live_scan_cleared_on: "Live Scan cleared",
  mandated_reporter_training_on: "Mandated reporter training",
  abuse_policy_acknowledged_on: "Abuse policy acknowledged",
  ab506_complete: "AB 506 complete",
  training_completed_at: "Onboarding complete",
  name: "Name",
  kind: "Type",
  capacity: "Capacity",
  starts_on: "Starts",
  ends_on: "Ends",
  program_id: "Program",
  student_application_id: "Student",
  mentor_application_id: "Volunteer",
  internal_notes: "Internal notes",
};

export function fieldLabel(key: string) {
  return FIELD_LABELS[key] ?? key.replace(/_/g, " ");
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "empty";
  if (typeof value === "boolean") return value ? "yes" : "no";
  return String(value);
}

/** True when details holds {from, to} rather than a bare value. */
export function isDiff(value: unknown): value is { from: unknown; to: unknown } {
  return (
    typeof value === "object" &&
    value !== null &&
    "from" in value &&
    "to" in value
  );
}
