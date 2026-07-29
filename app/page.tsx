import { SiteHeader } from "./components/site-header";

const CONTACT_EMAIL = "hello@codehubfoundation.org";

const PROGRAMS = [
  {
    icon: "💻",
    title: "CodeHub Academy",
    accent: "border-neon-blue/40 hover:border-neon-blue",
    body: "Free, cohort-based courses in Python, web development, AI, cybersecurity, and mobile app development — no prior experience required.",
    points: ["8-week cohorts", "Project-based", "Beginner friendly"],
  },
  {
    icon: "🚀",
    title: "Hackathons",
    accent: "border-neon-purple/40 hover:border-neon-purple",
    body: "Weekend build sprints where students team up to ship real technology for their schools and communities, with engineers on hand as coaches.",
    points: ["Team projects", "Mentor coaches", "Demo day"],
  },
  {
    icon: "🤝",
    title: "Mentorship",
    accent: "border-neon-green/40 hover:border-neon-green",
    body: "One-on-one pairing with developers, engineers, and STEM professionals for code review, career guidance, and portfolio building.",
    points: ["1:1 pairing", "Career guidance", "Portfolio reviews"],
  },
];

const STATS = [
  { value: "100%", label: "Free for students" },
  { value: "5", label: "Learning tracks" },
  { value: "1:1", label: "Mentor pairing" },
  { value: "501(c)(3)", label: "Nonprofit mission" },
];

const MENTOR_EXPECTATIONS = [
  "2–4 hours a month, remote and flexible",
  "Pair with one student or coach a hackathon team",
  "Review code, resumes, and project portfolios",
  "No teaching experience needed — we onboard you",
];

