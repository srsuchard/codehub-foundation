"use client";

import { useActionState } from "react";

import { signIn } from "../lib/admin-actions";
import { INITIAL_FORM_STATE } from "../lib/schemas";
import { Field, FormMessage, SubmitButton } from "./form-fields";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, INITIAL_FORM_STATE);

  return (
    <form action={action} className="grid gap-5">
      <Field name="email" label="Email" type="email" state={state} required />
      <Field
        name="password"
        label="Password"
        type="password"
        state={state}
        required
      />
      <FormMessage state={state} />
      <div>
        <SubmitButton pending={pending}>Sign in</SubmitButton>
      </div>
    </form>
  );
}
