import type { Metadata } from "next";

import { BoardForm } from "../components/forms";
import { Card, PageHero, Section, SectionHeading } from "../components/ui";
import { BOARD } from "../lib/site";

export const metadata: Metadata = {
  title: "Board",
  description:
    "The leadership team behind CodeHub Foundation, and how to apply to join the board.",
  alternates: { canonical: "/board" },
};

export default function BoardPage() {
  return (
    <>
      <PageHero
        label="Leadership"
        title="Our board"
        intro="The people responsible for CodeHub Foundation's direction, finances, and accountability."
      />

      <Section>
        <SectionHeading
          label="Leadership Team"
          title="Who leads CodeHub"
          intro="We're an early-stage foundation and several seats are still being filled."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BOARD.map((member) => (
            <Card
              key={member.position}
              accent={member.name ? "border-neon-blue/40" : "border-line"}
            >
              <p className="font-mono text-xs tracking-widest text-neon-purple uppercase">
                {member.position}
              </p>

              {member.name ? (
                <>
                  <h3 className="mt-3 text-xl font-bold">{member.name}</h3>
                  <p className="mt-3 text-slate-400">{member.bio}</p>
                </>
              ) : (
                <>
                  <h3 className="mt-3 text-xl font-bold text-slate-500">
                    Seat open
                  </h3>
                  <p className="mt-3 text-slate-500">
                    We&apos;re recruiting for this role. If it sounds like you,
                    the application is below.
                  </p>
                </>
              )}
            </Card>
          ))}
        </div>
      </Section>

      <Section alt>
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Join the board
            </h2>
            <p className="mt-5 text-lg text-slate-400">
              Board members set strategy, oversee finances, and open doors. We
              are especially looking for people with nonprofit governance,
              fundraising, education, or finance experience — and for people who
              reflect the communities our students come from.
            </p>
            <ul className="mt-6 grid gap-3">
              {[
                "Roughly one meeting a quarter, plus committee work",
                "A two-year term, renewable",
                "Volunteer role — board seats are unpaid",
              ].map((item) => (
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
          </div>

          <div className="rounded-2xl border border-neon-blue/40 bg-ink/60 p-7">
            <h2 className="text-2xl font-bold">Board application</h2>
            <p className="mt-2 mb-6 text-sm text-slate-400">
              Reviewed on a rolling basis.
            </p>
            <BoardForm />
          </div>
        </div>
      </Section>
    </>
  );
}
