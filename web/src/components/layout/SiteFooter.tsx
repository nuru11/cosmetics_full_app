import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AskProductFooterButton } from "@/components/products/HomeHeader";
import { helpFooterLinks, mobileFooterLinks, shopFooterLinks } from "@/lib/siteNav";
import { cn } from "@/lib/utils";

function FooterLink({ to, labelKey }: { to: string; labelKey: string }) {
  const { t } = useTranslation();

  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        cn(
          "text-sm transition hover:text-brand-blue",
          isActive ? "font-semibold text-brand-blue" : "text-text-muted",
        )
      }
    >
      {t(labelKey)}
    </NavLink>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-divider-grey/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-10 w-10 rounded-lg object-cover" />
              <span className="font-display text-xl font-semibold text-text-dark">
                {t("app.title")}
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-text-muted">{t("footer.tagline")}</p>
            <AskProductFooterButton className="mt-5 max-w-sm" />
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-wide text-text-dark">{t("footer.shop")}</h2>
            <nav className="mt-4 flex flex-col gap-2">
              {shopFooterLinks.map((item) => (
                <FooterLink key={item.to} to={item.to} labelKey={item.labelKey} />
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-wide text-text-dark">{t("footer.help")}</h2>
            <nav className="mt-4 flex flex-col gap-2">
              {helpFooterLinks.map((item) => (
                <FooterLink key={item.to} to={item.to} labelKey={item.labelKey} />
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-9 w-9 rounded-lg object-cover" />
            <span className="text-lg font-bold text-text-dark">{t("app.title")}</span>
          </div>
          <AskProductFooterButton className="mt-4" />
          <nav className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {mobileFooterLinks.map((item) => (
              <FooterLink key={item.to} to={item.to} labelKey={item.labelKey} />
            ))}
          </nav>
        </div>

        <p className="mt-8 border-t border-divider-grey/40 pt-6 text-center text-xs text-text-muted lg:text-left">
          © {year} {t("app.title")}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
