import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RoleSelect } from "../../components/role-select";
import { createAuthClient, getSessionProfile } from "../../lib/auth";
import { ROLE_LABELS, type Profile } from "../../lib/roles";

export const metadata: Metadata = {
  title: "Team & roles",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  if (profile.role !== "admin") redirect("/admin/no-access");

  const supabase = await createAuthClient();

  const { data, error } = await supabase!
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: true });

  const people = (data ?? []) as Profile[];

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">Team &amp; roles</h1>
        <p className="mt-2 text-slate-400">
          Everyone with an account. Roles decide what each person can reach —
          only <strong className="text-slate-300">Admin</strong> and{" "}
          <strong className="text-slate-300">Staff</strong> can see applicant
          data.
        </p>

        {error && (
          <p className="mt-6 text-sm text-rose-300">
            Couldn&apos;t load: {error.message}
          </p>
        )}

        <div className="mt-10 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface text-xs tracking-wider text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {people.map((person) => (
                <tr key={person.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-slate-300">
                    {person.email}
                    {person.id === profile.id && (
                      <span className="ml-2 font-mono text-xs text-slate-500">
                        (you)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-slate-500">
                    {new Date(person.created_at).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {person.id === profile.id ? (
                      <span className="rounded-full border border-neon-purple/40 bg-neon-purple/10 px-3 py-1 font-mono text-xs text-neon-purple">
                        {ROLE_LABELS[person.role]}
                      </span>
                    ) : (
                      <RoleSelect
                        userId={person.id}
                        currentRole={person.role}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          You can&apos;t change your own role — that prevents the last admin
          from accidentally locking everyone out. Ask another admin, or update
          it directly in Supabase.
        </p>

        <div className="mt-10 rounded-xl border border-line bg-surface/60 p-6 text-sm text-slate-400">
          <p className="font-semibold text-slate-300">Adding someone</p>
          <p className="mt-2">
            Create the user in Supabase → Authentication → Users, or have them
            sign up. New accounts start as{" "}
            <strong className="text-slate-300">Student</strong>, which grants
            nothing, then you promote them here.
          </p>
        </div>
      </div>
    </section>
  );
}
