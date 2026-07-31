import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  AUDIT_ACTION_LABELS,
  AUDIT_ACTION_STYLES,
  AUDIT_TABLE_LABELS,
  fieldLabel,
  formatValue,
  isDiff,
  type AuditEntry,
} from "../../lib/audit";
import { createAuthClient, getSessionProfile } from "../../lib/auth";

export const metadata: Metadata = {
  title: "Audit log",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  // Audit is admin-only — the RLS policy says the same, so a staff session
  // reaching here would read zero rows anyway.
  if (profile.role !== "admin") redirect("/admin/no-access");

  const { table } = await searchParams;
  const tables = Object.keys(AUDIT_TABLE_LABELS);
  const activeTable = table && tables.includes(table) ? table : null;

  const supabase = await createAuthClient();

  let query = supabase!
    .from("audit_log")
    .select("*")
    .order("occurred_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (activeTable) query = query.eq("table_name", activeTable);

  const { data, error } = await query;
  const entries = (data ?? []) as AuditEntry[];

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">Audit log</h1>
        <p className="mt-2 text-slate-400">
          Who changed what, and when. Records decisions — statuses, roles,
          screening, assignments — never the contents of an application.
        </p>

        {error && (
          <p className="mt-6 text-sm text-rose-300">
            Couldn&apos;t load: {error.message}
          </p>
        )}

        <nav aria-label="Filter by area" className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/admin/audit"
            className={`rounded-full border px-3 py-1.5 font-mono text-xs ${
              activeTable
                ? "border-line text-slate-400 hover:text-slate-200"
                : "border-neon-blue/40 bg-neon-blue/10 text-neon-blue"
            }`}
          >
            All
          </Link>
          {tables.map((name) => (
            <Link
              key={name}
              href={`/admin/audit?table=${name}`}
              className={`rounded-full border px-3 py-1.5 font-mono text-xs ${
                activeTable === name
                  ? "border-neon-blue/40 bg-neon-blue/10 text-neon-blue"
                  : "border-line text-slate-400 hover:text-slate-200"
              }`}
            >
              {AUDIT_TABLE_LABELS[name]}
            </Link>
          ))}
        </nav>

        <div className="mt-8 grid gap-3">
          {entries.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line bg-surface/40 p-10 text-center text-slate-500">
              Nothing recorded yet. Changes to volunteers, programs, and roles
              will appear here.
            </p>
          ) : (
            entries.map((entry) => {
              // Fields that changed but whose values are deliberately not stored.
              const unlogged = entry.changed_fields.filter(
                (field) => !(field in entry.details),
              );

              return (
                <article
                  key={entry.id}
                  className="rounded-xl border border-line bg-surface/60 p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${AUDIT_ACTION_STYLES[entry.action]}`}
                    >
                      {AUDIT_ACTION_LABELS[entry.action]}
                    </span>
                    <span className="text-sm text-slate-300">
                      {AUDIT_TABLE_LABELS[entry.table_name] ?? entry.table_name}
                    </span>
                    <span className="ml-auto font-mono text-xs text-slate-500">
                      {new Date(entry.occurred_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    {entry.actor_email ? (
                      <>
                        by{" "}
                        <span className="font-mono text-slate-400">
                          {entry.actor_email}
                        </span>
                      </>
                    ) : (
                      // No signed-in user: a public form submission, or a
                      // change made directly in Supabase.
                      <span className="text-slate-600">
                        by the system (public submission or direct database
                        change)
                      </span>
                    )}
                  </p>

                  {Object.keys(entry.details).length > 0 && (
                    <ul className="mt-3 grid gap-1.5 text-sm">
                      {Object.entries(entry.details).map(([key, value]) => (
                        <li key={key} className="text-slate-300">
                          <span className="text-slate-500">
                            {fieldLabel(key)}:
                          </span>{" "}
                          {isDiff(value) ? (
                            <>
                              <span className="text-slate-500 line-through">
                                {formatValue(value.from)}
                              </span>{" "}
                              <span aria-hidden className="text-slate-600">
                                →
                              </span>{" "}
                              <span className="text-neon-green">
                                {formatValue(value.to)}
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-300">
                              {formatValue(value)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {unlogged.length > 0 && (
                    <p className="mt-3 text-xs text-slate-600">
                      Also changed (values not recorded):{" "}
                      {unlogged.map(fieldLabel).join(", ")}
                    </p>
                  )}
                </article>
              );
            })
          )}
        </div>

        {entries.length === PAGE_SIZE && (
          <p className="mt-6 text-center text-xs text-slate-600">
            Showing the {PAGE_SIZE} most recent entries.
          </p>
        )}
      </div>
    </section>
  );
}
