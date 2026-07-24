import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export function CartHeaderButton({ className }: { className?: string }) {
  const navigate = useNavigate();
  const lineCount = useCartStore((s) => s.lines.length);

  return (
    <button
      type="button"
      onClick={() => navigate("/cart")}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-blue shadow-md",
        className,
      )}
      aria-label="Cart"
    >
      <BagIcon />
      {lineCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border border-white bg-accent-red px-1 text-[9px] font-bold text-white">
          {lineCount > 99 ? "99+" : lineCount}
        </span>
      ) : null}
    </button>
  );
}

export function AskProductCta() {
  const { t } = useTranslation();

  return (
    <Link
      to="/product-request"
      className="flex w-full items-center justify-between rounded-xl bg-white/15 px-4 py-3 text-white backdrop-blur-sm transition hover:bg-white/20"
    >
      <div>
        <p className="text-sm font-semibold">{t("products.ask_for_product")}</p>
        <p className="text-xs text-white/85">{t("products.ask_subtitle")}</p>
      </div>
      <span className="text-xl">→</span>
    </Link>
  );
}

export function AskProductFooterButton({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <Link
      to="/product-request"
      className={cn(
        "flex w-full items-center justify-between rounded-xl bg-brand-blue px-4 py-3 text-white shadow-sm transition hover:bg-brand-blue/90",
        className,
      )}
    >
      <div>
        <p className="text-sm font-semibold">{t("products.ask_for_product")}</p>
        <p className="text-xs text-white/85">{t("products.ask_subtitle")}</p>
      </div>
      <span className="text-xl">→</span>
    </Link>
  );
}

export function HomeHeader({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-brand-blue to-[#4A7FE8] px-4 pb-4 pt-3 text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <img src="/logo.jpg" alt="" className="h-9 w-9 rounded-lg object-cover" />
        <h1 className="flex-1 text-center text-lg font-bold">{t("app.title")}</h1>
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="flex h-9 w-9 items-center justify-center"
          aria-label={t("common.search")}
        >
          <SearchIcon />
        </button>
        <CartHeaderButton />
      </div>
      {!compact ? (
        <div className="mx-auto mt-3 max-w-7xl">
          <AskProductCta />
        </div>
      ) : null}
    </div>
  );
}
