import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AskProductFooterButton } from "@/components/products/HomeHeader";
import { PageHeader } from "@/components/layout/AppShell";
import { ErrorState, PageLoader } from "@/components/shared/LoadingState";
import { emailHref, normalizeTelegramUrl, phoneHref } from "@/lib/contactLinks";
import { fetchContactUs, hasContactDetails, type ContactUs } from "@/services/contactService";

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
      <p className="text-xs font-bold tracking-wide text-text-muted">{label}</p>
      {href ? (
        <a href={href} className="mt-2 block text-sm font-semibold text-brand-blue hover:underline">
          {value}
        </a>
      ) : (
        <p className="mt-2 whitespace-pre-line text-sm font-semibold text-text-dark">{value}</p>
      )}
    </div>
  );
}

export default function ContactUsPage() {
  const { t } = useTranslation();
  const [contact, setContact] = useState<ContactUs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loaded = await fetchContactUs();
        setContact(loaded);
      } catch {
        setError("contact.load_error");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <PageLoader />;
  if (error) {
    return (
      <ErrorState
        message={t(error)}
        onRetry={() => window.location.reload()}
        retryLabel={t("common.retry")}
      />
    );
  }

  const details = contact ?? {};
  const hasDetails = hasContactDetails(details);

  return (
    <div className="pb-8">
      <PageHeader title={t("contact.title")} backTo="/profile" />

      <div className="mx-auto max-w-xl px-4 py-6">
        <h2 className="text-base font-semibold">{t("contact.title")}</h2>
        <p className="mt-2 text-sm text-text-muted">{t("contact.subtitle")}</p>

        {hasDetails ? (
          <div className="mt-6 space-y-3">
            {details.phone1?.trim() ? (
              <ContactRow
                label={t("contact.phone1")}
                value={details.phone1.trim()}
                href={phoneHref(details.phone1)}
              />
            ) : null}
            {details.phone2?.trim() ? (
              <ContactRow
                label={t("contact.phone2")}
                value={details.phone2.trim()}
                href={phoneHref(details.phone2)}
              />
            ) : null}
            {details.email?.trim() ? (
              <ContactRow
                label={t("contact.email")}
                value={details.email.trim()}
                href={emailHref(details.email)}
              />
            ) : null}
            {details.telegram?.trim() ? (
              <ContactRow
                label={t("contact.telegram")}
                value={details.telegram.trim()}
                href={normalizeTelegramUrl(details.telegram)}
              />
            ) : null}
            {details.address?.trim() ? (
              <ContactRow label={t("contact.address")} value={details.address.trim()} />
            ) : null}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-white px-4 py-6 text-center shadow-sm">
            <h3 className="text-base font-semibold">{t("contact.empty_title")}</h3>
            <p className="mt-2 text-sm text-text-muted">{t("contact.empty_message")}</p>
            <Link
              to="/product-request"
              className="mt-4 inline-block text-sm font-semibold text-brand-blue"
            >
              {t("products.ask_for_product")} →
            </Link>
          </div>
        )}

        <AskProductFooterButton className="mt-6" />
      </div>
    </div>
  );
}
