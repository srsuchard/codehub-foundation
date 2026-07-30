import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Admin access is an explicit allowlist, not "any signed-in user".
 *
 * Supabase projects allow public sign-up by default, so authentication alone
 * would let anyone who registers reach applicant data. The allowlist is the
 * actual authorization boundary.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export function isAuthConfigured(): boolean {
  const status = getAuthConfigStatus();
  return status.every((item) => item.ok);
}

/**
 * Per-variable setup status for the sign-in screen. Reports presence only —
 * never values. The names themselves are already public in .env.example.
 */
export function getAuthConfigStatus() {
  const adminCount = getAdminEmails().length;

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
    {
      name: "ADMIN_EMAILS",
      ok: adminCount > 0,
      hint: "Comma-separated emails allowed to sign in",
    },
  ];
}

/**
 * Auth client bound to the request's cookies. Uses the publishable key — the
 * user's own session decides what they can reach, never the service role.
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

/** Returns the signed-in user only if they're on the admin allowlist. */
export async function getAdminUser() {
  const supabase = await createAuthClient();
  if (!supabase) return null;

  // getUser() revalidates the token with Supabase; getSession() alone trusts
  // whatever is in the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}
