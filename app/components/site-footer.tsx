import Link from "next/link";

import { CONTACT_EMAIL } from "../lib/site";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/students", label: "Students" },
  { href: "/mentors", label: "Mentors" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center sm:flex-row sm:items-start sm:text-left">
        <div>
          <p className="font-bold">CodeHub Foundation</p>
          <p className="mt-1 font-mono text-sm text-slate-500">
            Learn. Build. Innovate.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-block text-sm text-slate-400 hover:text-neon-blue"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 hover:text-neon-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} CodeHub Foundation
        </p>
      </div>
    </footer>
  );
}
