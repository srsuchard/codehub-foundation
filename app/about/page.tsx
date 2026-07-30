import type { Metadata } from "next";

import { ButtonLink, Card, PageHero, Section, SectionHeading } from "../components/ui";
import { VALUES } from "../lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who we are, why CodeHub Foundation exists, and the values behind our work.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Us"
        title="Who we are"
        intro="CodeHub Foundation is a nonprofit making computer science education accessible to every student who wants it."
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight">Our story</h2>
          <div className="mt-6 space-y-5 text-lg text-slate-400">
            <p>
              Learning to code is not hard because the material is impossible.
              It is hard because most students hit their first real obstacle
              alone, with nobody to ask, and quietly conclude the field is not
              for them.
            </p>
            <p>
              The students who make it through usually had something the others
              didn&apos;t: a parent in tech, a teacher who stayed late, a friend
              who had already figured it out. That is not talent. It is access.
            </p>
            <p>
              CodeHub Foundation exists to make that access ordinary rather than
              lucky. We pair structured, project-based courses with mentors who
              do this work for a living, and we keep every program free — so the
              only thing a student needs to bring is the willingness to try.
            </p>
          </div>
        </div>
      </Section>

      <Section alt>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <Card accent="border-neon-blue/40">
            <h2 className="font-mono text-xs tracking-widest text-neon-blue uppercase">
              Mission
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              CodeHub Foundation empowers students by providing accessible
              coding education, technology mentorship, and hands-on learning
              opportunities that inspire the next generation of innovators.
            </p>
          </Card>

          <Card accent="border-neon-purple/40">
            <h2 className="font-mono text-xs tracking-widest text-neon-purple uppercase">
              Vision
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              A world where every student has the opportunity to learn
              technology and create the future.
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading label="What Guides Us" title="Our values" />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <Card key={value.title}>
              <h3 className={`text-xl font-bold ${value.accent}`}>
                {value.title}
              </h3>
              <p className="mt-3 text-slate-400">{value.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section alt>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Want to be part of it?
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            Whether you&apos;re a student, a professional with a few hours a
            month, or an organization looking to fund this work — there&apos;s a
            place for you here.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink href="/students">Join as a student</ButtonLink>
            <ButtonLink href="/mentors" variant="secondary">
              Become a mentor
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
