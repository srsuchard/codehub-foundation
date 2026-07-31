"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAuthClient, getSessionProfile, isMfaPending } from "./auth";
import { isStaff, PORTAL_ROLES } from "./roles";
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

  const supabase = await createAuthClient({ canSetCookies: true });

  if (!supabase) {
    return { status: "error", message: "Admin sign-in isn't configured yet." };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  // Deliberately vague: never reveal whether an account exists.
  if (error) {
    return { status: "error", message: "Invalid email or password." };
  }

  // Authentication succeeded — now check authorization. Supabase permits public
  // sign-up, so a valid login says nothing about whether this person may see
  // applicant data. Anyone without a staff role is signed straight back out.
  const profile = await getSessionProfile();

  // Board members belong here too, but they land on the portal rather than the
  // staff dashboard, which their session couldn't read anyway.
  if (!profile || !PORTAL_ROLES.includes(profile.role)) {
    await supabase.auth.signOut();
    return { status: "error", message: "Invalid email or password." };
  }

  if (await isMfaPending()) redirect("/admin/verify");

  redirect(isStaff(profile.role) ? "/admin" : "/admin/board");
}

export async function signOut() {
  const supabase = await createAuthClient({ canSetCookies: true });
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

const roleSchema = z.object({
  userId: z.uuid(),
  role: z.enum(["admin", "staff", "board_member", "volunteer", "student"]),
});

/**
 * Change someone's role. Admin-only, and enforced twice: here, and again by the
 * database trigger + RLS policy — this runs on the user's own session, so a bug
 * in this check still can't get past Postgres.
 */
export async function updateRole(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const actor = await getSessionProfile();

  if (actor?.role !== "admin") {
    return { status: "error", message: "Only admins can change roles." };
  }

  const parsed = roleSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { status: "error", message: "That role isn't valid." };
  }

  if (parsed.data.userId === actor.id) {
    return {
      status: "error",
      message: "You can't change your own role — ask another admin.",
    };
  }

  const supabase = await createAuthClient({ canSetCookies: true });

  if (!supabase) {
    return { status: "error", message: "Not configured." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.userId);

  if (error) {
    return { status: "error", message: `Couldn't update role: ${error.message}` };
  }

  revalidatePath("/admin/team");
  return { status: "success", message: "Role updated." };
}
