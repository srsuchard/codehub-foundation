"use client";

import { useActionState } from "react";

import { updateRole } from "../lib/admin-actions";
import { ROLE_LABELS, type AppRole } from "../lib/roles";
import { INITIAL_FORM_STATE } from "../lib/schemas";

const ROLES = Object.keys(ROLE_LABELS) as AppRole[];

export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: AppRole;
}) {
  const [state, action, pending] = useActionState(
    updateRole,
    INITIAL_FORM_STATE,
  );

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        disabled={pending}
        className="rounded-lg border border-line bg-ink px-3 py-1.5 text-sm text-slate-200 focus:border-neon-blue focus:outline-none"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate-300 hover:border-neon-blue hover:text-neon-blue disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {state.status !== "idle" && (
        <span
          aria-live="polite"
          className={`text-xs ${
            state.status === "success" ? "text-neon-green" : "text-rose-400"
          }`}
        >
          {state.message}
        </span>
      )}
    </form>
  );
}
