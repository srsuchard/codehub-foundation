import { AdminNav } from "../components/admin-nav";
import { getSessionProfile } from "../lib/auth";
import { isStaff } from "../lib/roles";

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
  const showNav = profile && isStaff(profile.role);

  return (
    <>
      {showNav && <AdminNav email={profile.email} role={profile.role} />}
      {children}
    </>
  );
}
