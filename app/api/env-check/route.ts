/**
 * TEMPORARY diagnostic — remove once form submissions are confirmed working.
 *
 * Reports only whether the Supabase env vars are visible to the running
 * server, plus their lengths and a checksum-ish prefix/suffix mask. It never
 * returns the values themselves.
 */
export const dynamic = "force-dynamic";

function describe(value: string | undefined) {
  if (value === undefined) return { set: false };
  return {
    set: true,
    length: value.length,
    hasWhitespace: /\s/.test(value),
    startsWith: value.slice(0, 8),
  };
}

export async function GET() {
  return Response.json({
    SUPABASE_URL: describe(process.env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: describe(process.env.SUPABASE_SERVICE_ROLE_KEY),
    // Which Supabase-ish names DID make it through, in case of a typo.
    supabaseLikeNames: Object.keys(process.env).filter((k) =>
      k.toUpperCase().includes("SUPA"),
    ),
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}
