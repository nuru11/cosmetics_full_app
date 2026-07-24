import { useTranslation } from "react-i18next";
import { versionLabelKey } from "@/i18n";
import { cn } from "@/lib/utils";

export function ProductVersionBadge({
  versionKey,
  className,
}: {
  versionKey: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const key = versionKey.toUpperCase();
  const isOriginal = key === "ORIGINAL";
  const isPremium = key === "PREMIUM";

  return (
    <div
      className={cn(
        "px-2 py-1 text-[10px] font-bold tracking-wide text-white",
        isOriginal && "bg-brand-blue",
        key === "TWO_LEVEL" && "bg-second-purple-dark",
        isPremium && "bg-second-purple",
        !isOriginal && key !== "TWO_LEVEL" && !isPremium && "bg-brand-blue",
        className,
      )}
    >
      {t(versionLabelKey(key))}
    </div>
  );
}

export function ProductVersionCardHeader({ versionKey }: { versionKey: string }) {
  return <ProductVersionBadge versionKey={versionKey} className="w-full text-center" />;
}
