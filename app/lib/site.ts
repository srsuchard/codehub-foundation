export const CONTACT_EMAIL = "hello@codehubfoundation.org";

/**
 * Social accounts. Add only accounts that actually exist — a dead link on a
 * nonprofit's site costs more trust than an absent one. The footer renders
 * nothing at all while this is empty.
 *
 * Example:
 *   { label: "GitHub", href: "https://github.com/codehubfoundation" },
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://codehubfoundation.org";

/**
 * Impact numbers. Start at zero and update these as the foundation grows —
 * they render straight to the homepage.
 */
export const IMPACT = [
  { value: "0", label: "Students served" },
  { value: "0", label: "Projects created" },
  { value: "0", label: "Mentors involved" },
  { value: "0", label: "Events hosted" },
];

export const PROGRAMS = [
  {
    slug: "academy",
    icon: "💻",
    title: "CodeHub Academy",
    accent: "border-neon-blue/40",
    summary:
      "Free, cohort-based courses that take students from first line of code to a finished project.",
    detail:
      "Every track is project-based and taught in small cohorts, so students finish with something they built rather than a certificate. No prior experience required, and all materials are free.",
    topics: [
      "Python",
      "Web Development",
      "Mobile Apps",
      "AI",
      "Cybersecurity",
      "GitHub & Open Source",
    ],
  },
  {
    slug: "mentorship",
    icon: "🤝",
    title: "Mentorship",
    accent: "border-neon-green/40",
    summary:
      "One-on-one pairing with a working professional for code review, career guidance, and support.",
    detail:
      "We match each student with someone doing the work today. Mentors meet their student a couple of hours a month — enough to unblock problems, review real code, and answer the questions a curriculum can't.",
    topics: [
      "Software engineers",
      "Developers",
      "STEM professionals",
      "College students",
    ],
  },
  {
    slug: "hackathons",
    icon: "🚀",
    title: "Hackathons",
    accent: "border-neon-purple/40",
    summary:
      "Weekend build sprints where student teams ship something real, with engineers on hand as coaches.",
    detail:
      "Students form teams, pick a problem in their own school or community, and build a working solution in a weekend. Every event ends with teams presenting what they made to a room of peers and mentors.",
    topics: ["Form teams", "Solve problems", "Build projects", "Present solutions"],
  },
  {
    slug: "innovation-lab",
    icon: "🔬",
    title: "Student Innovation Lab",
    accent: "border-neon-blue/40",
    summary:
      "Ongoing space for students to take their own ideas from prototype to something people use.",
    detail:
      "The Lab is for students who already have an idea and want to build it properly — with code review, design feedback, and help getting a project published and maintained in the open.",
    topics: ["Apps", "Websites", "AI projects", "Open-source tools"],
  },
];

export const VALUES = [
  {
    title: "Innovation",
    body: "Building creative solutions to problems that matter.",
    accent: "text-neon-blue",
  },
  {
    title: "Accessibility",
    body: "Making technology education available to everyone, at no cost.",
    accent: "text-neon-purple",
  },
  {
    title: "Community",
    body: "Learning together, and lifting up the people learning beside you.",
    accent: "text-neon-green",
  },
  {
    title: "Responsibility",
    body: "Using technology ethically and considering who it affects.",
    accent: "text-neon-blue",
  },
];

export const MENTOR_EXPECTATIONS = [
  "2–4 hours a month, remote and flexible",
  "Pair with one student or coach a hackathon team",
  "Review code, resumes, and project portfolios",
  "No teaching experience needed — we onboard you",
];

export const STUDENT_RESOURCES = [
  {
    title: "freeCodeCamp",
    href: "https://www.freecodecamp.org/",
    body: "Free, self-paced curriculum covering web development and beyond.",
  },
  {
    title: "The Odin Project",
    href: "https://www.theodinproject.com/",
    body: "Full-stack curriculum built around projects you actually ship.",
  },
  {
    title: "CS50 (Harvard)",
    href: "https://cs50.harvard.edu/x/",
    body: "The introduction to computer science, free and online.",
  },
  {
    title: "GitHub Student Pack",
    href: "https://education.github.com/pack",
    body: "Free developer tools and credits for verified students.",
  },
];

/**
 * Leadership team. Fill in `name` and `bio` as seats are filled — any entry
 * left without a name renders as an open seat rather than a fake person.
 */
export const BOARD: {
  position: string;
  name?: string;
  bio?: string;
}[] = [
  {
    position: "Founder & President",
    name: "Samuel Suchard",
    // bio: "Add a sentence or two here and it appears under the name.",
  },
  { position: "Board Chair" },
  { position: "Treasurer" },
  { position: "Secretary" },
  { position: "Technology Director" },
];

export const SPONSOR_TIERS = [
  {
    name: "Community Partner",
    accent: "border-line",
    featured: false,
    summary: "Support events and community programming.",
    benefits: [
      "Underwrites a workshop or community meetup",
      "Logo on event materials",
      "Quarterly impact report",
    ],
  },
  {
    name: "Technology Partner",
    accent: "border-neon-purple ring-1 ring-neon-purple/30",
    featured: true,
    summary: "Provide the tools and resources students learn on.",
    benefits: [
      "Provides software licenses, cloud credits, or hardware",
      "Logo on our website and event materials",
      "Invite your engineers to mentor",
      "Quarterly impact report",
    ],
  },
  {
    name: "Innovation Partner",
    accent: "border-neon-blue/50",
    featured: false,
    summary: "Fund a full program end to end.",
    benefits: [
      "Names a learning track or hackathon",
      "Co-branded student showcase",
      "Recruiting pipeline access",
      "Annual partnership review",
    ],
  },
];

export const SPONSOR_INTERESTS = SPONSOR_TIERS.map((tier) => tier.name).concat(
  "Not sure yet — let's talk",
);

export const EVENT_TYPES = [
  {
    icon: "🧑‍🏫",
    title: "Workshops",
    body: "Short, focused sessions on one topic — Git, APIs, deploying your first site.",
  },
  {
    icon: "🚀",
    title: "Hackathons",
    body: "Weekend builds where teams ship a working project and present it.",
  },
  {
    icon: "💡",
    title: "Coding events",
    body: "Study halls, code reviews, and pair-programming sessions with mentors.",
  },
  {
    icon: "👥",
    title: "Community meetings",
    body: "Open sessions where students, mentors, and families meet the team.",
  },
];

/**
 * Upcoming events. Add entries as they're scheduled; an empty list renders
 * the "nothing scheduled yet" state.
 */
export const EVENTS: {
  title: string;
  date: string;
  location: string;
  description: string;
  registerUrl?: string;
}[] = [];

export const PROJECT_TYPES = [
  "Apps",
  "Websites",
  "AI projects",
  "Open-source tools",
  "Hackathon builds",
];

/**
 * Student work. Add entries as projects ship; an empty list renders the
 * "first projects coming soon" state.
 */
export const PROJECTS: {
  title: string;
  student: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
}[] = [];
