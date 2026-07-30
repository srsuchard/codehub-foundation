"use client";

import { useActionState } from "react";

import { createProgram, updateProgram } from "../lib/program-actions";
import {
  PROGRAM_KIND_LABELS,
  PROGRAM_KINDS,
  PROGRAM_STATUS_LABELS,
  PROGRAM_STATUSES,
  type Program,
} from "../lib/programs";
import { INITIAL_FORM_STATE } from "../lib/schemas";

const fieldClass =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-neon-blue focus:outline-none";

function Labelled({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-slate-500">
        {label}
        {hint && <span className="text-slate-600"> · {hint}</span>}
      </span>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-rose-400">{error[0]}</p>}
    </label>
  );
}

export function ProgramForm({ program }: { program?: Program }) {
  const [state, action, pending] = useActionState(
    program ? updateProgram : createProgram,
    INITIAL_FORM_STATE,
  );

  return (
    <form action={action} className="grid gap-4">
      {program && <input type="hidden" name="id" value={program.id} />}

      <Labelled label="Program name" error={state.errors?.name}>
        <input
          type="text"
          name="name"
          required
          defaultValue={program?.name ?? ""}
          placeholder="e.g. Intro to Python — Spring cohort"
          className={fieldClass}
        />
      </Labelled>

      <div className="grid gap-4 sm:grid-cols-2">
        <Labelled label="Type">
          <select
            name="kind"
            defaultValue={program?.kind ?? "class"}
            className={fieldClass}
          >
            {PROGRAM_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {PROGRAM_KIND_LABELS[kind]}
              </option>
            ))}
          </select>
        </Labelled>

        <Labelled label="Status">
          <select
            name="status"
            defaultValue={program?.status ?? "draft"}
            className={fieldClass}
          >
            {PROGRAM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {PROGRAM_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </Labelled>
      </div>

      <Labelled label="Summary" hint="optional">
        <textarea
          name="summary"
          rows={3}
          defaultValue={program?.summary ?? ""}
          className={fieldClass}
        />
      </Labelled>

      <div className="grid gap-4 sm:grid-cols-2">
        <Labelled label="Instructor" hint="optional">
          <input
            type="text"
            name="instructor"
            defaultValue={program?.instructor ?? ""}
            className={fieldClass}
          />
        </Labelled>

        <Labelled
          label="Capacity"
          hint="optional"
          error={state.errors?.capacity}
        >
          <input
            type="number"
            name="capacity"
            min={1}
            defaultValue={program?.capacity ?? ""}
            className={fieldClass}
          />
        </Labelled>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Labelled label="Starts" hint="optional">
          <input
            type="date"
            name="starts_on"
            defaultValue={program?.starts_on ?? ""}
            className={fieldClass}
          />
        </Labelled>

        <Labelled label="Ends" hint="optional">
          <input
            type="date"
            name="ends_on"
            defaultValue={program?.ends_on ?? ""}
            className={fieldClass}
          />
        </Labelled>
      </div>

      <Labelled label="Schedule" hint="optional, e.g. Tuesdays 4–6pm">
        <input
          type="text"
          name="schedule"
          defaultValue={program?.schedule ?? ""}
          className={fieldClass}
        />
      </Labelled>

      <div className="grid gap-4 sm:grid-cols-2">
        <Labelled label="Location" hint="optional">
          <input
            type="text"
            name="location"
            defaultValue={program?.location ?? ""}
            placeholder="Remote, or a venue"
            className={fieldClass}
          />
        </Labelled>

        <Labelled label="Materials link" hint="optional">
          <input
            type="url"
            name="materials_url"
            defaultValue={program?.materials_url ?? ""}
            placeholder="https://…"
            className={fieldClass}
          />
        </Labelled>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-gradient-to-r from-neon-blue to-sky-500 px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : program ? "Save changes" : "Create program"}
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
