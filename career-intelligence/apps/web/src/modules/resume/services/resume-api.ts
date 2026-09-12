import type { Resume, ResumeAnalysis, UploadResumeResponse } from "@careerlens/shared-types";

import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";

export interface ResumeStatusResponse {
  id: string;
  status: Resume["status"];
  progress: number;
}

export const resumeApi = {
  list: () => http.get<Resume[]>(EP.RESUME_LIST),

  get: (id: string) => http.get<Resume>(EP.RESUME_GET(id)),

  getStatus: (id: string) => http.get<ResumeStatusResponse>(EP.RESUME_STATUS(id)),

  getAnalysis: (id: string) => http.get<ResumeAnalysis>(EP.RESUME_ANALYSIS(id)),

  requestUploadUrl: () => http.post<UploadResumeResponse>(EP.RESUME_UPLOAD_URL),

  confirm: (id: string) => http.post<Resume>(EP.RESUME_CONFIRM(id)),

  setPrimary: (id: string) => http.post<Resume>(EP.RESUME_SET_PRIMARY(id)),

  remove: (id: string) => http.delete<null>(EP.RESUME_DELETE(id)),
};
