/**
 * Role vocabulary shared by server and client code.
 *
 * Deliberately free of any server-only import — `auth.ts` pulls in cookies and
 * the Supabase server client, so a Client Component importing from there is a
 * build error (which is exactly how this file came to exist).
 */

export type AppRole =
  | "admin"
  | "staff"
  | "board_member"
  | "volunteer"
  | "student";

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Admin",
  staff: "Staff",
  board_member: "Board member",
  volunteer: "Volunteer",
  student: "Student",
};

/** Roles permitted to read applicant data. Mirrors public.is_staff() in SQL. */
export const STAFF_ROLES: AppRole[] = ["admin", "staff"];

export function isStaff(role: AppRole | undefined): boolean {
  return role ? STAFF_ROLES.includes(role) : false;
}

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
};
