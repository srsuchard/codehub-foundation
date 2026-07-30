import type { Metadata } from "next";

import { ButtonLink, PageHero, Section, SectionHeading } from "../components/ui";
import { PROJECTS, PROJECT_TYPES } from "../lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Apps, websites, AI projects, and open-source tools built by CodeHub Foundation students.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        label="Student Work"
        title="Projects"
        intro="Everything our students build is theirs to keep, publish, and show people. Here's the work."
      />

      <Section>
        <SectionHeading label="Showcase" title="Student projects" />

        {PROJECTS.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project) => (
              <article
                key={project.title}
                className="flex flex-col rounded-2xl border border-line bg-surface/60 p-7 transition-colors hover:border-neon-blue"
              >
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="mt-1 font-mono text-xs text-neon-purple">
                  by {project.student}
                </p>
                <p className="mt-4 flex-1 text-slate-400">
                  {project.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line bg-white/5 px-3 py-1 font-mono text-xs text-slate-300"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex gap-4 text-sm">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-blue hover:underline"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-blue hover:underline"
                    >
                      Live site ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl border border-dashed border-line bg-surface/40 p-12 text-center">
            <p className="text-5xl" aria-hidden>
              🛠
            </p>
            <h3 className="mt-5 text-2xl font-bold">
              The first projects are being built now
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              This page fills up as students finish their first cohort. Every
              project here will be real student work — with their name on it,
              their code, and a link you can click.
            </p>
            <div className="mt-8">
              <ButtonLink href="/students">
                Build the first one
              </ButtonLink>
            </div>
          </div>
        )}
      </Section>

      <Section alt>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            label="What Students Build"
            title="From first commit to something people use"
            intro="Projects come out of Academy coursework, hackathon weekends, and the Innovation Lab."
          />

          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {PROJECT_TYPES.map((type) => (
              <li
                key={type}
                className="rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-2 font-mono text-sm text-neon-blue"
              >
                {type}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-slate-400">
            Every student publishes their work to GitHub, so they leave with a
            portfolio rather than a certificate.
          </p>
        </div>
      </Section>
    </>
  );
}
