import type { UUID } from "./common.js";

export interface TargetRole {
  id: UUID;
  roleName: string;
  industry: string | null;
  seniority: string | null;
  location: string | null;
  notes: string | null;
  status: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface TargetRolesResponse {
  items: TargetRole[];
}

export interface TargetRoleCreateInput {
  roleName: string;
  industry?: string | null;
  seniority?: string | null;
  location?: string | null;
  notes?: string | null;
}

export interface TargetRoleUpdateInput {
  roleName?: string;
  industry?: string | null;
  seniority?: string | null;
  location?: string | null;
  notes?: string | null;
  status?: "active" | "archived";
  sortOrder?: number;
}
