import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import api from "../../lib/api";
import {
  getDefaultPrivacyPolicyPdf,
  updateDefaultPrivacyPolicyPdf,
  uploadPrivacyPolicyPdf,
} from "../../services/settings.service";

function buildAbsoluteUploadUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  const base = (api.defaults.baseURL as string | undefined) ?? "";
  if (!base) return url;
  const origin = base.replace(/\/api\/?$/, "").replace(/\/$/, "");
  return `${origin}${url}`;
}

export default function PrivacyPolicyPdfPage() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const url = await getDefaultPrivacyPolicyPdf();
        if (cancelled) return;
        setCurrentUrl(url);
      } catch (err) {
        console.error("Failed to fetch privacy policy PDF:", err);
        if (!cancelled) setError("Failed to load default privacy policy PDF.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setPendingFile(null);
      setPendingUrl("");
      return;
    }
    if (
      f.type !== "application/pdf" &&
      !f.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("File must be a PDF.");
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadPrivacyPolicyPdf(f);
      setPendingFile(f);
      setPendingUrl(url);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      const msg = ax?.response?.data?.error;
      setError(typeof msg === "string" && msg ? msg : "Failed to upload PDF.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!pendingUrl) return;
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const saved = await updateDefaultPrivacyPolicyPdf(pendingUrl);
      setCurrentUrl(saved);
      setPendingFile(null);
      setPendingUrl("");
      setSuccess("Default privacy policy PDF updated.");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      const msg = ax?.response?.data?.error;
      setError(
        typeof msg === "string" && msg ? msg : "Failed to update default PDF."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const saved = await updateDefaultPrivacyPolicyPdf(null);
      setCurrentUrl(saved);
      setSuccess("Default privacy policy PDF cleared.");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      const msg = ax?.response?.data?.error;
      setError(
        typeof msg === "string" && msg ? msg : "Failed to clear default PDF."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Privacy Policy PDF | Snack Admin"
        description="Manage the default privacy policy PDF for the snack app."
      />
      <PageBreadcrumb pageTitle="Privacy Policy PDF" />
      <div className="space-y-6">
        <ComponentCard title="Default privacy policy PDF">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              )}

              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Current default PDF
                </p>
                {currentUrl ? (
                  <a
                    className="text-sm underline text-brand-500"
                    href={buildAbsoluteUploadUrl(currentUrl)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {currentUrl}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No default PDF set.
                  </p>
                )}
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                  Upload a new PDF
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={uploading || submitting}
                  className="block w-full text-sm"
                />
                {uploading && (
                  <p className="mt-1 text-sm text-gray-500">Uploading...</p>
                )}
                {pendingFile && pendingUrl && !uploading && (
                  <div className="mt-1 flex items-center gap-3 text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {pendingFile.name}
                    </span>
                    <a
                      className="underline text-brand-500"
                      href={buildAbsoluteUploadUrl(pendingUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Preview
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!pendingUrl || uploading || submitting}
                >
                  {submitting ? "Saving..." : "Save as default"}
                </Button>
                {currentUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    disabled={uploading || submitting}
                  >
                    Clear default
                  </Button>
                )}
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
