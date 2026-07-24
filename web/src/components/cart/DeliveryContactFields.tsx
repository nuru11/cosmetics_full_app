import { useTranslation } from "react-i18next";
import type { CheckoutContact } from "@/types";
import { cn } from "@/lib/utils";

export function DeliveryContactFields({
  contact,
  onChange,
  errors,
  includeCity = true,
}: {
  contact: CheckoutContact;
  onChange: (contact: CheckoutContact) => void;
  errors?: Partial<Record<keyof CheckoutContact, string>>;
  includeCity?: boolean;
}) {
  const { t } = useTranslation();

  const fields: Array<{ key: keyof CheckoutContact; label: string }> = [
    { key: "name", label: t("form.full_name") },
    { key: "phone", label: t("form.phone") },
  ];
  if (includeCity) {
    fields.push({ key: "city", label: t("form.city") });
  }

  return (
    <div className="space-y-4">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <label className="mb-1 block text-sm font-medium text-text-dark">{label}</label>
          <input
            type="text"
            value={contact[key]}
            onChange={(e) => onChange({ ...contact, [key]: e.target.value })}
            className={cn(
              "w-full rounded-xl border border-divider-grey bg-white px-4 py-3 text-sm outline-none focus:border-brand-blue",
              errors?.[key] && "border-accent-red",
            )}
          />
          {errors?.[key] ? (
            <p className="mt-1 text-xs text-accent-red">{errors[key]}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function validateContact(
  contact: CheckoutContact,
  t: (key: string) => string,
  options?: { includeCity?: boolean },
): Partial<Record<keyof CheckoutContact, string>> {
  const errors: Partial<Record<keyof CheckoutContact, string>> = {};
  if (!contact.name.trim()) errors.name = t("validation.name_required");
  if (!contact.phone.trim()) errors.phone = t("validation.phone_required");
  if (options?.includeCity !== false && !contact.city.trim()) {
    errors.city = t("validation.city_required");
  }
  return errors;
}
