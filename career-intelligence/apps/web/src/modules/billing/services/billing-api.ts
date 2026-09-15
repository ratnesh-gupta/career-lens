import type {
  CheckoutPayload,
  CheckoutRequest,
  EntitlementsSnapshot,
  PlansResponse,
  SubscriptionSummary,
} from "@careerlens/shared-types";

import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";

export const billingApi = {
  plans: (country?: string, interval: "month" | "year" = "month") => {
    const params = new URLSearchParams();
    if (country) params.set("country", country);
    params.set("interval", interval);
    const qs = params.toString();
    return http.get<PlansResponse>(`${EP.BILLING_PLANS}?${qs}`);
  },
  entitlements: () => http.get<EntitlementsSnapshot>(EP.BILLING_ENTITLEMENTS),
  subscription: () => http.get<SubscriptionSummary>(EP.BILLING_SUBSCRIPTION),
  checkout: (body: CheckoutRequest) =>
    http.post<CheckoutPayload>(EP.BILLING_CHECKOUT, body),
};
