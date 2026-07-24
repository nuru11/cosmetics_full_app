export function normalizeTelegramUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const username = trimmed.replace(/^@/, "");
  return `https://t.me/${encodeURIComponent(username)}`;
}

export function phoneHref(value: string): string {
  const digits = value.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

export function emailHref(value: string): string {
  return `mailto:${value.trim()}`;
}
