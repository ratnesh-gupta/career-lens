/** Format amount_minor + ISO currency for display. */
export function formatMoney(amountMinor: number, currency: string, locale = navigator.language): string {
  const fractionDigits = currency.toUpperCase() === "JPY" || currency.toUpperCase() === "KRW" ? 0 : 2;
  const major = amountMinor / Math.pow(10, fractionDigits === 0 ? 0 : 2);

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: fractionDigits,
    }).format(major);
  } catch {
    return `${currency.toUpperCase()} ${major.toFixed(fractionDigits)}`;
  }
}

/** Best-effort country for pricing (browser locale region). */
export function detectCountryCode(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || "en-US";
    const parts = locale.replace("_", "-").split("-");
    const region = parts.length > 1 ? parts[parts.length - 1] : "";
    if (region && region.length === 2) {
      return region.toUpperCase();
    }
  } catch {
    /* ignore */
  }
  return "*";
}
