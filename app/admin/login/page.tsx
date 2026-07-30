import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "../../components/admin-login-form";
import {
  getAdminUser,
  getAuthConfigStatus,
  isAuthConfigured,
} from "../../lib/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

/** Reads session cookies and env config — must be evaluated per request. */
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin");

  const configured = isAuthConfigured();

  return (
    <section className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">Admin sign in</h1>
        <p className="mt-3 text-slate-400">
          For CodeHub Foundation staff. Applications are not public.
        </p>

        <div className="mt-8 rounded-2xl border border-line bg-surface/60 p-7">
          {configured ? (
            <LoginForm />
          ) : (
            <div className="text-sm text-slate-400">
              <p className="font-semibold text-rose-300">
                Admin sign-in isn&apos;t configured yet.
              </p>

              <ul className="mt-5 grid gap-3">
                {getAuthConfigStatus().map((item) => (
                  <li key={item.name} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={item.ok ? "text-neon-green" : "text-rose-400"}
                    >
                      {item.ok ? "✓" : "✗"}
                    </span>
                    <span>
                      <code
                        className={item.ok ? "text-slate-400" : "text-rose-300"}
                      >
                        {item.name}
                      </code>
                      <span className="sr-only">
                        {item.ok ? " is set" : " is missing"}
                      </span>
                      {!item.ok && (
                        <span className="mt-1 block text-xs text-slate-500">
                          {item.hint}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs text-slate-500">
                Set the missing values in the deployment environment (Production
                scope) and redeploy — environment changes don&apos;t apply to
                existing deployments. Then create the matching user under
                Supabase → Authentication → Users.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
