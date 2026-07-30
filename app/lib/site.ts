export const CONTACT_EMAIL = "hello@codehubfoundation.org";

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
