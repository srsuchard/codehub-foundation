import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DocumentList } from "../../components/document-list";
import { MeetingForm } from "../../components/meeting-form";
import { createAuthClient, getSessionProfile, isMfaPending } from "../../lib/auth";
import {
  DOCUMENT_CATEGORY_LABELS,
  formatDay,
  type BoardMeeting,
  type DocumentRow,
} from "../../lib/documents";
import { isStaff } from "../../lib/roles";

export const metadata: Metadata = {
  title: "Board portal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Visible to board members as well as staff — the only page that is. Row-level
 * security does the real work: a board member's session simply cannot read
 * applicant tables or staff-only documents, whatever this page asks for.
 */
export default async function BoardPage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  if (!["admin", "staff", "board_member"].includes(profile.role)) {
    redirect("/admin/no-access");
  }
  if (await isMfaPending()) redirect("/admin/verify");

  const canManage = isStaff(profile.role);
  const supabase = await createAuthClient();

  const [meetingsResult, docsResult] = await Promise.all([
    supabase!
      .from("board_meetings")
      .select("id, title, meets_on, location, summary")
      .order("meets_on", { ascending: false }),
    supabase!
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const meetings = (meetingsResult.data ?? []) as BoardMeeting[];
  const documents = (docsResult.data ?? []) as DocumentRow[];

  const governance = documents.filter((doc) =>
    ["bylaws", "policy", "agreement", "financial"].includes(doc.category),
  );
  const unlinkedPapers = documents.filter(
    (doc) => ["minutes", "agenda"].includes(doc.category) && !doc.meeting_id,
  );

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = meetings.filter((m) => m.meets_on >= today).reverse();
  const past = meetings.filter((m) => m.meets_on < today);

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">Board portal</h1>
        <p className="mt-2 text-slate-400">
          Meetings, agendas, minutes, and governance documents.
          {!canManage &&
            " You have read access — staff maintain these records."}
        </p>

        {/* Governance */}
        <h2 className="mt-12 text-xl font-bold">Governance documents</h2>
        <p className="mt-1 mb-4 text-sm text-slate-400">
          Bylaws, policies, agreements, and financials.
        </p>
        <DocumentList
          documents={governance}
          canManage={canManage}
          emptyLabel="No governance documents yet."
        />

        {/* Meetings */}
        <h2 className="mt-12 text-xl font-bold">
          Upcoming meetings
          <span className="ml-3 font-mono text-sm font-normal text-slate-500">
            {upcoming.length}
          </span>
        </h2>
        <div className="mt-4 grid gap-3">
          {upcoming.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line bg-surface/40 p-8 text-center text-sm text-slate-500">
              Nothing scheduled.
            </p>
          ) : (
            upcoming.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                documents={documents.filter((d) => d.meeting_id === meeting.id)}
                canManage={canManage}
              />
            ))
          )}
        </div>

        {past.length > 0 && (
          <>
            <h2 className="mt-12 text-xl font-bold">
              Past meetings
              <span className="ml-3 font-mono text-sm font-normal text-slate-500">
                {past.length}
              </span>
            </h2>
            <div className="mt-4 grid gap-3">
              {past.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  documents={documents.filter(
                    (d) => d.meeting_id === meeting.id,
                  )}
                  canManage={canManage}
                />
              ))}
            </div>
          </>
        )}

        {unlinkedPapers.length > 0 && (
          <>
            <h2 className="mt-12 text-xl font-bold">Other agendas &amp; minutes</h2>
            <p className="mt-1 mb-4 text-sm text-slate-400">
              Not linked to a meeting record.
            </p>
            <DocumentList
              documents={unlinkedPapers}
              canManage={canManage}
              emptyLabel=""
            />
          </>
        )}

        {canManage && (
          <div className="mt-12 rounded-2xl border border-line bg-surface/60 p-6">
            <h2 className="text-lg font-bold">Add a meeting</h2>
            <p className="mt-1 mb-6 text-sm text-slate-400">
              Attach the agenda and minutes from the{" "}
              <span className="text-slate-300">Documents</span> page once they
              exist.
            </p>
            <MeetingForm />
          </div>
        )}
      </div>
    </section>
  );
}

function MeetingCard({
  meeting,
  documents,
  canManage,
}: {
  meeting: BoardMeeting;
  documents: DocumentRow[];
  canManage: boolean;
}) {
  return (
    <article className="rounded-xl border border-line bg-surface/60 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-bold text-slate-200">{meeting.title}</h3>
        <span className="font-mono text-xs text-neon-blue">
          {formatDay(meeting.meets_on)}
          {meeting.location && ` · ${meeting.location}`}
        </span>
      </div>

      {meeting.summary && (
        <p className="mt-3 text-sm text-slate-400">{meeting.summary}</p>
      )}

      {documents.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {documents.map((doc) => (
            <li key={doc.id}>
              <span className="rounded-full border border-line bg-white/5 px-3 py-1 font-mono text-xs text-slate-400">
                {DOCUMENT_CATEGORY_LABELS[doc.category]}: {doc.title}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        canManage && (
          <p className="mt-3 text-xs text-slate-600">
            No agenda or minutes attached yet.
          </p>
        )
      )}

      {documents.length > 0 && (
        <div className="mt-4">
          <DocumentList
            documents={documents}
            canManage={canManage}
            emptyLabel=""
          />
        </div>
      )}
    </article>
  );
}
