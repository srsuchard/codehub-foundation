import type { Metadata } from "next";

import { ButtonLink, Card, PageHero, Section, SectionHeading } from "../components/ui";
import { CONTACT_EMAIL } from "../lib/site";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support free coding education and mentorship for students at CodeHub Foundation.",
  alternates: { canonical: "/donate" },
};

const USES = [
  {
    icon: "📚",
    title: "Curriculum and materials",
    body: "Course content, exercises, and the licenses students need to follow along.",
  },
  {
    icon: "💻",
    title: "Hardware and access",
    body: "Laptops and connectivity for students who don't have a machine to learn on.",
  },
  {
    icon: "🚀",
    title: "Hackathons and events",
    body: "Venue, food, and materials for weekend builds and workshops.",
  },
  {
    icon: "🤝",
    title: "Running the programs",
    body: "Mentor matching, background checks, and the coordination that keeps cohorts on track.",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        label="Support Our Work"
        title="Donate"
        intro="CodeHub programs are free to students. Donations are what make that possible."
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight">Why give</h2>
          <div className="mt-6 space-y-5 text-lg text-slate-400">
            <p>
              The barrier for most students isn&apos;t ability — it&apos;s
              access. A laptop, a structured course, and someone to ask when
              they get stuck is often the entire difference between a student
              who keeps going and one who quietly stops.
            </p>
            <p>
              Those three things cost money to provide, and we&apos;ve committed
              to never passing that cost to students. Every contribution goes
              directly into programs.
            </p>
          </div>
        </div>
      </Section>

      <Section alt>
        <SectionHeading
          label="Where It Goes"
          title="How donations help"
          intro="We're a small organization, so contributions go to program costs rather than overhead."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {USES.map((use) => (
            <Card key={use.title}>
              <span aria-hidden className="text-3xl">
                {use.icon}
              </span>
              <h3 className="mt-4 text-xl font-bold">{use.title}</h3>
              <p className="mt-3 text-slate-400">{use.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-neon-blue/40 bg-surface/60 p-8 text-center">
            <h2 className="text-2xl font-bold">
              Online giving isn&apos;t open yet
            </h2>
            <p className="mt-4 text-slate-400">
              We&apos;re setting up donation processing. In the meantime, if
              you&apos;d like to support CodeHub Foundation — or you represent an
              organization looking to fund a program — please get in touch
              directly and we&apos;ll take it from there.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <ButtonLink href={`mailto:${CONTACT_EMAIL}?subject=Donation`}>
                Email us about giving
              </ButtonLink>
              <ButtonLink href="/sponsors" variant="outline">
                Organization partnerships
              </ButtonLink>
            </div>
          </div>

          {/*
            CodeHub Foundation has not yet filed for 501(c)(3) status, so this
            page must not describe contributions as tax-deductible. Update this
            notice only when a determination letter is actually in hand.
          */}
          <p className="mt-8 text-center text-sm text-slate-500">
            CodeHub Foundation has not yet received 501(c)(3) tax-exempt
            determination from the IRS. Contributions are{" "}
            <strong className="text-slate-400">not tax-deductible</strong> at
            this time. We&apos;ll update this page if that changes.
          </p>
        </div>
      </Section>
    </>
  );
}
