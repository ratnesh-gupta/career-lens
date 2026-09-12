import type {
  AuthResponse,
  CareerProfile,
  CareerScore,
  Resume,
  User,
} from "@careerlens/shared-types";

export const mockUser: User = {
  id: "usr_01j0000000000000",
  email: "alex.chen@example.com",
  displayName: "Alex Chen",
  avatarUrl: "https://i.pravatar.cc/150?u=alex.chen",
  role: "free",
  isEmailVerified: true,
  createdAt: "2024-03-15T10:00:00Z",
  updatedAt: "2024-09-01T12:00:00Z",
};

export const mockUser2: User = {
  id: "usr_01j0000000000099",
  email: "jordan.lee@example.com",
  displayName: "Jordan Lee",
  avatarUrl: "https://i.pravatar.cc/150?u=jordan.lee",
  role: "pro",
  isEmailVerified: true,
  createdAt: "2024-01-10T08:00:00Z",
  updatedAt: "2024-08-20T09:00:00Z",
};

export const mockAuthResponse: AuthResponse = {
  user: mockUser,
  accessToken: "mock_access_token_eyJhbGciOiJIUzI1NiJ9",
  refreshToken: "mock_refresh_token_eyJhbGciOiJIUzI1NiJ9",
  expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
};

export const mockResume: Resume = {
  id: "rsm_01j0000000000001",
  userId: mockUser.id,
  fileName: "alex-chen-resume-2024.pdf",
  fileSize: 245_000,
  mimeType: "application/pdf",
  storageKey: "resumes/usr_01j0000000000000/alex-chen-resume-2024.pdf",
  status: "analyzed",
  pageCount: 2,
  wordCount: 847,
  analysis: {
    id: "anl_01j0000000000002",
    resumeId: "rsm_01j0000000000001",
    sections: [],
    keywords: [
      { term: "TypeScript", frequency: 8, isTechnical: true, isInDemand: true },
      { term: "React", frequency: 6, isTechnical: true, isInDemand: true },
      { term: "Node.js", frequency: 4, isTechnical: true, isInDemand: true },
      { term: "leadership", frequency: 3, isTechnical: false, isInDemand: true },
    ],
    atsScore: 78,
    readabilityScore: 82,
    keywordDensity: 3.2,
    formattingIssues: ["Inconsistent date format in Experience section"],
    contentSuggestions: [
      "Add quantified achievements to your most recent role",
      "Include a brief professional summary at the top",
    ],
    missingKeywords: ["AWS", "system design", "agile"],
    analyzedAt: "2024-09-01T14:30:00Z",
  },
  isPrimary: true,
  uploadedAt: "2024-09-01T14:00:00Z",
  processedAt: "2024-09-01T14:30:00Z",
};

export const mockResumes: Resume[] = [
  mockResume,
  {
    ...mockResume,
    id: "rsm_01j0000000000010",
    fileName: "alex-chen-resume-draft.pdf",
    status: "processing",
    isPrimary: false,
    analysis: null,
    processedAt: null,
    uploadedAt: "2024-09-05T10:00:00Z",
  },
  {
    ...mockResume,
    id: "rsm_01j0000000000011",
    fileName: "alex-chen-early-career.pdf",
    status: "analyzed",
    isPrimary: false,
    wordCount: 520,
    pageCount: 1,
    uploadedAt: "2023-06-01T09:00:00Z",
    processedAt: "2023-06-01T09:20:00Z",
  },
];

