import type { Metadata } from "next";

import { ButtonLink, Card, PageHero, Section, SectionHeading } from "../components/ui";
import { CONTACT_EMAIL, EVENT_TYPES, EVENTS } from "../lib/site";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Workshops, hackathons, coding sessions, and community meetings run by CodeHub Foundation.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        label="What's On"
        title="Events"
        intro="Workshops, hackathons, and community sessions — all free, all open to students."
      />

      <Section>
        <SectionHeading label="Upcoming" title="What's coming up" />

        {EVENTS.length > 0 ? (
          <div className="mt-14 grid gap-6">
            {EVENTS.map((event) => (
              <article
                key={event.title}
                className="grid gap-5 rounded-2xl border border-neon-blue/40 bg-surface/60 p-7 md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-mono text-sm text-neon-blue">
                    {event.date} · {event.location}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">{event.title}</h3>
                  <p className="mt-3 text-slate-400">{event.description}</p>
                </div>
                {event.registerUrl && (
                  <ButtonLink href={event.registerUrl}>Register</ButtonLink>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl border border-dashed border-line bg-surface/40 p-12 text-center">
            <p className="text-5xl" aria-hidden>
              📅
            </p>
            <h3 className="mt-5 text-2xl font-bold">
              Nothing scheduled just yet
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              We&apos;re planning our first cohort of workshops and hackathons
              now. Tell us you&apos;re interested and we&apos;ll let you know
              the moment dates are set.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <ButtonLink href="/students">Join as a student</ButtonLink>
              <ButtonLink href={`mailto:${CONTACT_EMAIL}?subject=Event%20updates`} variant="outline">
                Get event updates
              </ButtonLink>
            </div>
          </div>
        )}
      </Section>

      <Section alt>
        <SectionHeading
          label="What We Run"
          title="The kinds of events we host"
          intro="Four formats, running throughout the year as programs get going."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {EVENT_TYPES.map((type) => (
            <Card key={type.title}>
              <span aria-hidden className="text-3xl">
                {type.icon}
              </span>
              <h3 className="mt-4 text-xl font-bold">{type.title}</h3>
              <p className="mt-3 text-slate-400">{type.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Want to host or sponsor an event?
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            Schools, libraries, and companies can host a workshop or underwrite
            a hackathon weekend. We bring the curriculum and the mentors.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink href="/sponsors" variant="secondary">
              Sponsor an event
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Get in touch
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
