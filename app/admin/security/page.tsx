import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { MfaSetup } from "../../components/mfa-setup";
import { createAuthClient, getSessionProfile } from "../../lib/auth";
import { PORTAL_ROLES } from "../../lib/roles";

export const metadata: Metadata = {
  title: "Security",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  if (!PORTAL_ROLES.includes(profile.role)) redirect("/admin/no-access");

  const supabase = await createAuthClient();
  const { data: factors } = await supabase!.auth.mfa.listFactors();
  const verified = factors?.totp?.find((f) => f.status === "verified");

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="mt-2 text-slate-400">
          Settings for{" "}
          <span className="font-mono text-slate-300">{profile.email}</span>.
        </p>

        <div className="mt-10 rounded-2xl border border-line bg-surface/60 p-6">
          <h2 className="text-lg font-bold">Two-factor authentication</h2>
          <div className="mt-4">
            <MfaSetup enrolled={Boolean(verified)} factorId={verified?.id} />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-surface/60 p-6 text-sm text-slate-400">
          <p className="font-semibold text-slate-300">How this is enforced</p>
          <p className="mt-2">
            Once you turn 2FA on, the database itself stops answering for
            password-only sessions — every policy checks it. Turning it on for
            one account doesn&apos;t affect anyone else, and accounts without it
            keep working as before.
          </p>
          <p className="mt-3">
            Worth turning on for every account that can reach applicant data.
          </p>
        </div>
      </div>
    </section>
  );
}
