import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import InputField from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { getContactUs, updateContactUs } from "../../services/settings.service";

const CONTACT_FIELD_MAX_LENGTH = 255;
const CONTACT_ADDRESS_MAX_LENGTH = 1000;

export default function ContactUsPage() {
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [telegram, setTelegram] = useState("");
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
        const value = await getContactUs();
        if (cancelled) return;
        setPhone1(value.phone1 ?? "");
        setPhone2(value.phone2 ?? "");
        setEmail(value.email ?? "");
        setAddress(value.address ?? "");
        setTelegram(value.telegram ?? "");
      } catch (err) {
        console.error("Failed to fetch contact us:", err);
        if (!cancelled) setError("Failed to load Contact Us content.");
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
    if (
      phone1.length > CONTACT_FIELD_MAX_LENGTH ||
      phone2.length > CONTACT_FIELD_MAX_LENGTH ||
      email.length > CONTACT_FIELD_MAX_LENGTH ||
      telegram.length > CONTACT_FIELD_MAX_LENGTH
    ) {
      setError(`Phone, email, and telegram max length is ${CONTACT_FIELD_MAX_LENGTH} characters.`);
      return;
    }
    if (address.length > CONTACT_ADDRESS_MAX_LENGTH) {
      setError(`Address max length is ${CONTACT_ADDRESS_MAX_LENGTH} characters.`);
      return;
    }
    setSubmitting(true);
    try {
      const saved = await updateContactUs({
        phone1: phone1.trim() || null,
        phone2: phone2.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
        telegram: telegram.trim() || null,
      });
      setPhone1(saved.phone1 ?? "");
      setPhone2(saved.phone2 ?? "");
      setEmail(saved.email ?? "");
      setAddress(saved.address ?? "");
      setTelegram(saved.telegram ?? "");
      setSuccess("Contact Us content updated successfully.");
    } catch (err) {
      console.error("Failed to update contact us:", err);
      setError("Failed to update Contact Us content.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Contact Us | Snack Admin"
        description="Manage Contact Us content shown in mobile app profile."
      />
      <PageBreadcrumb pageTitle="Contact Us" />
      <div className="space-y-6">
        <ComponentCard title="Contact Us content">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  type="tel"
                  placeholder="Phone 1"
                  value={phone1}
                  maxLength={CONTACT_FIELD_MAX_LENGTH}
                  onChange={(e) => setPhone1(e.target.value)}
                  disabled={submitting}
                />
                <InputField
                  type="tel"
                  placeholder="Phone 2"
                  value={phone2}
                  maxLength={CONTACT_FIELD_MAX_LENGTH}
                  onChange={(e) => setPhone2(e.target.value)}
                  disabled={submitting}
                />
                <InputField
                  type="email"
                  placeholder="Email"
                  value={email}
                  maxLength={CONTACT_FIELD_MAX_LENGTH}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
                <InputField
                  type="text"
                  placeholder="Telegram username or link"
                  value={telegram}
                  maxLength={CONTACT_FIELD_MAX_LENGTH}
                  onChange={(e) => setTelegram(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <TextArea
                rows={4}
                placeholder="Address"
                value={address}
                onChange={setAddress}
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Address {address.length}/{CONTACT_ADDRESS_MAX_LENGTH}
              </p>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Contact Us"}
              </Button>
            </form>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
