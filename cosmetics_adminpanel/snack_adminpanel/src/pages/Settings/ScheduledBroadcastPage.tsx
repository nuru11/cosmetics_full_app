import { useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import InputField from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import {
  getScheduledBroadcast,
  updateScheduledBroadcast,
  sendImmediateBroadcast,
  SCHEDULED_BROADCAST_TIMEZONES,
} from "../../services/scheduledBroadcast.service";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toTimeValue(hour: number, minute: number): string {
  return `${pad2(hour)}:${pad2(minute)}`;
}

function parseTimeValue(s: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export default function ScheduledBroadcastPage() {
  const [enabled, setEnabled] = useState(false);
  const [title, setTitle] = useState("Snack");
  const [body, setBody] = useState("");
  const [timeValue, setTimeValue] = useState("09:00");
  const [timezone, setTimezone] = useState("UTC");
  const [lastFired, setLastFired] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [nowTitle, setNowTitle] = useState("");
  const [nowBody, setNowBody] = useState("");
  const [sendNowLoading, setSendNowLoading] = useState(false);
  const [nowError, setNowError] = useState<string | null>(null);
  const [nowSuccess, setNowSuccess] = useState<string | null>(null);

  const timezoneOptions = useMemo(() => {
    const set = new Set<string>([...SCHEDULED_BROADCAST_TIMEZONES]);
    if (timezone && !set.has(timezone)) set.add(timezone);
    return Array.from(set).sort();
  }, [timezone]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const cfg = await getScheduledBroadcast();
        if (cancelled) return;
        setEnabled(cfg.enabled);
        setTitle(cfg.title || "Snack");
        setBody(cfg.body ?? "");
        setTimeValue(toTimeValue(cfg.hour, cfg.minute));
        setTimezone(cfg.timezone || "UTC");
        setLastFired(cfg.lastFiredLocalDate ?? null);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load scheduled broadcast settings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSendNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setNowError(null);
    setNowSuccess(null);
    const t = nowTitle.trim() || "Snack";
    const b = nowBody.trim();
    if (!b) {
      setNowError("Message body is required.");
      return;
    }
    setSendNowLoading(true);
    try {
      await sendImmediateBroadcast({ title: t, body: b });
      setNowSuccess("Notification sent to all subscribed devices.");
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
          ? String((err.response.data as { error?: string }).error)
          : "Send failed. Check that Firebase is configured on the server.";
      setNowError(msg);
    } finally {
      setSendNowLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const parsed = parseTimeValue(timeValue);
    if (!parsed) {
      setError("Time must be HH:MM (24h), e.g. 09:30.");
      return;
    }
    setSubmitting(true);
    try {
      const saved = await updateScheduledBroadcast({
        enabled,
        title: title.trim() || "Snack",
        body: body.trim(),
        hour: parsed.hour,
        minute: parsed.minute,
        timezone: timezone.trim() || "UTC",
      });
      setLastFired(saved.lastFiredLocalDate ?? null);
      setSuccess("Scheduled broadcast settings saved.");
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "error" in err.response.data
          ? String((err.response.data as { error?: string }).error)
          : "Failed to save settings.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Scheduled broadcast | Snack Admin"
        description="Daily push notification time and message for the mobile app."
      />
      <PageBreadcrumb pageTitle="Scheduled broadcast" />
      <div className="space-y-6">
        <ComponentCard title="Send notification now">
          <form onSubmit={handleSendNow} className="space-y-4 max-w-xl">
            {nowError && (
              <p className="text-sm text-red-600 dark:text-red-400">{nowError}</p>
            )}
            {nowSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {nowSuccess}
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sends immediately to every device that has opened the app and
              subscribed to the broadcast topic (same audience as the daily
              scheduled push).
            </p>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <InputField
                type="text"
                placeholder={"e.g. Today's special"}
                value={nowTitle}
                onChange={(e) => setNowTitle(e.target.value)}
                disabled={sendNowLoading}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <TextArea
                rows={3}
                placeholder="Notification message shown to users"
                value={nowBody}
                onChange={setNowBody}
                disabled={sendNowLoading}
              />
            </div>
            <Button type="submit" disabled={sendNowLoading}>
              {sendNowLoading ? "Sending…" : "Send now"}
            </Button>
          </form>
        </ComponentCard>

        <ComponentCard title="Daily FCM broadcast">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              )}

              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  disabled={submitting}
                  className="rounded border-gray-300"
                />
                Enable daily broadcast
              </label>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <InputField
                  type="text"
                  placeholder="Notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message body
                </label>
                <TextArea
                  rows={4}
                  placeholder="Shown in the notification. Leave empty to skip sends until you add text."
                  value={body}
                  onChange={setBody}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Local time (24h)
                </label>
                <input
                  type="time"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  disabled={submitting}
                  className="w-full max-w-xs rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timezone (IANA)
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  disabled={submitting}
                  className="w-full max-w-md rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                >
                  {timezoneOptions.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  The server fires once per local calendar day when the clock
                  matches this time. Users must open the app once so the device
                  subscribes to the broadcast topic.
                </p>
              </div>

              {lastFired != null && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last sent (local date in configured timezone):{" "}
                  <span className="font-mono">{lastFired}</span>
                </p>
              )}

              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Save"}
              </Button>
            </form>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
