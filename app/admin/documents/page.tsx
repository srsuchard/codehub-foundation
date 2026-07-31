import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DocumentList } from "../../components/document-list";
import { DocumentUpload } from "../../components/document-upload";
import { createAuthClient, getSessionProfile, isMfaPending } from "../../lib/auth";
import {
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_CATEGORIES,
  type BoardMeeting,
  type DocumentCategory,
  type DocumentRow,
} from "../../lib/documents";
import { isStaff } from "../../lib/roles";

export const metadata: Metadata = {
  title: "Documents",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const profile = await getSessionProfile();

  if (!profile) redirect("/admin/login");
  if (!isStaff(profile.role)) redirect("/admin/no-access");
  if (await isMfaPending()) redirect("/admin/verify");

  const { category } = await searchParams;
  const activeCategory =
    category && DOCUMENT_CATEGORIES.includes(category as DocumentCategory)
      ? category
      : null;

  const supabase = await createAuthClient();

  const [docsResult, meetingsResult] = await Promise.all([
    supabase!
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase!
      .from("board_meetings")
      .select("id, title, meets_on, location, summary")
      .order("meets_on", { ascending: false }),
  ]);

  const all = (docsResult.data ?? []) as DocumentRow[];
  const meetings = (meetingsResult.data ?? []) as BoardMeeting[];

  const counts = DOCUMENT_CATEGORIES.reduce<Record<string, number>>(
    (acc, key) => {
      acc[key] = all.filter((doc) => doc.category === key).length;
      return acc;
    },
    {},
  );

  const visible = activeCategory
    ? all.filter((doc) => doc.category === activeCategory)
    : all;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="mt-2 text-slate-400">
          Bylaws, policies, agreements, forms, and minutes. Each document&apos;s
          visibility decides who can open it — board members never see anything
          marked staff or admin only.
        </p>

        {docsResult.error && (
          <p className="mt-6 text-sm text-rose-300">
            Couldn&apos;t load: {docsResult.error.message}
          </p>
        )}

        {all.length > 0 && (
          <nav aria-label="Filter by category" className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/admin/documents"
              className={`rounded-full border px-3 py-1.5 font-mono text-xs ${
                activeCategory
                  ? "border-line text-slate-400 hover:text-slate-200"
                  : "border-neon-blue/40 bg-neon-blue/10 text-neon-blue"
              }`}
            >
              All {all.length}
            </Link>
            {DOCUMENT_CATEGORIES.filter((key) => counts[key] > 0).map((key) => (
              <Link
                key={key}
                href={`/admin/documents?category=${key}`}
                className={`rounded-full border px-3 py-1.5 font-mono text-xs ${
                  activeCategory === key
                    ? "border-neon-blue/40 bg-neon-blue/10 text-neon-blue"
                    : "border-line text-slate-400 hover:text-slate-200"
                }`}
              >
                {DOCUMENT_CATEGORY_LABELS[key]} {counts[key]}
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-8">
          <DocumentList
            documents={visible}
            canManage
            emptyLabel={
              all.length === 0
                ? "No documents yet. Upload the first one below."
                : "Nothing in this category."
            }
          />
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-surface/60 p-6">
          <h2 className="text-lg font-bold">Upload a document</h2>
          <p className="mt-1 mb-6 text-sm text-slate-400">
            Files are stored privately. Download links are generated per click
            and expire after a minute — nothing is reachable by URL.
          </p>
          <DocumentUpload meetings={meetings} />
        </div>
      </div>
    </section>
  );
}
