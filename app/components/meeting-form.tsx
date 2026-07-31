"use client";

import { useActionState } from "react";

import { createMeeting } from "../lib/document-actions";
import { INITIAL_FORM_STATE } from "../lib/schemas";

const fieldClass =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-neon-blue focus:outline-none";

export function MeetingForm() {
  const [state, action, pending] = useActionState(
    createMeeting,
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
          placeholder="e.g. Q3 board meeting"
          className={`mt-1 ${fieldClass}`}
        />
        {state.errors?.title && (
          <p className="mt-1 text-xs text-rose-400">{state.errors.title[0]}</p>
        )}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs text-slate-500">Date</span>
          <input
            type="date"
            name="meets_on"
            required
            className={`mt-1 ${fieldClass}`}
          />
          {state.errors?.meets_on && (
            <p className="mt-1 text-xs text-rose-400">
              {state.errors.meets_on[0]}
            </p>
          )}
        </label>

        <label className="block">
          <span className="text-xs text-slate-500">
            Location <span className="text-slate-600">· optional</span>
          </span>
          <input
            type="text"
            name="location"
            placeholder="Remote, or an address"
            className={`mt-1 ${fieldClass}`}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs text-slate-500">
          Summary <span className="text-slate-600">· optional</span>
        </span>
        <textarea name="summary" rows={3} className={`mt-1 ${fieldClass}`} />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-line px-4 py-2 text-sm text-slate-300 hover:border-neon-blue hover:text-neon-blue disabled:opacity-50"
        >
          {pending ? "Saving…" : "Add meeting"}
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