export const mockCareerScore: CareerScore = {
  id: "scr_01j0000000000003",
  userId: mockUser.id,
  resumeId: mockResume.id,
  overallScore: 73,
  percentile: 68,
  grade: "B",
  breakdown: [
    {
      category: "skills_relevance",
      label: "Skills Relevance",
      score: 82,
      maxScore: 100,
      percentile: 75,
      description: "Your skill set aligns well with current market demand.",
      contributingFactors: ["TypeScript proficiency", "React expertise"],
    },
    {
      category: "experience_depth",
      label: "Experience Depth",
      score: 70,
      maxScore: 100,
      percentile: 62,
      description: "Solid experience, but quantified achievements would strengthen this score.",
      contributingFactors: ["5 years of relevant experience", "2 senior-level roles"],
    },
    {
      category: "ats_optimization",
      label: "ATS Optimization",
      score: 78,
      maxScore: 100,
      percentile: 70,
      description: "Your resume passes most ATS filters but could use keyword improvements.",
      contributingFactors: ["Clean formatting", "Standard section headers"],
    },
    {
      category: "market_demand",
      label: "Market Demand",
      score: 88,
      maxScore: 100,
      percentile: 82,
      description: "High demand for your skill set in the current market.",
      contributingFactors: ["TypeScript in top 5 hiring skills", "React demand up 23% YoY"],
    },
  ],
  strengths: [
    {
      id: "str_01",
      title: "TypeScript Expertise",
      description:
        "Deep proficiency in TypeScript is highly valued and increasingly required for senior frontend roles.",
      marketValue: "high",
      relatedSkills: ["TypeScript", "JavaScript", "React"],
      supportingEvidence: "8 mentions across your resume with demonstrated production usage.",
    },
    {
      id: "str_02",
      title: "Full-Stack Breadth",
      description:
        "Your combination of frontend and backend skills positions you for higher-impact roles.",
      marketValue: "high",
      relatedSkills: ["React", "Node.js", "PostgreSQL"],
      supportingEvidence: "3+ years of cross-stack delivery visible in your experience.",
    },
  ],
  weaknesses: [
    {
      id: "wk_01",
      title: "Missing Cloud Certifications",
      description:
        "AWS or GCP certification would significantly boost your competitiveness for senior roles.",
      impactOnScore: 8,
      relatedSkills: ["AWS", "GCP", "cloud architecture"],
      improvementPath: "AWS Solutions Architect Associate — estimated 6–8 weeks of study.",
    },
    {
      id: "wk_02",
      title: "No Quantified Achievements",
      description:
        "Your experience descriptions lack measurable outcomes, reducing recruiter confidence.",
      impactOnScore: 6,
      relatedSkills: [],
      improvementPath: "Add metrics to each bullet: percentages, time saved, revenue impacted.",
    },
  ],
  recommendations: [
    {
      id: "rec_01",
      title: "Quantify Your Impact",
      description:
        "Add numbers to your 3 most recent roles — e.g., 'Reduced page load time by 40%'.",
      priority: "critical",
      category: "resume",
      estimatedImpact: 6,
      timeToImplement: "2–3 hours",
      resources: [],
      isCompleted: false,
    },
    {
      id: "rec_02",
      title: "Add AWS to Your Skill Set",
      description:
        "AWS Solutions Architect Associate is the most requested cloud cert in your target roles.",
      priority: "high",
      category: "skills",
      estimatedImpact: 8,
      timeToImplement: "6–8 weeks",
      resources: [{ label: "AWS Training", url: "https://aws.amazon.com/training" }],
      isCompleted: false,
    },
  ],
  industryBenchmark: 69,
  roleMatch: 78,
  marketReadiness: "almost-ready",
  shareToken: "shr_abc123xyz",
  isPublic: false,
  generatedAt: "2024-09-01T15:00:00Z",
  expiresAt: "2024-10-01T15:00:00Z",
};

export const mockCareerScores: CareerScore[] = [
  mockCareerScore,
  {
    ...mockCareerScore,
    id: "scr_01j0000000000040",
    overallScore: 81,
    percentile: 79,
    grade: "B+",
    marketReadiness: "ready",
    shareToken: "shr_def456uvw",
    generatedAt: "2024-08-15T11:00:00Z",
  },
  {
    ...mockCareerScore,
    id: "scr_01j0000000000041",
    overallScore: 64,
    percentile: 48,
    grade: "C+",
    marketReadiness: "needs-work",
    shareToken: "shr_ghi789rst",
    generatedAt: "2024-07-01T16:00:00Z",
  },
];

export const mockCareerProfile: CareerProfile = {
  id: "prf_01j0000000000004",
  userId: mockUser.id,
  headline: "Senior Frontend Engineer · React · TypeScript",
  summary:
    "Product-minded engineer with 5+ years building fast, accessible web applications at scale.",
  location: "San Francisco, CA",
  linkedinUrl: "https://linkedin.com/in/alexchen",
  githubUrl: "https://github.com/alexchen",
  portfolioUrl: null,
  yearsOfExperience: 5,
  currentSalary: 165_000,
  desiredSalary: 200_000,
  isOpenToWork: true,
  isProfilePublic: true,
  publicSlug: "alex-chen",
  experiences: [],
  educations: [],
  skills: [],
  goals: [],
  createdAt: "2024-03-15T10:00:00Z",
  updatedAt: "2024-09-01T12:00:00Z",
};
