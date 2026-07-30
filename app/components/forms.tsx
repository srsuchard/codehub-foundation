"use client";

import { useActionState } from "react";

import {
  submitBoardApplication,
  submitContactMessage,
  submitMentorApplication,
  submitSponsorInquiry,
  submitStudentApplication,
} from "../lib/actions";
import { INITIAL_FORM_STATE } from "../lib/schemas";
import {
  Field,
  FormMessage,
  Honeypot,
  Select,
  SubmitButton,
  TextArea,
} from "./form-fields";

/** Success replaces the form so nobody submits twice. */
function Submitted({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neon-green/40 bg-neon-green/10 p-8 text-center">
      <p className="text-2xl" aria-hidden>
        ✓
      </p>
      <p className="mt-3 text-lg font-semibold text-neon-green">
        Thanks — we got it.
      </p>
      <p className="mt-2 text-slate-300">{children}</p>
    </div>
  );
}

export function StudentForm() {
  const [state, action, pending] = useActionState(
    submitStudentApplication,
    INITIAL_FORM_STATE,
  );

  if (state.status === "success") {
    return (
      <Submitted>
        We&apos;ll email you about the next cohort within a few days.
      </Submitted>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Full name" state={state} required />
        <Field name="email" label="Email" type="email" state={state} required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="grade"
          label="Age or grade"
          placeholder="e.g. 10th grade"
          state={state}
          required
        />
        <Field name="school" label="School" hint="Optional" state={state} />
      </div>
      <Select
        name="experience"
        label="Coding experience"
        state={state}
        required
        options={[
          "Complete beginner",
          "Some tutorials or classes",
          "Built a few projects",
          "Comfortable — looking to go deeper",
        ]}
      />
      <TextArea
        name="interests"
        label="What are you interested in?"
        hint="Optional — web, games, AI, cybersecurity, anything"
        state={state}
        rows={3}
      />
      <TextArea
        name="goals"
        label="What do you want to get out of CodeHub?"
        hint="Optional"
        state={state}
        rows={3}
      />
      <FormMessage state={state} />
      <div>
        <SubmitButton pending={pending}>Submit application</SubmitButton>
      </div>
    </form>
  );
}

export function MentorForm() {
  const [state, action, pending] = useActionState(
    submitMentorApplication,
    INITIAL_FORM_STATE,
  );

  if (state.status === "success") {
    return (
      <Submitted>
        We&apos;ll reach out to set up onboarding within a few days.
      </Submitted>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Full name" state={state} required />
        <Field name="email" label="Email" type="email" state={state} required />
      </div>
      <Field
        name="profession"
        label="What do you do?"
        placeholder="e.g. Backend engineer at Acme"
        state={state}
        required
      />
      <TextArea
        name="skills"
        label="Skills you could mentor in"
        placeholder="e.g. Python, React, data engineering, interview prep"
        state={state}
        rows={3}
        required
      />
      <Select
        name="availability"
        label="Availability"
        state={state}
        required
        options={[
          "1–2 hours a month",
          "2–4 hours a month",
          "4+ hours a month",
          "Events and hackathons only",
        ]}
      />
      <TextArea
        name="experience"
        label="Anything else we should know?"
        hint="Optional — past mentoring, teaching, or community work"
        state={state}
        rows={3}
      />
      <FormMessage state={state} />
      <div>
        <SubmitButton pending={pending}>Apply to mentor</SubmitButton>
      </div>
    </form>
  );
}

export function BoardForm() {
  const [state, action, pending] = useActionState(
    submitBoardApplication,
    INITIAL_FORM_STATE,
  );

  if (state.status === "success") {
    return (
      <Submitted>
        The board reviews applications on a rolling basis and will be in touch.
      </Submitted>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Full name" state={state} required />
        <Field name="email" label="Email" type="email" state={state} required />
      </div>
      <TextArea
        name="experience"
        label="Your background"
        hint="Professional, nonprofit, or governance experience"
        state={state}
        rows={4}
        required
      />
      <TextArea
        name="skills"
        label="Skills you'd bring"
        placeholder="e.g. fundraising, finance, curriculum, legal, engineering"
        state={state}
        rows={3}
        required
      />
      <TextArea
        name="motivation"
        label="Why CodeHub?"
        hint="What draws you to this mission"
        state={state}
        rows={4}
        required
      />
      <FormMessage state={state} />
      <div>
        <SubmitButton pending={pending}>Submit application</SubmitButton>
      </div>
    </form>
  );
}

export function SponsorForm({ interests }: { interests: string[] }) {
  const [state, action, pending] = useActionState(
    submitSponsorInquiry,
    INITIAL_FORM_STATE,
  );

  if (state.status === "success") {
    return (
      <Submitted>
        We&apos;ll follow up with our partnership deck within a few days.
      </Submitted>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <Honeypot />
      <Field
        name="company"
        label="Organization"
        state={state}
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Contact person" state={state} required />
        <Field name="email" label="Email" type="email" state={state} required />
      </div>
      <Select
        name="interest"
        label="Partnership interest"
        state={state}
        required
        options={interests}
      />
      <TextArea
        name="message"
        label="Anything you'd like us to know?"
        hint="Optional — budget, timing, what you'd like to fund"
        state={state}
        rows={4}
      />
      <FormMessage state={state} />
      <div>
        <SubmitButton pending={pending}>Start the conversation</SubmitButton>
      </div>
    </form>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(
    submitContactMessage,
    INITIAL_FORM_STATE,
  );

  if (state.status === "success") {
    return <Submitted>We read everything and reply within a few days.</Submitted>;
  }

  return (
    <form action={action} className="grid gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" state={state} required />
        <Field name="email" label="Email" type="email" state={state} required />
      </div>
      <Select
        name="topic"
        label="What's this about?"
        state={state}
        required
        options={[
          "General question",
          "Partnership or sponsorship",
          "Mentorship",
          "Bringing CodeHub to my school",
        ]}
      />
      <TextArea
        name="message"
        label="Message"
        state={state}
        rows={6}
        required
      />
      <FormMessage state={state} />
      <div>
        <SubmitButton pending={pending}>Send message</SubmitButton>
      </div>
    </form>
  );
}
