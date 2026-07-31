"use client";

import { useActionState } from "react";

import { INITIAL_FORM_STATE } from "../lib/schemas";
import { updateVolunteer } from "../lib/volunteer-actions";
import {
  ab506Checklist,
  LIVE_SCAN_LABELS,
  LIVE_SCAN_STATUSES,
  VOLUNTEER_STATUS_LABELS,
  VOLUNTEER_STATUS_STYLES,
  VOLUNTEER_STATUSES,
  type Volunteer,
} from "../lib/volunteers";

const fieldClass =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-slate-200 focus:border-neon-blue focus:outline-none";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" });
}

export function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const [state, action, pending] = useActionState(
    updateVolunteer,
    INITIAL_FORM_STATE,
  );

  const checklist = ab506Checklist(volunteer);

  return (
    <article className="rounded-2xl border border-line bg-surface/60 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">{volunteer.name}</h3>
          <a
            href={`mailto:${volunteer.email}`}
            className="text-sm text-neon-blue hover:underline"
          >
            {volunteer.email}
          </a>
          <p className="mt-1 text-sm text-slate-400">
            {volunteer.profession} · {volunteer.availability}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`rounded-full border px-3 py-1 font-mono text-xs ${VOLUNTEER_STATUS_STYLES[volunteer.status]}`}
          >
            {VOLUNTEER_STATUS_LABELS[volunteer.status]}
          </span>
          <span
            className={`rounded-full border px-3 py-1 font-mono text-xs ${
              volunteer.ab506_complete
                ? "border-neon-green/40 bg-neon-green/10 text-neon-green"
                : "border-amber-500/40 bg-amber-500/10 text-amber-300"
            }`}
          >
            {volunteer.ab506_complete
              ? "AB 506 complete"
              : "AB 506 incomplete"}
          </span>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">Skills</dt>
          <dd className="mt-1 text-slate-300">{volunteer.skills}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Applied</dt>
          <dd className="mt-1 text-slate-300">
            {formatDate(volunteer.created_at)}
          </dd>
        </div>
        {volunteer.experience && (
          <div className="sm:col-span-2">
            <dt className="text-xs text-slate-500">Notes from applicant</dt>
            <dd className="mt-1 text-slate-300">{volunteer.experience}</dd>
          </div>
        )}
      </dl>

      {/* Screening checklist — the gate on being placed with students. */}
      <ul className="mt-5 grid gap-2 rounded-xl border border-line bg-ink/60 p-4">
        {checklist.map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-sm">
            <span
              aria-hidden
              className={item.done ? "text-neon-green" : "text-slate-600"}
            >
              {item.done ? "✓" : "○"}
            </span>
            <span className={item.done ? "text-slate-300" : "text-slate-500"}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <form
        action={action}
        className="mt-6 grid gap-4 border-t border-line pt-6"
      >
        <input type="hidden" name="id" value={volunteer.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs text-slate-500">Pipeline status</span>
            <select
              name="status"
              defaultValue={volunteer.status}
              className={`mt-1 ${fieldClass}`}
            >
              {VOLUNTEER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {VOLUNTEER_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-slate-500">Live Scan</span>
            <select
              name="live_scan"
              defaultValue={volunteer.live_scan}
              className={`mt-1 ${fieldClass}`}
            >
              {LIVE_SCAN_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {LIVE_SCAN_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-xs text-slate-500">Live Scan submitted</span>
            <input
              type="date"
              name="live_scan_submitted_on"
              defaultValue={volunteer.live_scan_submitted_on ?? ""}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">Cleared on</span>
            <input
              type="date"
              name="live_scan_cleared_on"
              defaultValue={volunteer.live_scan_cleared_on ?? ""}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">
              ATI number
              <span className="text-slate-600"> · tracking only</span>
            </span>
            <input
              type="text"
              name="live_scan_ati"
              defaultValue={volunteer.live_scan_ati ?? ""}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs text-slate-500">
              Mandated reporter training
            </span>
            <input
              type="date"
              name="mandated_reporter_training_on"
              defaultValue={volunteer.mandated_reporter_training_on ?? ""}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-500">
              Abuse policy acknowledged
            </span>
            <input
              type="date"
              name="abuse_policy_acknowledged_on"
              defaultValue={volunteer.abuse_policy_acknowledged_on ?? ""}
              className={`mt-1 ${fieldClass}`}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs text-slate-500">
            Internal notes{" "}
            <span className="text-slate-600">(not visible to the applicant)</span>
          </span>
          <textarea
            name="internal_notes"
            rows={3}
            defaultValue={volunteer.internal_notes ?? ""}
            className={`mt-1 ${fieldClass}`}
          />
        </label>

        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            name="training_completed"
            defaultChecked={Boolean(volunteer.training_completed_at)}
            className="size-4 rounded border-line bg-ink accent-neon-green"
          />
          CodeHub onboarding complete
          {volunteer.training_completed_at && (
            <span className="font-mono text-xs text-slate-500">
              {formatDate(volunteer.training_completed_at)}
            </span>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-line px-4 py-2 text-sm text-slate-300 hover:border-neon-blue hover:text-neon-blue disabled:opacity-50"
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
          {volunteer.updated_at && (
            <span className="ml-auto font-mono text-xs text-slate-600">
              updated {formatDate(volunteer.updated_at)}
            </span>
          )}
        </div>
      </form>
    </article>
  );
}
