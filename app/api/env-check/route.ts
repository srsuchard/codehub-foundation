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
    // Every custom env var NAME visible at runtime (no values), so a
    // misnamed variable is obvious. Vercel/system names are filtered out.
    customEnvNames: Object.keys(process.env)
      .filter(
        (k) =>
          !/^(VERCEL|NEXT_|NODE|npm_|PATH$|HOME$|PWD$|LANG|TERM|SHLVL|_$|AWS_|LAMBDA_|TZ$|HOSTNAME$|EDGE_)/.test(
            k,
          ),
      )
      .sort(),
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}
