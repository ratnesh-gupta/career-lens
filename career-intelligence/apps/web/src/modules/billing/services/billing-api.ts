import type { EntitlementsSnapshot, PlansResponse } from "@careerlens/shared-types";

import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";

export const billingApi = {
  plans: () => http.get<PlansResponse>(EP.BILLING_PLANS),
  entitlements: () => http.get<EntitlementsSnapshot>(EP.BILLING_ENTITLEMENTS),
};
