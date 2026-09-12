import type { UUID, Timestamp } from "./common.js";

export type ResumeStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "analyzed"
  | "failed";

export type ResumeSectionType =
  | "contact"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "projects"
  | "awards"
  | "languages"
  | "volunteer"
  | "publications"
  | "other";

export interface ResumeSectionItem {
  raw: string;
  structured: Record<string, unknown>;
  confidence: number;
}

export interface ResumeSection {
  type: ResumeSectionType;
  title: string;
  rawText: string;
  items: ResumeSectionItem[];
  pageNumber: number;
  boundingBox: { x: number; y: number; width: number; height: number } | null;
}

export interface ResumeKeyword {
  term: string;
  frequency: number;
  isTechnical: boolean;
  isInDemand: boolean;
}

export interface ResumeAnalysis {
  id: UUID;
  resumeId: UUID;
  sections: ResumeSection[];
  keywords: ResumeKeyword[];
  atsScore: number;
  readabilityScore: number;
  keywordDensity: number;
  formattingIssues: string[];
  contentSuggestions: string[];
  missingKeywords: string[];
  analyzedAt: Timestamp;
}

export interface Resume {
  id: UUID;
  userId: UUID;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
  status: ResumeStatus;
  pageCount: number | null;
  wordCount: number | null;
  analysis: ResumeAnalysis | null;
  isPrimary: boolean;
  uploadedAt: Timestamp;
  processedAt: Timestamp | null;
}

export interface UploadResumeResponse {
  uploadUrl: string;
  resumeId: UUID;
  expiresAt: Timestamp;
}
