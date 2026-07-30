import Link from "next/link";

import { CONTACT_EMAIL } from "../lib/site";

const FOOTER_GROUPS = [
  {
    heading: "Explore",
    links: [
      { href: "/about", label: "About" },
      { href: "/programs", label: "Programs" },
      { href: "/events", label: "Events" },
      { href: "/projects", label: "Projects" },
    ],
  },
  {
    heading: "Get involved",
    links: [
      { href: "/students", label: "Students" },
      { href: "/mentors", label: "Mentors" },
      { href: "/sponsors", label: "Sponsors" },
      { href: "/donate", label: "Donate" },
      { href: "/board", label: "Board" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-bold">CodeHub Foundation</p>
            <p className="mt-1 font-mono text-sm text-slate-500">
              Learn. Build. Innovate.
            </p>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Free coding education, technology mentorship, and hands-on
              projects for students.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-block text-sm text-neon-blue hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <p className="font-mono text-xs tracking-widest text-neon-purple uppercase">
                {group.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-neon-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CodeHub Foundation</p>
          <Link href="/contact" className="hover:text-neon-blue">
            Contact us
          </Link>
        </div>
      </div>
    </footer>
  );
}
