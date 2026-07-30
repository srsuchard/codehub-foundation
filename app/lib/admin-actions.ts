"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createAuthClient, isAdminEmail } from "./auth";
import type { FormState } from "./schemas";

const loginSchema = z.object({
  email: z.email("Enter a valid email address").trim(),
  password: z.string().min(1, "Enter your password"),
});

export async function signIn(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  // Check the allowlist before touching Supabase, so a non-admin can't use
  // this endpoint to probe which accounts exist.
  if (!isAdminEmail(parsed.data.email)) {
    return { status: "error", message: "Invalid email or password." };
  }

  const supabase = await createAuthClient({ canSetCookies: true });

  if (!supabase) {
    return {
      status: "error",
      message: "Admin sign-in isn't configured yet.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Deliberately vague: don't reveal whether the account exists.
    return { status: "error", message: "Invalid email or password." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createAuthClient({ canSetCookies: true });
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
