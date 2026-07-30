import type { Metadata } from "next";

import { ButtonLink, PageHero, Section } from "../components/ui";
import { PROGRAMS } from "../lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "CodeHub Academy, mentorship, hackathons, and the Student Innovation Lab — all free for students.",
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        label="What We Run"
        title="Our programs"
        intro="Four programs that work together: learn the fundamentals, get a mentor, build under pressure, then make something of your own."
      />

      {PROGRAMS.map((program, index) => (
        <Section key={program.slug} id={program.slug} alt={index % 2 === 1}>
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <span aria-hidden className="text-4xl">
                {program.icon}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                {program.title}
              </h2>
              <p className="mt-5 text-lg text-slate-300">{program.summary}</p>
              <p className="mt-4 text-slate-400">{program.detail}</p>
            </div>

            <div className="rounded-2xl border border-line bg-ink/60 p-7">
              <h3 className="font-mono text-xs tracking-widest text-neon-purple uppercase">
                {program.slug === "mentorship" ? "Mentors include" : "What you'll cover"}
              </h3>
              <ul className="mt-5 grid gap-3">
                {program.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-3 text-slate-300">
                    <span aria-hidden className="text-neon-green">
                      ✓
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ))}

      <Section alt={PROGRAMS.length % 2 === 1}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Every program is free
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            No tuition, no materials fees, no catch. Programs are funded by
            sponsors and donors so students never pay to learn.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink href="/students">Apply as a student</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Sponsor a program
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
