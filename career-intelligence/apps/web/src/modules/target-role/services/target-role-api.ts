import type {
  TargetRole,
  TargetRoleCreateInput,
  TargetRoleUpdateInput,
  TargetRolesResponse,
} from "@careerlens/shared-types";

import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";

export const targetRoleApi = {
  list: () => http.get<TargetRolesResponse>(EP.TARGET_ROLES),
  create: (body: TargetRoleCreateInput) => http.post<TargetRole>(EP.TARGET_ROLES, body),
  update: (id: string, body: TargetRoleUpdateInput) =>
    http.patch<TargetRole>(EP.TARGET_ROLE(id), body),
  remove: (id: string) => http.delete<{ deleted: boolean }>(EP.TARGET_ROLE(id)),
};
