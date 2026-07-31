"use client";

import { useActionState } from "react";

import { uploadDocument } from "../lib/document-actions";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_LABELS,
  MAX_UPLOAD_BYTES,
  VISIBILITIES,
  VISIBILITY_LABELS,
  type BoardMeeting,
} from "../lib/documents";
import { INITIAL_FORM_STATE } from "../lib/schemas";

const fieldClass =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-neon-blue focus:outline-none";

export function DocumentUpload({ meetings }: { meetings: BoardMeeting[] }) {
  const [state, action, pending] = useActionState(
    uploadDocument,
    INITIAL_FORM_STATE,
  );

  return (
    <form action={action} className="grid gap-4">
      <label className="block">
        <span className="text-xs text-slate-500">Title</span>
        <input
          type="text"
          name="title"
          required
          className={`mt-1 ${fieldClass}`}
          placeholder="e.g. Bylaws — adopted March 2026"
        />
        {state.errors?.title && (
          <p className="mt-1 text-xs text-rose-400">{state.errors.title[0]}</p>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs text-slate-500">Category</span>
          <select name="category" defaultValue="policy" className={`mt-1 ${fieldClass}`}>
            {DOCUMENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {DOCUMENT_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs text-slate-500">Who can see it</span>
          <select
            name="visibility"
            defaultValue="board"
            className={`mt-1 ${fieldClass}`}
          >
            {VISIBILITIES.map((visibility) => (
              <option key={visibility} value={visibility}>
                {VISIBILITY_LABELS[visibility]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {meetings.length > 0 && (
        <label className="block">
          <span className="text-xs text-slate-500">
            Link to a meeting <span className="text-slate-600">· optional</span>
          </span>
          <select name="meeting_id" defaultValue="" className={`mt-1 ${fieldClass}`}>
            <option value="">Not meeting-specific</option>
            {meetings.map((meeting) => (
              <option key={meeting.id} value={meeting.id}>
                {meeting.title}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="text-xs text-slate-500">
          Description <span className="text-slate-600">· optional</span>
        </span>
        <textarea name="description" rows={2} className={`mt-1 ${fieldClass}`} />
      </label>

      <label className="block">
        <span className="text-xs text-slate-500">
          File{" "}
          <span className="text-slate-600">
            · up to {MAX_UPLOAD_BYTES / (1024 * 1024)} MB
          </span>
        </span>
        <input
          type="file"
          name="file"
          required
          className="mt-1 w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border file:border-line file:bg-surface file:px-3 file:py-2 file:text-sm file:text-slate-300 hover:file:border-neon-blue"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-gradient-to-r from-neon-blue to-sky-500 px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Uploading…" : "Upload"}
        </button>
        {state.status !== "idle" && (
          <span
            aria-live="polite"
            className={`text-sm ${
              state.status === "success" ? "text-neon-green" : "text-rose-400"
            }`}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
