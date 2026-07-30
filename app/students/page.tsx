import type { Metadata } from "next";

import { StudentForm } from "../components/forms";
import { Card, PageHero, Section, SectionHeading } from "../components/ui";
import { STUDENT_RESOURCES } from "../lib/site";

export const metadata: Metadata = {
  title: "Students",
  description:
    "Join CodeHub Foundation — free coding cohorts, a mentor of your own, and projects you actually ship.",
  alternates: { canonical: "/students" },
};

export default function StudentsPage() {
  return (
    <>
      <PageHero
        label="For Students"
        title="Join CodeHub"
        intro="Free courses, a mentor who does this for a living, and projects you can show people. No experience required."
      />

      <Section>
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              What you get
            </h2>
            <ul className="mt-6 grid gap-3">
              {[
                "A free, project-based course in the track you pick",
                "One-on-one pairing with a working professional",
                "A team to build with at hackathons",
                "Help publishing your projects on GitHub",
                "Support with resumes, portfolios, and college applications",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-line bg-surface/60 p-4 text-slate-300"
                >
                  <span aria-hidden className="mt-0.5 text-neon-green">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-slate-500">
              Under 18? That&apos;s fine — we&apos;ll include a parent or
              guardian when we follow up.
            </p>
          </div>

          <div className="rounded-2xl border border-neon-blue/40 bg-surface/60 p-7">
            <h2 className="text-2xl font-bold">Student application</h2>
            <p className="mt-2 mb-6 text-sm text-slate-400">
              Takes about two minutes. We&apos;ll email you about the next
              cohort.
            </p>
            <StudentForm />
          </div>
        </div>
      </Section>

      <Section alt>
        <SectionHeading
          label="Start Now"
          title="Student resources"
          intro="You don't have to wait for a cohort to begin. These are free, and they're where we'd tell you to start."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STUDENT_RESOURCES.map((resource) => (
            <Card key={resource.title} className="transition-colors hover:border-neon-blue">
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-neon-blue"
              >
                {resource.title} ↗
              </a>
              <p className="mt-3 text-sm text-slate-400">{resource.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
