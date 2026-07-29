const NAV_LINKS = [
  { href: "#mission", label: "Mission" },
  { href: "#programs", label: "Programs" },
  { href: "#mentors", label: "Mentors" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple font-mono text-sm text-ink"
          >
            {"</>"}
          </span>
          <span className="text-lg">CodeHub</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition-colors hover:text-neon-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#mentors"
            className="hidden rounded-lg border border-neon-purple/60 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-neon-purple/15 sm:inline-block"
          >
            Become a Mentor
          </a>

          {/* CSS-only disclosure menu so mobile nav needs no client JS. */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-lg border border-line px-3 py-2 text-sm text-slate-200 [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 mt-2 flex w-44 flex-col rounded-xl border border-line bg-surface p-2 shadow-xl shadow-black/50"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-neon-blue"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
