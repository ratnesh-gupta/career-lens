import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";

export interface AdminOverview {
  users: number;
  profiles: number;
  resumes: {
    total: number;
    pending: number;
    processing: number;
    analyzed: number;
    failed: number;
  };
  scores: number;
}

export interface AdminResumeRow {
  id: string;
  fileName: string;
  status: string;
  failureReason: string | null;
  fileSize: number;
  user: { id: string | null; email: string | null; displayName: string | null };
  careerProfileId: string | null;
  uploadedAt: string | null;
  processedAt: string | null;
  updatedAt: string | null;
}

export interface AdminUserRow {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string | null;
}

export const adminApi = {
  overview: () => http.get<AdminOverview>(EP.ADMIN_OVERVIEW),
  resumes: (status?: string) =>
    http.get<AdminResumeRow[]>(EP.ADMIN_RESUMES, {
      params: status ? { status } : undefined,
    }),
  reprocess: (id: string) => http.post<{ id: string; status: string; message: string }>(EP.ADMIN_RESUME_REPROCESS(id)),
  users: (q?: string) =>
    http.get<AdminUserRow[]>(EP.ADMIN_USERS, {
      params: q ? { q } : undefined,
    }),
};
