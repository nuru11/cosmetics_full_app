import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartHeaderButton } from "@/components/products/HomeHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { tabRoutes } from "@/lib/siteNav";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/useMediaQuery";

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "#034BDE" : "#6B6B6B";
  switch (name) {
    case "home":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "saved":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "orders":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
  }
}

function DesktopHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-divider-grey/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
        <button type="button" onClick={() => navigate("/")} className="flex items-center gap-3">
          <img src="/logo.jpg" alt="" className="h-10 w-10 rounded-lg object-cover" />
          <span className="text-lg font-bold text-text-dark">{t("app.title")}</span>
        </button>
        <nav className="flex flex-1 items-center gap-1">
          {tabRoutes.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive ? "bg-brand-blue text-white" : "text-text-muted hover:text-brand-blue",
                )
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="rounded-full border border-divider-grey px-4 py-2 text-sm text-text-muted"
        >
          {t("common.search")}
        </button>
        <CartHeaderButton />
      </div>
    </header>
  );
}

function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-divider-grey/40 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-lg">
        {tabRoutes.map((item) => {
          const active =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="flex flex-1 flex-col items-center py-2 text-[9px] font-semibold tracking-wide"
            >
              <span
                className={cn(
                  "mb-1 h-0.5 w-5 rounded-full",
                  active && item.name === "orders" ? "bg-brand-blue" : "bg-transparent",
                )}
              />
              <NavIcon name={item.name} active={active} />
              <span className={cn("mt-1", active ? "text-brand-blue" : "text-text-muted")}>
                {t(item.labelKey)}
              </span>
              <span
                className={cn(
                  "mt-1 h-1 w-1 rounded-full",
                  active && item.name === "home" ? "bg-brand-blue" : "bg-transparent",
                )}
              />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell() {
  const isDesktop = useIsDesktop();
  const location = useLocation();
  const isStandalone =
    location.pathname.startsWith("/product/") ||
    location.pathname === "/cart" ||
    location.pathname === "/search" ||
    location.pathname === "/product-request" ||
    location.pathname === "/contact" ||
    location.pathname.startsWith("/profile/address");

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-cream pb-24 lg:pb-0">
        {isDesktop ? <DesktopHeader /> : null}
        <Outlet />
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-20 lg:pb-0">
      {isDesktop ? <DesktopHeader /> : null}
      <main className="mx-auto max-w-7xl">
        <Outlet />
      </main>
      <SiteFooter />
      {!isDesktop ? <BottomNav /> : null}
    </div>
  );
}

export function PageHeader({
  title,
  backTo,
  action,
}: {
  title: string;
  backTo?: string;
  action?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-divider-grey/50 bg-cream/95 px-4 py-3 backdrop-blur">
      <button
        type="button"
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white"
        aria-label="Back"
      >
        ←
      </button>
      <h1 className="flex-1 truncate text-base font-semibold">{title}</h1>
      {action}
    </div>
  );
}
