import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DeliveryContactFields,
  validateContact,
} from "@/components/cart/DeliveryContactFields";
import { PageHeader } from "@/components/layout/AppShell";
import { Toast } from "@/components/cart/CheckoutModal";
import { useContactStore } from "@/stores/contactStore";

export default function AddressPage() {
  const { t } = useTranslation();
  const contact = useContactStore((s) => s.contact);
  const setContact = useContactStore((s) => s.setContact);
  const [draft, setDraft] = useState(contact);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof contact, string>>>({});
  const [toast, setToast] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateContact(draft, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setContact({
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      city: draft.city.trim(),
    });
    setToast(t("address.saved_message"));
  };

  return (
    <div>
      <PageHeader title={t("address.title")} backTo="/profile" />
      <form onSubmit={handleSave} className="mx-auto max-w-xl px-4 py-6">
        <h2 className="text-base font-semibold">{t("address.delivery_address")}</h2>
        <p className="mt-2 text-sm text-text-muted">{t("address.description")}</p>
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
          <DeliveryContactFields contact={draft} onChange={setDraft} errors={errors} />
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-brand-blue py-3 text-sm font-semibold text-white"
        >
          {t("address.save_address")}
        </button>
      </form>
      <Toast message={toast} visible={Boolean(toast)} onClose={() => setToast("")} />
    </div>
  );
}
