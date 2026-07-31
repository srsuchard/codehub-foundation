import { AdminNav } from "../components/admin-nav";
import { getSessionProfile } from "../lib/auth";
import type { AppRole } from "../lib/roles";

/**
 * Chrome only — this layout deliberately does NOT gate access.
 *
 * Next renders layouts and pages in parallel, so a redirect here wouldn't
 * reliably stop a page below from running. Each admin page does its own check.
 * The nav is hidden for anyone not signed in as staff, which keeps it off the
 * login and no-access screens.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();
  const PORTAL_ROLES: AppRole[] = ["admin", "staff", "board_member"];
  const showNav = profile && PORTAL_ROLES.includes(profile.role);

  return (
    <>
      {showNav && <AdminNav email={profile.email} role={profile.role} />}
      {children}
    </>
  );
}
