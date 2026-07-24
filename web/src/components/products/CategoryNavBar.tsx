import { useTranslation } from "react-i18next";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

export function CategoryNavBar({
  categories,
  selectedCategoryId,
  onSelect,
}: {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-20 border-b border-divider-grey/60 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs font-semibold",
            selectedCategoryId == null
              ? "bg-brand-blue text-white"
              : "bg-white text-text-muted",
          )}
        >
          {t("common.all")}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold",
              selectedCategoryId === category.id
                ? "bg-brand-blue text-white"
                : "bg-white text-text-muted",
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CategorySectionHeader({ title }: { title: string }) {
  return (
    <div className="px-4 py-4">
      <h2 className="font-display text-xl font-semibold text-text-dark">{title}</h2>
    </div>
  );
}
