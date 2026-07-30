# CodeHub Foundation

Website for CodeHub Foundation — free coding education, technology mentorship,
and real-world projects for students.

Built with Next.js 16 (App Router) and Tailwind CSS v4. The site is fully
static: the mobile nav uses a CSS-only `<details>` disclosure, so no client
JavaScript is shipped.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # Next 16 no longer lints during `next build` — run this separately
```

## Structure

| Path                            | Purpose                                     |
| ------------------------------- | ------------------------------------------- |
| `app/page.tsx`                  | Homepage — all sections and their content   |
| `app/components/site-header.tsx`| Sticky nav                                  |
| `app/layout.tsx`                | Root layout, fonts, site metadata           |
| `app/globals.css`               | Tailwind import, brand color tokens         |
| `app/robots.ts`, `app/sitemap.ts` | Generated `robots.txt` and `sitemap.xml`  |

Section copy lives in the `PROGRAMS`, `STATS`, `MENTOR_EXPECTATIONS`, and
`SPONSOR_TIERS` arrays at the top of `app/page.tsx` — edit those rather than
the JSX below them.

## Configuration

`NEXT_PUBLIC_SITE_URL` sets the canonical origin used by metadata, `robots.txt`,
and `sitemap.xml`. It defaults to `https://codehubfoundation.org`. Set it on
preview deployments so they don't advertise the production domain.

## Deployment

Deployed on Vercel from `main`. Pushes to `main` trigger a production build.

## Contact

hello@codehubfoundation.org
