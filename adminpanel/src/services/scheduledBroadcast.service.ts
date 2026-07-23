import api from "../lib/api";

export interface ScheduledBroadcastConfig {
  enabled: boolean;
  title: string;
  body: string;
  hour: number;
  minute: number;
  timezone: string;
  lastFiredLocalDate?: string | null;
}

export async function getScheduledBroadcast(): Promise<ScheduledBroadcastConfig> {
  const { data } = await api.get<{ data: ScheduledBroadcastConfig }>(
    "/admin/scheduled-broadcast"
  );
  return data.data;
}

export async function updateScheduledBroadcast(
  payload: Omit<ScheduledBroadcastConfig, "lastFiredLocalDate">
): Promise<ScheduledBroadcastConfig> {
  const { data } = await api.put<{ data: ScheduledBroadcastConfig }>(
    "/admin/scheduled-broadcast",
    payload
  );
  return data.data;
}

export async function sendImmediateBroadcast(payload: {
  title: string;
  body: string;
}): Promise<void> {
  await api.post("/admin/broadcast/immediate", payload);
}

export const SCHEDULED_BROADCAST_TIMEZONES = [
  "UTC",
  "Africa/Addis_Ababa",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "Africa/Cairo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
] as const;
