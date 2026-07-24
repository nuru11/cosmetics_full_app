import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DeliveryContactFields,
  validateContact,
} from "@/components/cart/DeliveryContactFields";
import { PageHeader } from "@/components/layout/AppShell";
import { Toast } from "@/components/cart/CheckoutModal";
import { submitProductRequest } from "@/services/productRequestService";
import { useContactStore } from "@/stores/contactStore";

export default function AskProductPage() {
  const { t } = useTranslation();
  const savedContact = useContactStore((s) => s.contact);
  const setContact = useContactStore((s) => s.setContact);

  const [description, setDescription] = useState("");
  const [contact, setContactDraft] = useState(savedContact);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    description?: string;
    contact?: Partial<Record<keyof typeof contact, string>>;
  }>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    setContactDraft(savedContact);
  }, [savedContact]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImagePreview(result);
        const base64 = result.includes(",") ? result.split(",")[1] : result;
        setImageBase64(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const contactErrors = validateContact(contact, t, { includeCity: false });
    const nextErrors: typeof errors = { contact: contactErrors };

    if (!description.trim() && !imageBase64) {
      nextErrors.description = t("validation.description_or_photo");
    }
    if (description.trim().length > 2000) {
      nextErrors.description = t("validation.description_too_long");
    }

    setErrors(nextErrors);
    if (
      nextErrors.description ||
      Object.keys(contactErrors).length > 0
    ) {
      return;
    }

    setSubmitting(true);
    try {
      await submitProductRequest({
        description: description.trim() || undefined,
        imageBase64,
        customerName: contact.name.trim(),
        phone: contact.phone.trim(),
      });
      setContact({
        name: contact.name.trim(),
        phone: contact.phone.trim(),
        city: savedContact.city,
      });
      setDescription("");
      setImageBase64(undefined);
      setImagePreview(undefined);
      setToast(t("request.sent_message"));
    } catch {
      setToast(t("request.failed_message"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-8">
      <PageHeader title={t("request.title")} backTo="/" />
      <form onSubmit={(e) => void handleSubmit(e)} className="mx-auto max-w-xl px-4 py-6">
        <h2 className="text-lg font-semibold">{t("request.heading")}</h2>
        <p className="mt-2 text-sm text-text-muted">{t("request.description")}</p>

        <div className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              {t("request.product_description_optional")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("request.hint")}
              rows={5}
              className="w-full rounded-xl border border-divider-grey bg-white px-4 py-3 text-sm outline-none focus:border-brand-blue"
            />
            {errors.description ? (
              <p className="mt-1 text-xs text-accent-red">{errors.description}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              {t("request.reference_photo")}
            </label>
            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt=""
                  className="max-h-56 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(undefined);
                    setImageBase64(undefined);
                  }}
                  className="text-sm font-semibold text-accent-red"
                >
                  {t("request.remove_photo")}
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-divider-grey bg-white px-4 py-8 text-sm font-semibold text-brand-blue">
                {t("request.add_photo")}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("request.contact_details")}</h3>
            <DeliveryContactFields
              contact={contact}
              onChange={setContactDraft}
              errors={errors.contact}
              includeCity={false}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-brand-blue py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? t("common.loading") : t("request.send")}
        </button>
      </form>
      <Toast message={toast} visible={Boolean(toast)} onClose={() => setToast("")} />
    </div>
  );
}
