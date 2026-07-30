import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { VolunteerCard } from "../../components/volunteer-card";
import { createAuthClient, getSessionProfile } from "../../lib/auth";
import { isStaff } from "../../lib/roles";
import {
  VOLUNTEER_STATUS_LABELS,
  VOLUNTEER_STATUS_STYLES,
  VOLUNTEER_STATUSES,
  type Volunteer,
  type VolunteerStatus,
} from "../../lib/volunteers";

export const metadata: Metadata = {
  title: "Volunteers & mentors",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function VolunteersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  if (!isStaff(profile.role)) redirect("/admin/no-access");

  const { status: statusFilter } = await searchParams;

  const supabase = await createAuthClient();

  const { data, error } = await supabase!
    .from("mentor_applications")
    .select("*")
    .order("created_at", { ascending: false });

  const all = (data ?? []) as Volunteer[];

  const counts = VOLUNTEER_STATUSES.reduce<Record<string, number>>(
    (acc, status) => {
      acc[status] = all.filter((v) => v.status === status).length;
      return acc;
    },
    {},
  );

  const isValidFilter =
    statusFilter && VOLUNTEER_STATUSES.includes(statusFilter as VolunteerStatus);

  const visible = isValidFilter
    ? all.filter((v) => v.status === statusFilter)
    : all;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">
          Volunteers &amp; mentors
        </h1>
        <p className="mt-2 text-slate-400">
          Everyone who applied to mentor, and where they are in screening.
          {all.length > 0 && ` ${all.length} total.`}
        </p>

        {error && (
          <p className="mt-6 text-sm text-rose-300">
            Couldn&apos;t load: {error.message}
          </p>
        )}

        {all.length > 0 && (
          <nav
            aria-label="Filter by status"
            className="mt-8 flex flex-wrap gap-2"
          >
            <Link
              href="/admin/volunteers"
              className={`rounded-full border px-3 py-1.5 font-mono text-xs ${
                isValidFilter
                  ? "border-line text-slate-400 hover:text-slate-200"
                  : "border-neon-blue/40 bg-neon-blue/10 text-neon-blue"
              }`}
            >
              All {all.length}
            </Link>
            {VOLUNTEER_STATUSES.filter((s) => counts[s] > 0).map((status) => (
              <Link
                key={status}
                href={`/admin/volunteers?status=${status}`}
                className={`rounded-full border px-3 py-1.5 font-mono text-xs ${
                  statusFilter === status
                    ? VOLUNTEER_STATUS_STYLES[status]
                    : "border-line text-slate-400 hover:text-slate-200"
                }`}
              >
                {VOLUNTEER_STATUS_LABELS[status]} {counts[status]}
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-8 grid gap-6">
          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line bg-surface/40 p-10 text-center text-slate-500">
              {all.length === 0
                ? "No mentor applications yet. They'll appear here as they come in."
                : "Nobody in this status."}
            </p>
          ) : (
            visible.map((volunteer) => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} />
            ))
          )}
        </div>

        <div className="mt-12 rounded-xl border border-line bg-surface/60 p-6 text-sm text-slate-400">
          <p className="font-semibold text-slate-300">
            About background checks
          </p>
          <p className="mt-2">
            Record only the outcome here — never upload or paste the report
            itself. If you run checks through a screening company and decline
            someone because of what it said, US federal law (the FCRA) requires
            specific notices before and after that decision. Worth confirming
            your process with counsel before declining anyone on that basis.
          </p>
        </div>
      </div>
    </section>
  );
}
