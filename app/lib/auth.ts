import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Profile } from "./roles";


export function isAuthConfigured(): boolean {
  return getAuthConfigStatus().every((item) => item.ok);
}

/** Per-variable setup status for the sign-in screen. Presence only, no values. */
export function getAuthConfigStatus() {
  return [
    {
      name: "SUPABASE_URL",
      ok: Boolean(process.env.SUPABASE_URL),
      hint: "Supabase → Settings → API → Project URL",
    },
    {
      name: "SUPABASE_PUBLISHABLE_KEY",
      ok: Boolean(process.env.SUPABASE_PUBLISHABLE_KEY),
      hint: "Supabase → Settings → API → publishable key (sb_publishable_…)",
    },
  ];
}

/**
 * Auth client bound to the request's cookies, using the publishable key.
 *
 * Every read through this client is subject to row-level security, so the
 * database — not app code — decides what the signed-in user can see. That is
 * the point: an authorization bug in a route can no longer leak applicant data.
 *
 * `canSetCookies` is false in Server Components (Next only permits cookie
 * writes from Server Actions and Route Handlers).
 */
export async function createAuthClient({
  canSetCookies = false,
}: { canSetCookies?: boolean } = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        if (!canSetCookies) return;
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}

/**
 * Whether this session still owes a 2FA step.
 *
 * `nextLevel` is aal2 only when the user has a verified factor, so this is
 * false for anyone who hasn't enrolled. Row-level security enforces the same
 * rule; this exists so the UI can redirect instead of showing empty pages.
 */
export async function isMfaPending(): Promise<boolean> {
  const supabase = await createAuthClient();
  if (!supabase) return false;

  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (!data) return false;

  return data.nextLevel === "aal2" && data.currentLevel !== "aal2";
}

/** The signed-in user's profile, or null. Role comes from the database. */
export async function getSessionProfile(): Promise<Profile | null> {
  const supabase = await createAuthClient();
  if (!supabase) return null;

  // getUser() revalidates with Supabase; getSession() alone trusts the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
}
