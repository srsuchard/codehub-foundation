import type { Metadata } from "next";

import { ContactForm } from "../components/forms";
import { Card, PageHero, Section } from "../components/ui";
import { CONTACT_EMAIL } from "../lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with CodeHub Foundation — questions, partnerships, sponsorship, and mentorship.",
  alternates: { canonical: "/contact" },
};

const ROUTES = [
  {
    title: "Students & families",
    body: "Questions about cohorts, eligibility, or getting started.",
    accent: "border-neon-blue/40",
  },
  {
    title: "Partnerships & sponsorship",
    body: "Fund a program, host an event, or send your engineers to mentor.",
    accent: "border-neon-purple/40",
  },
  {
    title: "Schools & educators",
    body: "Bring CodeHub programs to your school or after-school program.",
    accent: "border-neon-green/40",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Get In Touch"
        title="Contact us"
        intro="Questions from students, schools, mentors, or sponsors — all welcome. We read everything."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {ROUTES.map((route) => (
            <Card key={route.title} accent={route.accent}>
              <h2 className="text-lg font-bold">{route.title}</h2>
              <p className="mt-3 text-slate-400">{route.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section alt>
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.4fr] md:items-start">
          <div>
            <h2 className="text-2xl font-bold">Prefer email?</h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 inline-block font-mono text-lg text-neon-blue underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-6 text-slate-400">
              We reply to most messages within a few days. For sponsorship
              enquiries, mention your organization and what you&apos;re
              interested in funding and we&apos;ll send our partnership deck.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-ink/60 p-7">
            <h2 className="text-2xl font-bold">Send us a message</h2>
            <p className="mt-2 mb-6 text-sm text-slate-400">
              Pick a topic so it reaches the right person.
            </p>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
