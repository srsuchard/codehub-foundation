import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { MfaChallenge } from "../../components/mfa-challenge";
import { getSessionProfile, isMfaPending } from "../../lib/auth";

export const metadata: Metadata = {
  title: "Verify",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VerifyPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  // Already stepped up, or nothing enrolled — nothing to do here.
  if (!(await isMfaPending())) redirect("/admin");

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">
          Two-factor verification
        </h1>
        <p className="mt-3 text-slate-400">
          Enter the current 6-digit code from your authenticator app for{" "}
          <span className="font-mono text-slate-300">{profile.email}</span>.
        </p>

        <div className="mt-8 rounded-2xl border border-line bg-surface/60 p-7">
          <MfaChallenge />
        </div>

        <p className="mt-6 text-xs text-slate-600">
          Lost your authenticator? An admin can remove the factor from Supabase
          under Authentication → Users.
        </p>
      </div>
    </section>
  );
}
