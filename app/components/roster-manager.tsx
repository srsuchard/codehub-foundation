"use client";

import { useActionState } from "react";

import { INITIAL_FORM_STATE, type FormState } from "../lib/schemas";

export type RosterPerson = { id: string; name: string; email: string };

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

function RemoveButton({
  programId,
  personId,
  action,
}: {
  programId: string;
  personId: string;
  action: Action;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_FORM_STATE,
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="programId" value={programId} />
      <input type="hidden" name="personId" value={personId} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs text-slate-500 hover:text-rose-400 disabled:opacity-50"
      >
        {pending ? "…" : "Remove"}
      </button>
      {state.status === "error" && (
        <span className="text-xs text-rose-400">{state.message}</span>
      )}
    </form>
  );
}

/**
 * Roster for one side of a program — students or volunteers. `available` is
 * everyone not already on it, so the picker can't produce a duplicate (the
 * unique constraint is still the real guard).
 */
export function RosterManager({
  programId,
  title,
  emptyLabel,
  members,
  available,
  addAction,
  removeAction,
  addLabel,
}: {
  programId: string;
  title: string;
  emptyLabel: string;
  members: RosterPerson[];
  available: RosterPerson[];
  addAction: Action;
  removeAction: Action;
  addLabel: string;
}) {
  const [state, formAction, pending] = useActionState(
    addAction,
    INITIAL_FORM_STATE,
  );

  return (
    <section className="rounded-2xl border border-line bg-surface/60 p-6">
      <h2 className="text-lg font-bold">
        {title}
        <span className="ml-3 font-mono text-sm font-normal text-slate-500">
          {members.length}
        </span>
      </h2>

      {members.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {members.map((person) => (
            <li
              key={person.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div>
                <p className="text-sm text-slate-200">{person.name}</p>
                <a
                  href={`mailto:${person.email}`}
                  className="text-xs text-neon-blue hover:underline"
                >
                  {person.email}
                </a>
              </div>
              <RemoveButton
                programId={programId}
                personId={person.id}
                action={removeAction}
              />
            </li>
          ))}
        </ul>
      )}

      {available.length > 0 ? (
        <form
          action={formAction}
          className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-5"
        >
          <input type="hidden" name="programId" value={programId} />
          <select
            name="personId"
            defaultValue=""
            required
            className="min-w-0 flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm text-slate-200 focus:border-neon-blue focus:outline-none"
          >
            <option value="" disabled>
              Choose someone…
            </option>
            {available.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} — {person.email}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-line px-4 py-2 text-sm text-slate-300 hover:border-neon-green hover:text-neon-green disabled:opacity-50"
          >
            {pending ? "Adding…" : addLabel}
          </button>
          {state.status !== "idle" && (
            <span
              className={`w-full text-xs ${
                state.status === "success" ? "text-neon-green" : "text-rose-400"
              }`}
            >
              {state.message}
            </span>
          )}
        </form>
      ) : (
        <p className="mt-5 border-t border-line pt-5 text-xs text-slate-600">
          Nobody left to add.
        </p>
      )}
    </section>
  );
}
