# CodeHub Foundation

Website and internal admin platform for CodeHub Foundation — free coding
education, technology mentorship, and real-world projects for students.

Built with Next.js 16 (App Router), Tailwind CSS v4, and Supabase.

## Structure

| Path                  | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `app/lib/site.ts`     | Site copy — programs, board, events, projects, impact |
| `app/*/page.tsx`      | Public pages                                          |
| `app/admin/`          | Staff area (authentication required)                  |
| `app/lib/`            | Auth, roles, Server Actions, validation schemas       |
| `supabase/*.sql`      | Database schema, row-level security, and triggers     |

Content lives in `app/lib/site.ts` — the `BOARD`, `EVENTS`, `PROJECTS`, and
`IMPACT` arrays are the ones that change as the foundation grows. Edit those
rather than the JSX.

## Admin

`/admin` is staff-only: submissions, volunteer screening, programs, roles, and
an audit log. Access is decided by the `role` column on `public.profiles` and
enforced by row-level security, so the database — not app code — controls who
sees what.

Volunteer screening follows California AB 506: Live Scan (DOJ + FBI), mandated
reporter training, and abuse prevention policy acknowledgement. A database
trigger refuses to assign a volunteer to a program until all three are
recorded.

## Configuration

Environment variables are documented in `.env.example`. The service role key
must never be exposed to the browser; `app/lib/supabase.ts` imports
`server-only` so an accidental client import fails the build.

## Deployment

Deployed on Vercel from `main`. Pushes to `main` trigger a production build.
Database migrations in `supabase/` are applied manually, in filename order.

## Contact

hello@codehubfoundation.org
