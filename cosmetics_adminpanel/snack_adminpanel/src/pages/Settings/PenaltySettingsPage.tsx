import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import InputField from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import {
  getDefaultPenaltyPercent,
  updateDefaultPenaltyPercent,
} from "../../services/settings.service";

export default function PenaltySettingsPage() {
  const [defaultPenaltyPercent, setDefaultPenaltyPercent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const value = await getDefaultPenaltyPercent();
        if (cancelled) return;
        setDefaultPenaltyPercent(String(value));
      } catch (err) {
        console.error("Failed to fetch penalty settings:", err);
        if (!cancelled) setError("Failed to load penalty settings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const value = Number(defaultPenaltyPercent);
    if (!Number.isFinite(value) || value < 0) {
      setError("Default penalty percent must be a non-negative number.");
      return;
    }

    setSubmitting(true);
    try {
      const saved = await updateDefaultPenaltyPercent(value);
      setDefaultPenaltyPercent(String(saved));
      setSuccess("Penalty settings updated successfully.");
    } catch (err) {
      console.error("Failed to update penalty settings:", err);
      setError("Failed to update penalty settings.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Penalty Settings | Snack Admin"
        description="Manage penalty percentage used for overdue contributions."
      />
      <PageBreadcrumb pageTitle="Penalty Settings" />
      <div className="space-y-6">
        <ComponentCard title="Default penalty percent">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              )}

              <InputField
                type="number"
                placeholder="e.g. 0.02"
                value={defaultPenaltyPercent}
                onChange={(e) => setDefaultPenaltyPercent(e.target.value)}
                disabled={submitting}
                min="0"
                step={0.000001}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Example: 0.02 means 2% per day. Penalty = days × roundAmount ×
                percent.
              </p>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Penalty Settings"}
              </Button>
            </form>
          )}
        </ComponentCard>
      </div>
    </>
  );
}

