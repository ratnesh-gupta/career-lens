/**
 * This file is generated from docs/api/openapi-v1.yaml.
 * Do not edit by hand.
 *
 * Regenerate:
 *   pnpm openapi:generate
 *
 * Seeded manually for CI/typecheck until the first local generate run commits a full openapi-typescript output.
 * After `pnpm openapi:generate`, this file will be replaced with the full paths/components map.
 */

export interface paths {
  "/health": {
    get: operations["getHealth"];
  };
  "/auth/register": {
    post: operations["authRegister"];
  };
  "/auth/login": {
    post: operations["authLogin"];
  };
  "/auth/logout": {
    post: operations["authLogout"];
  };
  "/auth/me": {
    get: operations["authMe"];
  };
  "/auth/refresh": {
    post: operations["authRefresh"];
  };
  "/profile": {
    get: operations["getProfile"];
    patch: operations["updateProfile"];
  };
  "/resumes": {
    get: operations["listResumes"];
  };
  "/resumes/upload-url": {
    post: operations["createResumeUploadUrl"];
  };
  "/resumes/{id}/confirm": {
    post: operations["confirmResumeUpload"];
  };
  "/resumes/{id}": {
    get: operations["getResume"];
    delete: operations["deleteResume"];
  };
  "/resumes/{id}/status": {
    get: operations["getResumeStatus"];
  };
  "/resumes/{id}/analysis": {
    get: operations["getResumeAnalysis"];
  };
  "/resumes/{id}/primary": {
    post: operations["setPrimaryResume"];
  };
  "/scores": {
    get: operations["listScores"];
  };
  "/scores/generate": {
    post: operations["generateScore"];
  };
  "/scores/{id}": {
    get: operations["getScore"];
  };
  "/scores/{id}/share": {
    post: operations["createScoreShare"];
  };
  "/public/scores/{token}": {
    get: operations["getPublicScore"];
  };
  "/public/profiles/{slug}": {
    get: operations["getPublicProfile"];
  };
  "/referrals/code": {
    get: operations["getReferralCode"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    SuccessEnvelope: {
      success: true;
      data: unknown;
      meta?: Record<string, unknown>;
    };
    ErrorEnvelope: {
      success: false;
      error: components["schemas"]["ApiError"];
    };
    ApiError: {
      code: string;
      message: string;
      details?: Record<string, unknown>;
    };
    User: {
      id: string;
      email: string;
      displayName: string;
      avatarUrl: string | null;
      role: "free" | "pro" | "enterprise";
      isEmailVerified: boolean;
      createdAt: string;
      updatedAt: string;
    };
    AuthPayload: {
      user: components["schemas"]["User"];
      accessToken: string;
      refreshToken: string;
      expiresAt: string;
    };
    TokenPair: {
      accessToken: string;
      refreshToken: string;
      expiresAt: string;
    };
    RegisterRequest: {
      email: string;
      password: string;
      displayName: string;
    };
    LoginRequest: {
      email: string;
      password: string;
    };
    CareerProfile: {
      id: string;
      userId: string;
      headline?: string | null;
      summary?: string | null;
      location?: string | null;
      linkedinUrl?: string | null;
      githubUrl?: string | null;
      portfolioUrl?: string | null;
      yearsOfExperience?: number | null;
      currentSalary?: number | null;
      desiredSalary?: number | null;
      isOpenToWork?: boolean;
      isProfilePublic?: boolean;
      publicSlug?: string | null;
      createdAt: string;
      updatedAt: string;
    };
    CareerProfileUpdateRequest: {
      headline?: string;
      summary?: string;
      location?: string;
      linkedinUrl?: string;
      githubUrl?: string;
      portfolioUrl?: string;
      yearsOfExperience?: number;
      currentSalary?: number;
      desiredSalary?: number;
      isOpenToWork?: boolean;
      isProfilePublic?: boolean;
      publicSlug?: string;
    };
    ResumeStatus: "pending" | "processing" | "analyzed" | "failed";
    Resume: {
      id: string;
      userId: string;
      fileName: string;
      fileSize?: number;
      mimeType?: string;
      storageKey?: string;
      status: components["schemas"]["ResumeStatus"];
      pageCount?: number | null;
      wordCount?: number | null;
      analysis?: components["schemas"]["ResumeAnalysis"] | null;
      isPrimary: boolean;
      uploadedAt: string;
      processedAt?: string | null;
    };
    ResumeUploadUrl: {
      uploadUrl: string;
      resumeId: string;
      expiresAt: string;
    };
    ResumeStatusPayload: {
      id: string;
      status: components["schemas"]["ResumeStatus"];
      progress: number;
    };
    ResumeAnalysis: {
      id?: string;
      resumeId?: string;
      atsScore?: number;
      readabilityScore?: number;
      keywordDensity?: number;
      formattingIssues?: string[];
      contentSuggestions?: string[];
      missingKeywords?: string[];
      analyzedAt?: string;
    } | null;
    CareerScoreRequest: {
      careerProfileId?: string;
      evidenceResumeId?: string | null;
      targetRoleId?: string | null;
    };
    CareerScore: {
      id: string;
      careerProfileId?: string;
      evidenceResumeId?: string | null;
      overallScore: number;
      percentile?: number;
      grade: string;
      marketReadiness?: string;
      shareToken?: string | null;
      isPublic?: boolean;
      generatedAt: string;
      expiresAt?: string | null;
    };
    ScoreShare: {
      token: string;
      url: string;
    };
    PublicScore: {
      overallScore: number;
      percentile?: number;
      grade: string;
      marketReadiness?: string;
      ownerDisplayName?: string | null;
      ownerAvatarUrl?: string | null;
      generatedAt: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type operations = {
  getHealth: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"];
        };
      };
    };
  };
  authRegister: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["RegisterRequest"];
      };
    };
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["AuthPayload"];
          };
        };
      };
    };
  };
  authLogin: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["LoginRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["AuthPayload"];
          };
        };
      };
    };
  };
  authLogout: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"];
        };
      };
    };
  };
  authMe: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["User"];
          };
        };
      };
    };
  };
  authRefresh: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["TokenPair"];
          };
        };
      };
    };
  };
  getProfile: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["CareerProfile"];
          };
        };
      };
    };
  };
  updateProfile: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["CareerProfileUpdateRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["CareerProfile"];
          };
        };
      };
    };
  };
  listResumes: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["Resume"][];
          };
        };
      };
    };
  };
  createResumeUploadUrl: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["ResumeUploadUrl"];
          };
        };
      };
    };
  };
  confirmResumeUpload: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["Resume"];
          };
        };
      };
    };
  };
  getResume: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["Resume"];
          };
        };
      };
    };
  };
  deleteResume: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"];
        };
      };
    };
  };
  getResumeStatus: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["ResumeStatusPayload"];
          };
        };
      };
    };
  };
  getResumeAnalysis: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["ResumeAnalysis"];
          };
        };
      };
    };
  };
  setPrimaryResume: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["Resume"];
          };
        };
      };
    };
  };
  listScores: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["CareerScore"][];
          };
        };
      };
    };
  };
  generateScore: {
    requestBody?: {
      content: {
        "application/json": components["schemas"]["CareerScoreRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["CareerScore"];
          };
        };
      };
    };
  };
  getScore: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["CareerScore"];
          };
        };
      };
    };
  };
  createScoreShare: {
    responses: {
      201: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["ScoreShare"];
          };
        };
      };
    };
  };
  getPublicScore: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["PublicScore"];
          };
        };
      };
    };
  };
  getPublicProfile: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: components["schemas"]["CareerProfile"];
          };
        };
      };
    };
  };
  getReferralCode: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["SuccessEnvelope"] & {
            data: { code: string };
          };
        };
      };
    };
  };
};

export type external = Record<string, never>;
