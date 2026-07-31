import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createAuthClient, getSessionProfile, isMfaPending } from "../lib/auth";
import { isStaff, ROLE_LABELS } from "../lib/roles";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Never prerender an auth-gated page. Without this, a build where the auth env
 * vars are absent skips the cookie read and Next bakes this page — including
 * its redirect — into static HTML.
 */
export const dynamic = "force-dynamic";

type Column = { key: string; label: string; wide?: boolean };

const TABLES: {
  table: string;
  title: string;
  accent: string;
  columns: Column[];
}[] = [
  {
    table: "student_applications",
    title: "Student applications",
    accent: "text-neon-blue",
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "grade", label: "Grade" },
      { key: "school", label: "School" },
      { key: "experience", label: "Experience" },
      { key: "interests", label: "Interests", wide: true },
      { key: "goals", label: "Goals", wide: true },
    ],
  },
  {
    table: "mentor_applications",
    title: "Mentor applications",
    accent: "text-neon-green",
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "profession", label: "Profession" },
      { key: "availability", label: "Availability" },
      { key: "skills", label: "Skills", wide: true },
      { key: "experience", label: "Notes", wide: true },
    ],
  },
  {
    table: "sponsor_inquiries",
    title: "Sponsor inquiries",
    accent: "text-neon-purple",
    columns: [
      { key: "company", label: "Organization" },
      { key: "name", label: "Contact" },
      { key: "email", label: "Email" },
      { key: "interest", label: "Interest" },
      { key: "message", label: "Message", wide: true },
    ],
  },
  {
    table: "board_applications",
    title: "Board applications",
    accent: "text-neon-blue",
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "skills", label: "Skills" },
      { key: "experience", label: "Background", wide: true },
      { key: "motivation", label: "Motivation", wide: true },
    ],
  },
  {
    table: "contact_messages",
    title: "Contact messages",
    accent: "text-slate-200",
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "topic", label: "Topic" },
      { key: "message", label: "Message", wide: true },
    ],
  },
];

type Row = Record<string, string | null> & { id: string; created_at: string };

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  if (!isStaff(profile.role)) redirect("/admin/no-access");
  if (await isMfaPending()) redirect("/admin/verify");

  // Reads run on the user's own session, so row-level security applies. A
  // non-staff session reaching here would get zero rows, not a leak.
  const supabase = await createAuthClient();

  const results = await Promise.all(
    TABLES.map(async (config) => {
      const { data, error } = await supabase!
        .from(config.table)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      return { config, rows: (data ?? []) as Row[], error: error?.message };
    }),
  );

  const total = results.reduce((sum, r) => sum + r.rows.length, 0);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
            <p className="mt-2 text-slate-400">
              Signed in as{" "}
              <span className="font-mono text-slate-300">{profile.email}</span>{" "}
              <span className="rounded-full border border-neon-purple/40 bg-neon-purple/10 px-2 py-0.5 font-mono text-xs text-neon-purple">
                {ROLE_LABELS[profile.role]}
              </span>{" "}
              · {total} total
            </p>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {results.map(({ config, rows }) => (
            <div
              key={config.table}
              className="rounded-xl border border-line bg-surface/60 p-5"
            >
              <dt className="text-xs text-slate-500">{config.title}</dt>
              <dd className={`mt-1 font-mono text-3xl font-bold ${config.accent}`}>
                {rows.length}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-12">
          {results.map(({ config, rows, error }) => (
            <section key={config.table}>
              <h2 className={`text-xl font-bold ${config.accent}`}>
                {config.title}
                <span className="ml-3 font-mono text-sm font-normal text-slate-500">
                  {rows.length}
                </span>
              </h2>

              {error ? (
                <p className="mt-4 text-sm text-rose-300">
                  Couldn&apos;t load: {error}
                </p>
              ) : rows.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-line bg-surface/40 p-6 text-sm text-slate-500">
                  Nothing yet.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-surface text-xs tracking-wider text-slate-400 uppercase">
                      <tr>
                        <th className="px-4 py-3 font-medium">Received</th>
                        {config.columns.map((column) => (
                          <th key={column.key} className="px-4 py-3 font-medium">
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {rows.map((row) => (
                        <tr key={row.id} className="align-top hover:bg-white/5">
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-slate-500">
                            {formatDate(row.created_at)}
                          </td>
                          {config.columns.map((column) => (
                            <td
                              key={column.key}
                              className={`px-4 py-3 text-slate-300 ${
                                column.wide ? "min-w-[16rem]" : ""
                              }`}
                            >
                              {column.key === "email" && row[column.key] ? (
                                <a
                                  href={`mailto:${row[column.key]}`}
                                  className="text-neon-blue hover:underline"
                                >
                                  {row[column.key]}
                                </a>
                              ) : (
                                (row[column.key] ?? (
                                  <span className="text-slate-600">—</span>
                                ))
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
