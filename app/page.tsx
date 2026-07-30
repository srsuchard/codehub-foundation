import Link from "next/link";

import { ButtonLink, Card, Section, SectionHeading, SectionLabel } from "./components/ui";
import { IMPACT, PROGRAMS } from "./lib/site";

export default function Home() {
  return (
    <>
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
            We empower students through accessible coding education, technology
            mentorship, and hands-on projects — so the next generation of
            builders comes from everywhere.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink href="/students">Join CodeHub</ButtonLink>
            <ButtonLink href="/mentors" variant="outline">
              Become a Mentor
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Partner With Us
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Mission preview */}
      <Section alt>
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Our Mission</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Computer science education should be free, and within reach
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            CodeHub Foundation empowers students by providing accessible coding
            education, technology mentorship, and hands-on learning
            opportunities that inspire the next generation of innovators. Every
            program we run is free to students, funded entirely by sponsors and
            donors.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block text-neon-blue underline-offset-4 hover:underline"
          >
            Read our story →
          </Link>
        </div>
      </Section>

      {/* Programs preview */}
      <Section>
        <SectionHeading
          label="What We Run"
          title="Our Programs"
          intro="Four ways students learn, build, and connect with people already doing the work."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PROGRAMS.map((program) => (
            <Card key={program.slug} accent={program.accent}>
              <span aria-hidden className="text-3xl">
                {program.icon}
              </span>
              <h3 className="mt-4 text-xl font-bold">{program.title}</h3>
              <p className="mt-3 text-slate-400">{program.summary}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/programs"
            className="text-neon-blue underline-offset-4 hover:underline"
          >
            See all programs in detail →
          </Link>
        </div>
      </Section>

      {/* Impact */}
      <Section alt>
        <SectionHeading
          label="Our Impact"
          title="Where we are today"
          intro="We're just getting started. These numbers grow with every cohort, project, and event."
        />

        <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {IMPACT.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-mono text-4xl font-bold text-neon-green">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm text-slate-400">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Call to action */}
      <Section>
        <SectionHeading
          label="Get Involved"
          title="Three ways to be part of this"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Card accent="border-neon-blue/40" className="flex flex-col text-center">
            <h3 className="text-xl font-bold">Students</h3>
            <p className="mt-3 flex-1 text-slate-400">
              Join a cohort, get matched with a mentor, and build something
              real. Always free.
            </p>
            <div className="mt-6">
              <ButtonLink href="/students">Join the community</ButtonLink>
            </div>
          </Card>

          <Card accent="border-neon-green/40" className="flex flex-col text-center">
            <h3 className="text-xl font-bold">Mentors</h3>
            <p className="mt-3 flex-1 text-slate-400">
              Give a couple of hours a month to help a student get unstuck and
              keep going.
            </p>
            <div className="mt-6">
              <ButtonLink href="/mentors" variant="secondary">
                Volunteer
              </ButtonLink>
            </div>
          </Card>

          <Card accent="border-neon-purple/40" className="flex flex-col text-center">
            <h3 className="text-xl font-bold">Sponsors</h3>
            <p className="mt-3 flex-1 text-slate-400">
              Fund curriculum, hackathons, and hardware so programs stay free
              for students.
            </p>
            <div className="mt-6">
              <ButtonLink href="/contact" variant="outline">
                Partner with us
              </ButtonLink>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
