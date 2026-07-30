"use client";

import type { FormState } from "../lib/schemas";

const inputClass =
  "w-full rounded-lg border border-line bg-ink/60 px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue";

function FieldShell({
  name,
  label,
  hint,
  state,
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  state: FormState;
  children: React.ReactNode;
}) {
  const errors = state.errors?.[name];

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      <div className="mt-2">{children}</div>
      {errors && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-rose-400">
          {errors[0]}
        </p>
      )}
    </div>
  );
}

type BaseProps = {
  name: string;
  label: string;
  hint?: string;
  state: FormState;
  required?: boolean;
};

export function Field({
  type = "text",
  placeholder,
  ...props
}: BaseProps & { type?: string; placeholder?: string }) {
  return (
    <FieldShell {...props}>
      <input
        id={props.name}
        name={props.name}
        type={type}
        required={props.required}
        placeholder={placeholder}
        aria-invalid={props.state.errors?.[props.name] ? true : undefined}
        aria-describedby={
          props.state.errors?.[props.name] ? `${props.name}-error` : undefined
        }
        className={inputClass}
      />
    </FieldShell>
  );
}

export function TextArea({
  rows = 4,
  placeholder,
  ...props
}: BaseProps & { rows?: number; placeholder?: string }) {
  return (
    <FieldShell {...props}>
      <textarea
        id={props.name}
        name={props.name}
        rows={rows}
        required={props.required}
        placeholder={placeholder}
        aria-invalid={props.state.errors?.[props.name] ? true : undefined}
        aria-describedby={
          props.state.errors?.[props.name] ? `${props.name}-error` : undefined
        }
        className={inputClass}
      />
    </FieldShell>
  );
}

export function Select({
  options,
  ...props
}: BaseProps & { options: string[] }) {
  return (
    <FieldShell {...props}>
      <select
        id={props.name}
        name={props.name}
        required={props.required}
        defaultValue=""
        aria-invalid={props.state.errors?.[props.name] ? true : undefined}
        className={inputClass}
      >
        <option value="" disabled>
          Choose one…
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Hidden field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="hidden">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gradient-to-r from-neon-purple to-fuchsia-500 px-7 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Sending…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.status === "idle") return null;

  return (
    <p
      aria-live="polite"
      className={`rounded-lg border px-4 py-3 text-sm ${
        state.status === "success"
          ? "border-neon-green/40 bg-neon-green/10 text-neon-green"
          : "border-rose-500/40 bg-rose-500/10 text-rose-300"
      }`}
    >
      {state.message}
    </p>
  );
}