const SPONSOR_TIERS = [
  {
    name: "Supporter",
    amount: "$500",
    accent: "border-line",
    featured: false,
    benefits: [
      "Sponsors one student for a full cohort",
      "Logo on our website",
      "Quarterly impact report",
    ],
  },
  {
    name: "Partner",
    amount: "$2,500",
    accent: "border-neon-purple ring-1 ring-neon-purple/30",
    featured: true,
    benefits: [
      "Underwrites a hackathon weekend",
      "Logo on event materials",
      "Invite your engineers to mentor",
      "Quarterly impact report",
    ],
  },
  {
    name: "Founding Sponsor",
    amount: "Custom",
    accent: "border-neon-blue/50",
    featured: false,
    benefits: [
      "Names a full learning track",
      "Recruiting pipeline access",
      "Co-branded student showcase",
      "Annual partnership review",
    ],
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="grid-backdrop absolute inset-0" />
          <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
            <p className="mx-auto mb-6 w-fit rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-1.5 font-mono text-xs tracking-widest text-neon-blue uppercase">
              Nonprofit · Tech Education
            </p>

            <h1 className="bg-gradient-to-r from-neon-blue via-sky-200 to-neon-purple bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
              CodeHub Foundation
            </h1>

            <p className="mt-6 font-mono text-xl text-slate-200 sm:text-2xl">
              Learn. Build. Innovate.
            </p>

            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
              We empower students through free coding education, technology
              mentorship, and real-world projects — so the next generation of
              builders comes from everywhere.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="#programs"
                className="rounded-lg bg-gradient-to-r from-neon-blue to-sky-500 px-7 py-3 font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Join the Community
              </a>
              <a
                href="#mentors"
                className="rounded-lg border border-neon-purple px-7 py-3 font-semibold text-slate-100 transition-colors hover:bg-neon-purple/15"
              >
                Become a Mentor
              </a>
            </div>

            <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-mono text-2xl font-bold text-neon-green">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-sm text-slate-400">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Mission */}
        <section
          id="mission"
          className="border-y border-line bg-surface px-6 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Our Mission</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Computer science education should be free, and within reach
            </h2>
            <p className="mt-6 text-lg text-slate-400">
              CodeHub Foundation makes computer science accessible by giving
              students structured coding programs, mentorship from working
              professionals, and the chance to build technology that matters to
              their own communities. Every program we run is free to students,
              funded entirely by sponsors and donors.
            </p>
          </div>
        </section>

        {/* Programs */}
        <section id="programs" className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <SectionLabel>What We Run</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Our Programs
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {PROGRAMS.map((program) => (
                <article
                  key={program.title}
                  className={`rounded-2xl border bg-surface/60 p-7 transition-colors ${program.accent}`}
                >
                  <span aria-hidden className="text-3xl">
                    {program.icon}
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{program.title}</h3>
                  <p className="mt-3 text-slate-400">{program.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {program.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-line bg-white/5 px-3 py-1 font-mono text-xs text-slate-300"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Mentors */}
        <section
          id="mentors"
          className="border-y border-line bg-surface px-6 py-20 sm:py-24"
        >
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
            <div>
              <SectionLabel>Volunteer</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Mentor a student
              </h2>
              <p className="mt-5 text-lg text-slate-400">
                Our mentors are software engineers, data scientists, designers,
                and IT professionals who give a few hours a month to help a
                student get unstuck and keep going. It is the highest-leverage
                thing you can do for someone starting out.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Mentor%20signup&body=Name%3A%0AWhat%20you%20work%20on%3A%0AHours%20per%20month%3A%0ALinkedIn%20or%20GitHub%3A`}
                className="mt-8 inline-block rounded-lg bg-gradient-to-r from-neon-purple to-fuchsia-500 px-7 py-3 font-semibold text-white transition-opacity hover:opacity-90"
              >
                Sign up to mentor
              </a>
              <p className="mt-3 text-sm text-slate-500">
                Opens an email to our team — we reply within a few days.
              </p>
            </div>

            <ul className="grid gap-3">
              {MENTOR_EXPECTATIONS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-line bg-ink/60 p-4 text-slate-300"
                >
                  <span aria-hidden className="mt-0.5 text-neon-green">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sponsors */}
        <section id="sponsors" className="px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <SectionLabel>Partner With Us</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Fund the next generation of developers
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
                Sponsorship pays for curriculum, hackathon venues, hardware, and
                student stipends. Every dollar goes directly into programs that
                stay free for students.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {SPONSOR_TIERS.map((tier) => (
                <article
                  key={tier.name}
                  className={`flex flex-col rounded-2xl border bg-surface/60 p-7 ${tier.accent}`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    {tier.featured && (
                      <span className="rounded-full bg-neon-purple/20 px-3 py-1 font-mono text-xs text-neon-purple">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-mono text-3xl font-bold text-neon-blue">
                    {tier.amount}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3 text-slate-400">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <span aria-hidden className="text-neon-green">
                          ✓
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Sponsorship%20inquiry&body=Organization%3A%0ATier%20of%20interest%3A%0AContact%20name%3A`}
                className="inline-block rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue px-8 py-3 font-semibold text-ink transition-opacity hover:opacity-90"
              >
                Become a Sponsor
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="border-t border-line bg-surface px-6 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Get In Touch</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Contact
            </h2>
            <p className="mt-5 text-lg text-slate-400">
              Questions from students, schools, mentors, or sponsors — all
              welcome. We read everything.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-block font-mono text-lg text-neon-blue underline-offset-4 hover:underline sm:text-xl"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-bold">CodeHub Foundation</p>
            <p className="mt-1 font-mono text-sm text-slate-500">
              Learn. Build. Innovate.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap justify-center gap-6"
          >
            <a
              href="#mission"
              className="text-sm text-slate-400 hover:text-neon-blue"
            >
              Mission
            </a>
            <a
              href="#programs"
              className="text-sm text-slate-400 hover:text-neon-blue"
            >
              Programs
            </a>
            <a
              href="#mentors"
              className="text-sm text-slate-400 hover:text-neon-blue"
            >
              Mentors
            </a>
            <a
              href="#sponsors"
              className="text-sm text-slate-400 hover:text-neon-blue"
            >
              Sponsors
            </a>
          </nav>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CodeHub Foundation
          </p>
        </div>
      </footer>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs tracking-widest text-neon-purple uppercase">
      {children}
    </span>
  );
}
