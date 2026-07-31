"use client";

import Image from "next/image";
import { useActionState, useState, useTransition } from "react";

import {
  confirmEnrollment,
  removeFactor,
  startEnrollment,
} from "../lib/mfa-actions";
import { INITIAL_FORM_STATE } from "../lib/schemas";

const codeInputClass =
  "w-40 rounded-lg border border-line bg-ink px-3 py-2 text-center font-mono text-lg tracking-[0.3em] text-slate-100 focus:border-neon-blue focus:outline-none";

type Enrollment = { factorId: string; qr: string; secret: string };

export function MfaSetup({
  enrolled,
  factorId,
}: {
  enrolled: boolean;
  factorId?: string;
}) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [starting, startTransition] = useTransition();

  const [confirmState, confirmAction, confirming] = useActionState(
    confirmEnrollment,
    INITIAL_FORM_STATE,
  );
  const [removeState, removeAction, removing] = useActionState(
    removeFactor,
    INITIAL_FORM_STATE,
  );

  function begin() {
    setStartError(null);
    startTransition(async () => {
      const result = await startEnrollment();
      if ("error" in result) {
        setStartError(result.error);
        return;
      }
      setEnrollment(result);
    });
  }

  if (enrolled && confirmState.status !== "success") {
    return (
      <div>
        <p className="flex items-center gap-3 text-sm">
          <span aria-hidden className="text-neon-green">
            ✓
          </span>
          <span className="text-slate-300">
            Two-factor authentication is <strong>on</strong> for this account.
          </span>
        </p>
        <p className="mt-3 text-sm text-slate-500">
          You&apos;ll be asked for a code from your authenticator app each time
          you sign in.
        </p>

        <form action={removeAction} className="mt-6 flex flex-wrap items-center gap-3">
          <input type="hidden" name="factorId" value={factorId ?? ""} />
          <button
            type="submit"
            disabled={removing}
            className="rounded-lg border border-line px-4 py-2 text-sm text-slate-400 hover:border-rose-500/60 hover:text-rose-300 disabled:opacity-50"
          >
            {removing ? "Removing…" : "Turn off two-factor"}
          </button>
          {removeState.status === "error" && (
            <span className="text-sm text-rose-400">{removeState.message}</span>
          )}
        </form>
      </div>
    );
  }

  if (confirmState.status === "success") {
    return (
      <p className="flex items-center gap-3 text-sm">
        <span aria-hidden className="text-neon-green">
          ✓
        </span>
        <span className="text-neon-green">{confirmState.message}</span>
      </p>
    );
  }

  if (!enrollment) {
    return (
      <div>
        <p className="text-sm text-slate-400">
          Protect this account with a code from an authenticator app — 1Password,
          Google Authenticator, Authy, or your password manager.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={begin}
            disabled={starting}
            className="rounded-lg bg-gradient-to-r from-neon-blue to-sky-500 px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {starting ? "Setting up…" : "Set up two-factor"}
          </button>
          {startError && (
            <span className="text-sm text-rose-400">{startError}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="grid gap-5 text-sm text-slate-400">
        <li>
          <span className="text-slate-300">1. Scan this with your app</span>
          <div className="mt-3 w-fit rounded-xl bg-white p-3">
            {/* Supabase returns the QR as a data: URI. */}
            <Image
              src={enrollment.qr}
              alt="QR code for two-factor setup"
              width={180}
              height={180}
              unoptimized
            />
          </div>
        </li>
        <li>
          <span className="text-slate-300">
            Or enter this key manually
          </span>
          <code className="mt-2 block w-fit rounded-lg border border-line bg-ink px-3 py-2 font-mono text-xs break-all text-neon-blue">
            {enrollment.secret}
          </code>
        </li>
        <li>
          <span className="text-slate-300">2. Enter the 6-digit code</span>
          <form action={confirmAction} className="mt-3 flex flex-wrap items-center gap-3">
            <input type="hidden" name="factorId" value={enrollment.factorId} />
            <input
              type="text"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              placeholder="000000"
              className={codeInputClass}
            />
            <button
              type="submit"
              disabled={confirming}
              className="rounded-lg border border-line px-4 py-2 text-sm text-slate-300 hover:border-neon-green hover:text-neon-green disabled:opacity-50"
            >
              {confirming ? "Verifying…" : "Verify and turn on"}
            </button>
          </form>
          {confirmState.status === "error" && (
            <p className="mt-2 text-sm text-rose-400">{confirmState.message}</p>
          )}
        </li>
      </ol>

      <p className="mt-6 text-xs text-slate-600">
        Save the key somewhere safe. If you lose both your authenticator and the
        key, an admin has to remove the factor in Supabase before you can sign
        in again.
      </p>
    </div>
  );
}
