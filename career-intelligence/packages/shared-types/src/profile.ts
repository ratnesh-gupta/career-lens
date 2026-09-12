import type { UUID, Timestamp } from "./common.js";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship";
export type CareerGoalType =
  | "promotion"
  | "career-change"
  | "salary-increase"
  | "skill-building"
  | "leadership"
  | "entrepreneurship";

export interface Skill {
  id: UUID;
  name: string;
  level: SkillLevel;
  yearsOfExperience: number;
  endorsements: number;
  isVerified: boolean;
}

export interface Experience {
  id: UUID;
  company: string;
  title: string;
  employmentType: EmploymentType;
  location: string | null;
  isRemote: boolean;
  startDate: Timestamp;
  endDate: Timestamp | null;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  skills: string[];
}

export interface Education {
  id: UUID;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Timestamp;
  endDate: Timestamp | null;
  gpa: number | null;
  honors: string[];
  activities: string[];
}

export interface CareerGoal {
  id: UUID;
  type: CareerGoalType;
  title: string;
  description: string;
  targetDate: Timestamp | null;
  targetSalary: number | null;
  targetRole: string | null;
  targetIndustry: string | null;
  isActive: boolean;
}

export interface CareerProfile {
  id: UUID;
  userId: UUID;
  headline: string;
  summary: string;
  location: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  yearsOfExperience: number;
  currentSalary: number | null;
  desiredSalary: number | null;
  isOpenToWork: boolean;
  isProfilePublic: boolean;
  publicSlug: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  goals: CareerGoal[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UpdateProfileInput {
  headline?: string;
  summary?: string;
  location?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  desiredSalary?: number | null;
  isOpenToWork?: boolean;
  isProfilePublic?: boolean;
}
