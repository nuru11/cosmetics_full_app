const APP_TIMEZONE =
  (typeof import.meta.env.VITE_APP_TIMEZONE === "string" &&
    import.meta.env.VITE_APP_TIMEZONE.trim()) ||
  "Africa/Addis_Ababa";

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });

const localeDateTimeOptions: Intl.DateTimeFormatOptions = {
  timeZone: APP_TIMEZONE,
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
};

export function formatAbsoluteDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-US", localeDateTimeOptions);
  } catch {
    return iso;
  }
}

/**
 * Relative time from an ISO timestamp, e.g. "5 seconds ago", "1 hour ago".
 * Compares UTC instants (correct regardless of display timezone).
 */
export function formatTimeAgo(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 0) return "just now";
  if (secondsAgo < 60) {
    return rtf.format(-Math.max(secondsAgo, 1), "second");
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return rtf.format(-minutesAgo, "minute");
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return rtf.format(-hoursAgo, "hour");
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return rtf.format(-daysAgo, "day");
  }

  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 5) {
    return rtf.format(-weeksAgo, "week");
  }

  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return rtf.format(-monthsAgo, "month");
  }

  const yearsAgo = Math.floor(daysAgo / 365);
  return rtf.format(-yearsAgo, "year");
}
