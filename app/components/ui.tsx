import Link from "next/link";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs tracking-widest text-neon-purple uppercase">
      {children}
    </span>
  );
}

export function Section({
  id,
  alt,
  children,
}: {
  id?: string;
  /** Alternating surface background to separate adjacent sections. */
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`px-6 py-20 sm:py-24 ${alt ? "border-y border-line bg-surface" : ""}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function PageHero({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="grid-backdrop absolute inset-0" />
      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">{intro}</p>
      </div>
    </section>
  );
}

export function SectionHeading({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="text-center">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">{intro}</p>
      )}
    </div>
  );
}

export function Card({
  accent = "border-line",
  className = "",
  children,
}: {
  accent?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`rounded-2xl border bg-surface/60 p-7 ${accent} ${className}`}
    >
      {children}
    </article>
  );
}

const BUTTON_STYLES = {
  primary:
    "bg-gradient-to-r from-neon-blue to-sky-500 text-ink hover:opacity-90",
  secondary:
    "bg-gradient-to-r from-neon-purple to-fuchsia-500 text-white hover:opacity-90",
  outline:
    "border border-neon-purple text-slate-100 hover:bg-neon-purple/15",
} as const;

export function ButtonLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: keyof typeof BUTTON_STYLES;
  children: React.ReactNode;
}) {
  const className = `inline-block rounded-lg px-7 py-3 text-center font-semibold transition-opacity ${BUTTON_STYLES[variant]}`;

  // next/link doesn't handle mailto: or external URLs.
  if (href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
