"use client";

import { useActionState } from "react";

import { signOut } from "../lib/admin-actions";
import { verifyChallenge } from "../lib/mfa-actions";
import { INITIAL_FORM_STATE } from "../lib/schemas";

export function MfaChallenge() {
  const [state, action, pending] = useActionState(
    verifyChallenge,
    INITIAL_FORM_STATE,
  );

  return (
    <>
      <form action={action} className="grid gap-4">
        <label className="block">
          <span className="text-xs text-slate-500">Authentication code</span>
          <input
            type="text"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            autoFocus
            placeholder="000000"
            className="mt-2 w-full rounded-lg border border-line bg-ink px-3 py-3 text-center font-mono text-2xl tracking-[0.4em] text-slate-100 focus:border-neon-blue focus:outline-none"
          />
        </label>

        {state.status === "error" && (
          <p aria-live="polite" className="text-sm text-rose-400">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-gradient-to-r from-neon-blue to-sky-500 px-5 py-3 font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Verifying…" : "Verify"}
        </button>
      </form>

      <form action={signOut} className="mt-5 text-center">
        <button
          type="submit"
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          Sign out instead
        </button>
      </form>
    </>
  );
}
