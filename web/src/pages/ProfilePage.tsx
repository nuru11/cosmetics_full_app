import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDisplayName, useContactStore } from "@/stores/contactStore";
import { useLocaleStore, type AppLocale } from "@/stores/localeStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { fetchOrders } from "@/services/orderService";
import { cn } from "@/lib/utils";

function ProfileRow({
  title,
  detail,
  onClick,
  to,
}: {
  title: string;
  detail: string;
  onClick?: () => void;
  to?: string;
}) {
  const content = (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-text-muted">{detail}</p>
      </div>
      <span className="text-text-muted">→</span>
    </div>
  );

  if (to) return <Link to={to}>{content}</Link>;
  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const contact = useContactStore((s) => s.contact);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const savedCount = useWishlistStore((s) => s.count());
  const [orderCount, setOrderCount] = useState(0);
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const orders = await fetchOrders();
        setOrderCount(orders.length);
      } catch {
        setOrderCount(0);
      }
    })();
  }, []);

  const displayName = getDisplayName(contact) ?? t("profile.guest");

  return (
    <div className="pb-8">
      <div className="bg-gradient-to-br from-brand-blue to-[#4A7FE8] px-4 py-8 text-white">
        <p className="text-sm text-white/85">{t("profile.welcome_back")}</p>
        <h1 className="mt-1 text-2xl font-bold">{displayName}</h1>
        {!getDisplayName(contact) ? (
          <p className="mt-1 text-sm text-white/85">{t("profile.guest_hint")}</p>
        ) : null}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
            <p className="text-2xl font-bold">{orderCount}</p>
            <p className="text-xs text-white/85">{t("profile.orders_stat")}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
            <p className="text-2xl font-bold">{savedCount}</p>
            <p className="text-xs text-white/85">{t("profile.saved_stat")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-4 py-6">
        <div>
          <p className="mb-3 text-xs font-bold tracking-wide text-text-muted">
            {t("profile.section_account")}
          </p>
          <div className="space-y-3">
            <ProfileRow
              title={t("profile.orders")}
              detail={t("profile.orders_detail")}
              onClick={() => navigate("/orders")}
            />
            <ProfileRow
              title={t("profile.my_address")}
              detail={t("profile.my_address_detail")}
              to="/profile/address"
            />
            <ProfileRow
              title={t("contact.title")}
              detail={t("contact.subtitle")}
              to="/contact"
            />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold tracking-wide text-text-muted">
            {t("profile.section_preferences")}
          </p>
          <ProfileRow
            title={t("profile.language")}
            detail={t("profile.language_detail")}
            onClick={() => setLanguageOpen((v) => !v)}
          />
          {languageOpen ? (
            <div className="mt-3 space-y-2 rounded-2xl bg-white p-3 shadow-sm">
              {(["en", "am"] as AppLocale[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLocale(value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold",
                    locale === value ? "bg-brand-blue text-white" : "bg-cream text-text-dark",
                  )}
                >
                  <span>
                    {value === "en"
                      ? t("profile.language_english")
                      : t("profile.language_amharic")}
                  </span>
                  {locale === value ? "✓" : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
