import type { Metadata } from "next";

import { SponsorForm } from "../components/forms";
import { Card, PageHero, Section, SectionHeading } from "../components/ui";
import { SPONSOR_INTERESTS, SPONSOR_TIERS } from "../lib/site";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Partner with CodeHub Foundation to fund free coding education, mentorship, and hackathons for students.",
  alternates: { canonical: "/sponsors" },
};

const WHY = [
  {
    title: "Invest in STEM education",
    body: "Sponsorship pays for curriculum, venues, and hardware — the unglamorous costs that decide whether a program runs at all.",
    accent: "border-neon-blue/40",
  },
  {
    title: "Reach future developers",
    body: "Your engineers mentor the students, and your name is on the work they ship. That's a relationship, not an ad impression.",
    accent: "border-neon-purple/40",
  },
  {
    title: "Community impact",
    body: "Every dollar keeps programs free for students who could not otherwise pay to learn this.",
    accent: "border-neon-green/40",
  },
];

export default function SponsorsPage() {
  return (
    <>
      <PageHero
        label="Partner With Us"
        title="Fund the next generation of developers"
        intro="CodeHub programs are free to students because organizations pay for them. Here's how partnership works."
      />

      <Section>
        <SectionHeading label="Why Partner" title="Why partner with CodeHub?" />

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
        <SectionHeading
          label="Sponsor Levels"
          title="Ways to support"
          intro="Every level is flexible — tell us what you want to fund and we'll shape it around that."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SPONSOR_TIERS.map((tier) => (
            <article
              key={tier.name}
              className={`flex flex-col rounded-2xl border bg-ink/60 p-7 ${tier.accent}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                {tier.featured && (
                  <span className="rounded-full bg-neon-purple/20 px-3 py-1 font-mono text-xs text-neon-purple">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-3 text-slate-300">{tier.summary}</p>
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
      </Section>

      <Section>
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.3fr] md:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Let&apos;s talk
            </h2>
            <p className="mt-5 text-lg text-slate-400">
              Tell us a little about your organization and what you&apos;re
              interested in supporting. We&apos;ll send our partnership deck and
              find a time to talk.
            </p>
            {/*
              Not yet a 501(c)(3) — this must not imply deductibility or offer
              tax documentation. Revisit only on IRS determination.
            */}
            <p className="mt-4 text-sm text-slate-500">
              CodeHub Foundation operates as a nonprofit but has not yet
              received 501(c)(3) determination, so contributions are not
              tax-deductible at this time. We&apos;re happy to discuss what that
              means for your organization.
            </p>
          </div>

          <div className="rounded-2xl border border-neon-purple/40 bg-surface/60 p-7">
            <h2 className="text-2xl font-bold">Partnership inquiry</h2>
            <p className="mt-2 mb-6 text-sm text-slate-400">
              We reply within a few days.
            </p>
            <SponsorForm interests={SPONSOR_INTERESTS} />
          </div>
        </div>
      </Section>
    </>
  );
}
