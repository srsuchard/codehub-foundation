"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "../lib/admin-actions";
import { ROLE_LABELS, type AppRole } from "../lib/roles";

const TABS = [
  { href: "/admin", label: "Submissions", exact: true, staffOnly: true },
  { href: "/admin/volunteers", label: "Volunteers", staffOnly: true },
  { href: "/admin/programs", label: "Programs", staffOnly: true },
  { href: "/admin/documents", label: "Documents", staffOnly: true },
  // The only tab board members see.
  { href: "/admin/board", label: "Board" },
  { href: "/admin/team", label: "Team & roles", adminOnly: true },
  { href: "/admin/audit", label: "Audit log", adminOnly: true },
  { href: "/admin/security", label: "Security" },
];

export function AdminNav({ email, role }: { email: string; role: AppRole }) {
  const pathname = usePathname();

  const isStaffRole = role === "admin" || role === "staff";
  const visible = TABS.filter(
    (tab) =>
      (!tab.adminOnly || role === "admin") && (!tab.staffOnly || isStaffRole),
  );

  return (
    <div className="border-b border-line bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <nav aria-label="Admin sections" className="flex flex-wrap gap-1">
          {visible.map((tab) => {
            // Every admin page starts with /admin, so the dashboard tab needs
            // an exact match or it would light up everywhere.
            const active = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-neon-blue/10 text-neon-blue"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-slate-500 sm:inline">
            {email}
            <span className="ml-2 rounded-full border border-neon-purple/40 bg-neon-purple/10 px-2 py-0.5 font-mono text-neon-purple">
              {ROLE_LABELS[role]}
            </span>
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate-300 hover:border-neon-purple hover:text-neon-purple"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
