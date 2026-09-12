/* Formatting utilities — date, number, currency, score */

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const relativeFormatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat("en-US", { notation: "compact" });

export function formatDate(date: string | Date): string {
  return dateFormatter.format(typeof date === "string" ? new Date(date) : date);
}

export function formatRelativeTime(date: string | Date): string {
  const target = typeof date === "string" ? new Date(date) : date;
  const diffMs = target.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (Math.abs(diffHours) < 1) {
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      return relativeFormatter.format(diffMinutes, "minute");
    }
    return relativeFormatter.format(diffHours, "hour");
  }
  if (Math.abs(diffDays) < 30) return relativeFormatter.format(diffDays, "day");
  const diffMonths = Math.round(diffDays / 30);
  return relativeFormatter.format(diffMonths, "month");
}

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatNumber(value: number): string {
  return compactFormatter.format(value);
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatScore(score: number): string {
  return Math.round(score).toString();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatMonthYear(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(
    typeof date === "string" ? new Date(date) : date,
  );
}

/** Truncates text to maxLength with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

/** Converts a snake_case or kebab-case string to Title Case */
export function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
