import type { Metadata } from "next";

import { signOut } from "../../lib/admin-actions";
import { getSessionProfile } from "../../lib/auth";
import { ROLE_LABELS } from "../../lib/roles";

export const metadata: Metadata = {
  title: "No access",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NoAccessPage() {
  const profile = await getSessionProfile();

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-md text-center">
        <p className="text-5xl" aria-hidden>
          🔒
        </p>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          You don&apos;t have access
        </h1>
        <p className="mt-4 text-slate-400">
          {profile ? (
            <>
              Your account is signed in as{" "}
              <span className="font-mono text-slate-300">{profile.email}</span>{" "}
              with the role{" "}
              <strong className="text-slate-300">
                {ROLE_LABELS[profile.role]}
              </strong>
              , which can&apos;t view this area. If that looks wrong, ask an
              administrator to update your role.
            </>
          ) : (
            <>You need to sign in first.</>
          )}
        </p>

        {profile?.role === "board_member" && (
          <p className="mt-6">
            <a
              href="/admin/board"
              className="text-neon-blue hover:underline"
            >
              Go to the board portal →
            </a>
          </p>
        )}

        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className="rounded-lg border border-line px-5 py-2.5 text-sm text-slate-300 hover:border-neon-purple hover:text-neon-purple"
          >
            Sign out
          </button>
        </form>
      </div>
    </section>
  );
}
