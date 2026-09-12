const REF_KEY = "careerlens_ref";
const REF_EXPIRY_KEY = "careerlens_ref_exp";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** Capture ?ref= on landing; store 30 days. */
export function captureReferralFromUrl(search: string = window.location.search): void {
  const params = new URLSearchParams(search);
  const ref = params.get("ref");
  if (!ref) return;
  localStorage.setItem(REF_KEY, ref);
  localStorage.setItem(REF_EXPIRY_KEY, String(Date.now() + THIRTY_DAYS_MS));
}

export function getStoredReferral(): string | null {
  const exp = localStorage.getItem(REF_EXPIRY_KEY);
  if (exp && Date.now() > Number(exp)) {
    localStorage.removeItem(REF_KEY);
    localStorage.removeItem(REF_EXPIRY_KEY);
    return null;
  }
  return localStorage.getItem(REF_KEY);
}
