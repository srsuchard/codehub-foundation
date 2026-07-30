import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProgramForm } from "../../components/program-form";
import { createAuthClient, getSessionProfile } from "../../lib/auth";
import {
  formatDay,
  PROGRAM_KIND_LABELS,
  PROGRAM_STATUS_LABELS,
  PROGRAM_STATUS_STYLES,
  type Program,
} from "../../lib/programs";
import { isStaff } from "../../lib/roles";

export const metadata: Metadata = {
  title: "Programs",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type ProgramRow = Program & {
  program_enrollments: { count: number }[];
  program_volunteers: { count: number }[];
};

export default async function ProgramsPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  if (!isStaff(profile.role)) redirect("/admin/no-access");

  const supabase = await createAuthClient();

  const { data, error } = await supabase!
    .from("programs")
    .select("*, program_enrollments(count), program_volunteers(count)")
    .order("starts_on", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const programs = (data ?? []) as ProgramRow[];

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
        <p className="mt-2 text-slate-400">
          Classes, workshops, and events — who&apos;s teaching them and
          who&apos;s enrolled.
        </p>

        {error && (
          <p className="mt-6 text-sm text-rose-300">
            Couldn&apos;t load: {error.message}
          </p>
        )}

        <div className="mt-10 grid gap-4">
          {programs.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line bg-surface/40 p-10 text-center text-slate-500">
              No programs yet. Create the first one below.
            </p>
          ) : (
            programs.map((program) => (
              <Link
                key={program.id}
                href={`/admin/programs/${program.id}`}
                className="block rounded-2xl border border-line bg-surface/60 p-6 transition-colors hover:border-neon-blue"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{program.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {PROGRAM_KIND_LABELS[program.kind]}
                      {program.instructor && ` · ${program.instructor}`}
                      {program.schedule && ` · ${program.schedule}`}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 font-mono text-xs ${PROGRAM_STATUS_STYLES[program.status]}`}
                  >
                    {PROGRAM_STATUS_LABELS[program.status]}
                  </span>
                </div>

                <p className="mt-4 font-mono text-xs text-slate-500">
                  {program.program_enrollments?.[0]?.count ?? 0} enrolled
                  {program.capacity ? ` / ${program.capacity}` : ""} ·{" "}
                  {program.program_volunteers?.[0]?.count ?? 0} volunteers
                  {program.starts_on && ` · from ${formatDay(program.starts_on)}`}
                </p>
              </Link>
            ))
          )}
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-surface/60 p-6">
          <h2 className="text-lg font-bold">New program</h2>
          <p className="mt-1 mb-6 text-sm text-slate-400">
            Starts as a draft — nothing is published to the public site.
          </p>
          <ProgramForm />
        </div>
      </div>
    </section>
  );
}
