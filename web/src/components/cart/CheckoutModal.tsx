import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DeliveryContactFields,
  validateContact,
} from "@/components/cart/DeliveryContactFields";
import type { CheckoutContact } from "@/types";
import { cn } from "@/lib/utils";

export function CheckoutModal({
  open,
  initialContact,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initialContact: CheckoutContact;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (contact: CheckoutContact) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [contact, setContact] = useState(initialContact);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutContact, string>>>({});

  useEffect(() => {
    if (open) {
      setContact(initialContact);
      setErrors({});
    }
  }, [open, initialContact]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateContact(contact, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    await onSubmit(contact);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label={t("common.cancel")}
        onClick={onClose}
      />
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
      >
        <h2 className="text-lg font-semibold">{t("checkout.delivery_details")}</h2>
        <div className="mt-4">
          <DeliveryContactFields contact={contact} onChange={setContact} errors={errors} />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-divider-grey py-3 text-sm font-semibold"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "flex-1 rounded-full bg-brand-blue py-3 text-sm font-semibold text-white",
              isSubmitting && "opacity-60",
            )}
          >
            {isSubmitting ? t("common.loading") : t("checkout.place_order")}
          </button>
        </div>
      </form>
    </div>
  );
}

export function Toast({
  message,
  visible,
  onClose,
}: {
  message: string;
  visible: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-full bg-text-dark px-5 py-3 text-sm text-white shadow-lg lg:bottom-8">
      {message}
    </div>
  );
}
