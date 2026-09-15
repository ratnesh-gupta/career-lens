/** All landing-page copy lives here. Do not hardcode strings in JSX. */

export const LANDING = {
  brand: {
    name: "CareerLens",
    tagline: "Personal Career Intelligence Platform",
  },

  nav: {
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Login", href: "/login" },
    ],
    cta: "Get My Career Score — Free",
  },

  hero: {
    headline: "How does the job market see you?",
    subheadline:
      "Upload your resume. Get a Career Score. Know exactly what to improve.",
    primaryCta: "Get My Career Score — Free",
    secondaryCta: "See a sample score",
    trustLine: "No credit card. Takes 60 seconds.",
    sampleScore: 78,
  },

  problem: {
    eyebrow: "The problem",
    title: "You're applying into a black box",
    items: [
      {
        title: "You apply. You hear nothing.",
        description:
          "Applications disappear into ATS systems. Feedback is rare. You're left guessing what went wrong.",
      },
      {
        title: "Your resume looks fine — but isn't.",
        description:
          "What reads well to you may fail keyword filters, lack quantified impact, or miss what hiring managers scan for.",
      },
      {
        title: "You don't know what's missing.",
        description:
          "Without a clear score and breakdown, improvement is trial and error — and time you don't have.",
      },
    ],
  },

  howItWorks: {
    id: "how-it-works",
    eyebrow: "How it works",
    title: "Three steps to clarity",
    steps: [
      {
        step: 1,
        title: "Upload your resume",
        description: "PDF only. Secure upload. We extract structure, skills, and signals automatically.",
      },
      {
        step: 2,
        title: "Get your Career Score",
        description:
          "An overall score plus breakdown across experience, skills, impact, positioning, and more.",
      },
      {
        step: 3,
        title: "Improve & share",
        description:
          "Act on strengths and gaps. Share a public score card when you're ready — optional, always in your control.",
      },
    ],
  },

  scorePreview: {
    eyebrow: "Sample score",
    title: "See what a Career Score looks like",
    overall: 78,
    max: 100,
    categories: [
      { label: "Experience", score: 82 },
      { label: "Skills", score: 76 },
      { label: "Impact", score: 71 },
      { label: "Positioning", score: 84 },
      { label: "Resume Quality", score: 79 },
      { label: "Target Alignment", score: 75 },
    ],
    strengths: [
      "Technical Leadership",
      "Strong Experience",
      "Broad Skill Coverage",
    ],
    gaps: [
      "Quantifiable Impact",
      "Target Role Positioning",
      "Cloud Experience",
    ],
  },

  features: {
    id: "features",
    eyebrow: "Features",
    title: "Everything you need to understand your market fit",
    items: [
      {
        title: "Resume Intelligence",
        description:
          "Structured extraction of experience, skills, and keywords — so nothing important is left unread.",
        badge: null as string | null,
      },
      {
        title: "ATS Estimate",
        description:
          "A practical view of how applicant tracking systems are likely to parse and rank your resume.",
        badge: null,
      },
      {
        title: "Career Score",
        description:
          "One clear number with a breakdown — so you know where you stand and what moves the needle.",
        badge: null,
      },
      {
        title: "Strengths & Gaps",
        description:
          "Actionable strengths to lean on and gaps to close, with plain-language recommendations.",
        badge: null,
      },
      {
        title: "Target Role Alignment",
        description:
          "Compare your profile against a specific role or job description. Coming in CareerLens Pro.",
        badge: "R1b",
      },
      {
        title: "Resume Optimization",
        description:
          "AI-assisted rewrites, before/after editing, and version history. Coming in CareerLens Pro.",
        badge: "R1b",
      },
    ],
  },

  personas: {
    eyebrow: "Who it's for",
    title: "Built for every stage of the journey",
    items: [
      {
        title: "Student",
        description: "Translate coursework and projects into a market-ready signal.",
      },
      {
        title: "Fresh Graduate",
        description: "Close the gap between campus and your first full-time role.",
      },
      {
        title: "Active Job Seeker",
        description: "Stop guessing. Get a score and a plan before the next application.",
      },
      {
        title: "Experienced Professional",
        description: "Refresh positioning and quantify impact for senior opportunities.",
      },
      {
        title: "Career Switcher",
        description: "Map transferable skills and close the narrative for a new path.",
      },
    ],
  },

  testimonials: {
    eyebrow: "Sample stories",
    title: "What people say",
    disclaimer: "Sample content for design preview — not real user quotes.",
    items: [
      {
        quote:
          "I finally understood why my applications went silent. The score breakdown made the gaps obvious.",
        name: "Sam R.",
        role: "Product designer, sample",
      },
      {
        quote:
          "Took less than a minute. The ATS notes alone were worth the upload.",
        name: "Priya K.",
        role: "Software engineer, sample",
      },
      {
        quote:
          "Sharing my score with a mentor started a much better career conversation.",
        name: "Jordan L.",
        role: "Career switcher, sample",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered",
    items: [
      {
        question: "Is this really free?",
        answer:
          "Yes. Getting your Career Score is free in R1a. No credit card required. Paid features like target-role alignment and AI optimization come later as optional Pro tools.",
      },
      {
        question: "Is my resume private?",
        answer:
          "Your resume is private by default. We process it to generate your score and analysis. Public sharing is opt-in only — you choose what others can see.",
      },
      {
        question: "How is the score calculated?",
        answer:
          "We combine resume structure, skills signals, experience depth, impact language, ATS-oriented quality, and market alignment into category scores and an overall Career Score. The breakdown shows exactly what contributed.",
      },
      {
        question: "What file formats are supported?",
        answer:
          "R1a supports PDF only (max 5 MB). Scanned image-only PDFs are rejected with a clear message. DOCX support is planned for a later release.",
      },
      {
        question: "What happens after I get my score?",
        answer:
          "You'll see strengths, gaps, and recommendations. You can revisit your analysis, upload an updated resume, and optionally share a public score card. Pro optimization tools unlock in a future release.",
      },
    ],
  },

  finalCta: {
    title: "Understand how the job market sees you — in 60 seconds.",
    description: "Free Career Score. No credit card. Clear next steps.",
    cta: "Get My Career Score — Free",
  },

  footer: {
    product: {
      title: "Product",
      links: [
        { label: "How it works", href: "#how-it-works" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Sample score", href: "#score-preview" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Login", href: "/login" },
        { label: "Register", href: "/register" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Cookies", href: "/cookies" },
      ],
    },
    social: {
      title: "Social",
      links: [
        { label: "Twitter / X", href: "https://twitter.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
      ],
    },
    copyright: `© ${new Date().getFullYear()} CareerLens. All rights reserved.`,
  },

  seo: {
    title: "CareerLens — How does the job market see you?",
    description:
      "Upload your resume. Get a free Career Score with strengths, gaps, and clear next steps. No credit card required.",
    canonicalPath: "/",
  },
} as const;
