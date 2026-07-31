import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ProgramForm } from "../../../components/program-form";
import {
  RosterManager,
  type RosterPerson,
} from "../../../components/roster-manager";
import { createAuthClient, getSessionProfile } from "../../../lib/auth";
import {
  assignVolunteer,
  enrollStudent,
  unassignVolunteer,
  unenrollStudent,
} from "../../../lib/program-actions";
import {
  formatDay,
  PROGRAM_KIND_LABELS,
  PROGRAM_STATUS_LABELS,
  PROGRAM_STATUS_STYLES,
  type Program,
} from "../../../lib/programs";
import { isStaff } from "../../../lib/roles";

export const metadata: Metadata = {
  title: "Program",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  if (!isStaff(profile.role)) redirect("/admin/no-access");

  const { id } = await params;
  const supabase = await createAuthClient();

  const { data: program } = await supabase!
    .from("programs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!program) notFound();

  const typed = program as Program;

  // Rosters, plus everyone eligible to be added.
  const [enrolled, assigned, allStudents, allVolunteers] = await Promise.all([
    supabase!
      .from("program_enrollments")
      .select("student_application_id, student_applications(id, name, email)")
      .eq("program_id", id),
    supabase!
      .from("program_volunteers")
      .select("mentor_application_id, mentor_applications(id, name, email)")
      .eq("program_id", id),
    supabase!
      .from("student_applications")
      .select("id, name, email")
      .order("name"),
    // Only volunteers who've cleared AB 506 screening can be put in front of
    // students. A database trigger enforces the same rule on insert — this
    // filter just keeps ineligible people out of the picker.
    supabase!
      .from("mentor_applications")
      .select("id, name, email")
      .in("status", ["training", "active"])
      .eq("ab506_complete", true)
      .order("name"),
  ]);

  const students = (enrolled.data ?? [])
    .map((row) => row.student_applications as unknown as RosterPerson)
    .filter(Boolean);

  const volunteers = (assigned.data ?? [])
    .map((row) => row.mentor_applications as unknown as RosterPerson)
    .filter(Boolean);

  const enrolledIds = new Set(students.map((s) => s.id));
  const assignedIds = new Set(volunteers.map((v) => v.id));

  const availableStudents = ((allStudents.data ?? []) as RosterPerson[]).filter(
    (s) => !enrolledIds.has(s.id),
  );
  const availableVolunteers = (
    (allVolunteers.data ?? []) as RosterPerson[]
  ).filter((v) => !assignedIds.has(v.id));

  const atCapacity =
    typed.capacity !== null && students.length >= typed.capacity;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/programs"
          className="text-sm text-slate-400 hover:text-neon-blue"
        >
          ← Programs
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{typed.name}</h1>
            <p className="mt-2 text-slate-400">
              {PROGRAM_KIND_LABELS[typed.kind]}
              {typed.starts_on && ` · from ${formatDay(typed.starts_on)}`}
              {typed.ends_on && ` to ${formatDay(typed.ends_on)}`}
            </p>
          </div>
          <span
            className={`rounded-full border px-3 py-1 font-mono text-xs ${PROGRAM_STATUS_STYLES[typed.status]}`}
          >
            {PROGRAM_STATUS_LABELS[typed.status]}
          </span>
        </div>

        {atCapacity && (
          <p className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            This program is at capacity ({students.length} of {typed.capacity}).
            You can still enrol someone — it won&apos;t be blocked — but check
            first.
          </p>
        )}

        <div className="mt-10 grid gap-6">
          <RosterManager
            programId={typed.id}
            title="Students enrolled"
            emptyLabel="Nobody enrolled yet."
            members={students}
            available={availableStudents}
            addAction={enrollStudent}
            removeAction={unenrollStudent}
            addLabel="Enrol"
          />

          <RosterManager
            programId={typed.id}
            title="Volunteers assigned"
            emptyLabel="No volunteers assigned yet."
            members={volunteers}
            available={availableVolunteers}
            addAction={assignVolunteer}
            removeAction={unassignVolunteer}
            addLabel="Assign"
          />
          <p className="-mt-3 text-xs text-slate-600">
            Only volunteers who are <strong>Training</strong> or{" "}
            <strong>Active</strong> <em>and</em> have completed AB 506 screening
            appear here — Live Scan cleared, mandated reporter training, and
            abuse policy acknowledged. Record those on the{" "}
            <Link href="/admin/volunteers" className="text-neon-blue hover:underline">
              volunteers page
            </Link>
            . The database rejects the assignment either way.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-surface/60 p-6">
          <h2 className="text-lg font-bold">Program details</h2>
          <div className="mt-6">
            <ProgramForm program={typed} />
          </div>
        </div>
      </div>
    </section>
  );
}
