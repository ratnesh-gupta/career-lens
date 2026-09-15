import type { CheckoutPayload } from "@careerlens/shared-types";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay requires a browser"));
  }
  if (window.Razorpay) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay")));
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Razorpay Checkout"));
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function openRazorpayCheckout(params: {
  checkout: CheckoutPayload;
  prefill?: { name?: string; email?: string };
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss?: () => void;
}): Promise<void> {
  await loadRazorpayScript();

  if (!window.Razorpay) {
    throw new Error("Razorpay SDK not available");
  }

  const rzp = new window.Razorpay({
    key: params.checkout.keyId,
    amount: params.checkout.amount,
    currency: params.checkout.currency,
    name: params.checkout.name || "CareerLens",
    description: params.checkout.description,
    order_id: params.checkout.orderId,
    prefill: params.prefill,
    notes: {
      planCode: String(params.checkout.planCode),
      interval: params.checkout.interval,
      countryCode: params.checkout.countryCode,
      paymentId: params.checkout.paymentId,
    },
    theme: { color: "#4f46e5" },
    handler: params.onSuccess,
    modal: {
      ondismiss: params.onDismiss,
    },
  });

  rzp.open();
}
