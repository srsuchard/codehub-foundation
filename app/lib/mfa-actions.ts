"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAuthClient } from "./auth";
import type { FormState } from "./schemas";

const codeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter the 6-digit code from your app");

/**
 * Begin TOTP enrolment. Returns a QR code to scan plus the secret for manual
 * entry. The factor stays `unverified` until a code is confirmed, so an
 * abandoned enrolment never gates anyone out.
 */
export async function startEnrollment(): Promise<
  { factorId: string; qr: string; secret: string } | { error: string }
> {
  const supabase = await createAuthClient({ canSetCookies: true });
  if (!supabase) return { error: "Not configured." };

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: `Authenticator ${new Date().toISOString().slice(0, 10)}`,
  });

  if (error || !data) {
    return { error: error?.message ?? "Couldn't start enrolment." };
  }

  return {
    factorId: data.id,
    qr: data.totp.qr_code,
    secret: data.totp.secret,
  };
}

/** Confirm enrolment with a code, which marks the factor verified. */
export async function confirmEnrollment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createAuthClient({ canSetCookies: true });
  if (!supabase) return { status: "error", message: "Not configured." };

  const factorId = z.string().min(1).safeParse(formData.get("factorId"));
  const code = codeSchema.safeParse(formData.get("code"));

  if (!factorId.success || !code.success) {
    return {
      status: "error",
      message: code.success ? "Enrolment expired — start again." : code.error.issues[0].message,
    };
  }

  const challenge = await supabase.auth.mfa.challenge({
    factorId: factorId.data,
  });

  if (challenge.error || !challenge.data) {
    return { status: "error", message: challenge.error?.message ?? "Failed." };
  }

  const { error } = await supabase.auth.mfa.verify({
    factorId: factorId.data,
    challengeId: challenge.data.id,
    code: code.data,
  });

  if (error) {
    return { status: "error", message: "That code didn't match. Try again." };
  }

  revalidatePath("/admin/security");
  return { status: "success", message: "Two-factor authentication is on." };
}

/** Step up an existing session to aal2 at sign-in. */
export async function verifyChallenge(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createAuthClient({ canSetCookies: true });
  if (!supabase) return { status: "error", message: "Not configured." };

  const code = codeSchema.safeParse(formData.get("code"));
  if (!code.success) {
    return { status: "error", message: code.error.issues[0].message };
  }

  const { data: factors, error: listError } =
    await supabase.auth.mfa.listFactors();

  const totp = factors?.totp?.[0];

  if (listError || !totp) {
    return { status: "error", message: "No authenticator is set up." };
  }

  const challenge = await supabase.auth.mfa.challenge({ factorId: totp.id });

  if (challenge.error || !challenge.data) {
    return { status: "error", message: "Couldn't start verification." };
  }

  const { error } = await supabase.auth.mfa.verify({
    factorId: totp.id,
    challengeId: challenge.data.id,
    code: code.data,
  });

  if (error) {
    return { status: "error", message: "That code didn't match. Try again." };
  }

  redirect("/admin");
}

/**
 * Remove a factor. Requires the session to already be at aal2 — otherwise a
 * stolen password alone could switch 2FA off, which would defeat the point.
 */
export async function removeFactor(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createAuthClient({ canSetCookies: true });
  if (!supabase) return { status: "error", message: "Not configured." };

  const { data: aal } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (aal?.currentLevel !== "aal2") {
    return {
      status: "error",
      message: "Verify with your authenticator first, then remove it.",
    };
  }

  const factorId = z.string().min(1).safeParse(formData.get("factorId"));
  if (!factorId.success) {
    return { status: "error", message: "Unknown factor." };
  }

  const { error } = await supabase.auth.mfa.unenroll({
    factorId: factorId.data,
  });

  if (error) {
    return { status: "error", message: `Couldn't remove: ${error.message}` };
  }

  revalidatePath("/admin/security");
  return { status: "success", message: "Two-factor authentication is off." };
}
