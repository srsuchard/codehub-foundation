import type { Metadata } from "next";

import { MentorForm } from "../components/forms";
import { Card, PageHero, Section, SectionHeading } from "../components/ui";
import { MENTOR_EXPECTATIONS } from "../lib/site";

export const metadata: Metadata = {
  title: "Mentors",
  description:
    "Volunteer as a CodeHub mentor — a few hours a month helping a student get unstuck and keep going.",
  alternates: { canonical: "/mentors" },
};

const WHY = [
  {
    title: "Help a student stay in",
    body: "Most people who quit coding quit at their first real obstacle, alone. Being the person they can ask changes the outcome more than any curriculum.",
    accent: "border-neon-blue/40",
  },
  {
    title: "Share what you already know",
    body: "You don't need to be senior or know everything. The gap between you and a beginner is the whole point — you remember what was confusing.",
    accent: "border-neon-purple/40",
  },
  {
    title: "Support STEM education",
    body: "Free programs only work if professionals show up. Your hours are what keeps this accessible to students who couldn't otherwise pay for it.",
    accent: "border-neon-green/40",
  },
];

export default function MentorsPage() {
  return (
    <>
      <PageHero
        label="Volunteer"
        title="Mentor a student"
        intro="A few hours a month, remote and flexible. It's the highest-leverage thing you can do for someone starting out."
      />

      <Section>
        <SectionHeading label="Why It Matters" title="Why become a mentor?" />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {WHY.map((reason) => (
            <Card key={reason.title} accent={reason.accent}>
              <h3 className="text-xl font-bold">{reason.title}</h3>
              <p className="mt-3 text-slate-400">{reason.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section alt>
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              What we ask
            </h2>
            <ul className="mt-6 grid gap-3">
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
            <p className="mt-6 text-sm text-slate-500">
              Mentors working with students under 18 complete a background check
              before being matched.
            </p>
          </div>

          <div className="rounded-2xl border border-neon-purple/40 bg-ink/60 p-7">
            <h2 className="text-2xl font-bold">Mentor application</h2>
            <p className="mt-2 mb-6 text-sm text-slate-400">
              Takes about two minutes. We&apos;ll follow up to set up
              onboarding.
            </p>
            <MentorForm />
          </div>
        </div>
      </Section>
    </>
  );
}
