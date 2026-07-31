"use client";

import { useActionState, useState, useTransition } from "react";

import { deleteDocument, getDownloadUrl } from "../lib/document-actions";
import {
  DOCUMENT_CATEGORY_LABELS,
  formatBytes,
  VISIBILITY_LABELS,
  VISIBILITY_STYLES,
  type DocumentRow,
} from "../lib/documents";
import { INITIAL_FORM_STATE } from "../lib/schemas";

function DownloadButton({ id, fileName }: { id: string; fileName: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Links are minted per click and expire in 60s, so nothing durable is ever
  // embedded in the page.
  function open() {
    setError(null);
    startTransition(async () => {
      const result = await getDownloadUrl(id);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      window.open(result.url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <span className="flex items-center gap-2">
      <button
        type="button"
        onClick={open}
        disabled={pending}
        className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate-300 hover:border-neon-blue hover:text-neon-blue disabled:opacity-50"
      >
        {pending ? "Opening…" : "Download"}
      </button>
      <span className="sr-only">{fileName}</span>
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </span>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    deleteDocument,
    INITIAL_FORM_STATE,
  );

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-slate-500 hover:text-rose-400 disabled:opacity-50"
      >
        {pending ? "…" : "Delete"}
      </button>
      {state.status === "error" && (
        <span className="text-xs text-rose-400">{state.message}</span>
      )}
    </form>
  );
}

export function DocumentList({
  documents,
  canManage,
  emptyLabel,
}: {
  documents: DocumentRow[];
  canManage: boolean;
  emptyLabel: string;
}) {
  if (documents.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-surface/40 p-8 text-center text-sm text-slate-500">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="rounded-xl border border-line bg-surface/60 p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-slate-200">{doc.title}</h3>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {DOCUMENT_CATEGORY_LABELS[doc.category]} · {doc.file_name} ·{" "}
                {formatBytes(doc.size_bytes)}
              </p>
              {doc.description && (
                <p className="mt-2 text-sm text-slate-400">{doc.description}</p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {canManage && (
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${VISIBILITY_STYLES[doc.visibility]}`}
                >
                  {VISIBILITY_LABELS[doc.visibility]}
                </span>
              )}
              <div className="flex items-center gap-3">
                <DownloadButton id={doc.id} fileName={doc.file_name} />
                {canManage && <DeleteButton id={doc.id} />}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
