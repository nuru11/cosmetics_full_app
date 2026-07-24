import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CategoryNavBar, CategorySectionHeader } from "@/components/products/CategoryNavBar";
import { HomeHeader, AskProductCta } from "@/components/products/HomeHeader";
import { ProductGridCard } from "@/components/products/ProductGridCard";
import { ErrorState, PageLoader } from "@/components/shared/LoadingState";
import { buildCategorySections } from "@/lib/productListing";
import { useGridColumns, useIsDesktop } from "@/hooks/useMediaQuery";
import { useCatalogStore } from "@/stores/catalogStore";

export default function HomePage() {
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();
  const columns = useGridColumns();
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const isLoading = useCatalogStore((s) => s.isLoading);
  const error = useCatalogStore((s) => s.error);
  const selectedCategoryId = useCatalogStore((s) => s.selectedCategoryId);
  const loadAll = useCatalogStore((s) => s.loadAll);
  const setSelectedCategoryId = useCatalogStore((s) => s.setSelectedCategoryId);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return products;
    return products.filter((p) => p.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

  const sections = useMemo(
    () => buildCategorySections(filteredProducts, columns),
    [filteredProducts, columns],
  );

  return (
    <div>
      {!isDesktop ? (
        <HomeHeader />
      ) : (
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <div className="rounded-2xl bg-gradient-to-br from-brand-blue to-[#4A7FE8] p-4">
            <AskProductCta />
          </div>
        </div>
      )}
      <CategoryNavBar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      {isLoading && products.length === 0 ? <PageLoader /> : null}
      {error && products.length === 0 ? (
        <ErrorState message={t(error)} onRetry={() => void loadAll()} retryLabel={t("common.retry")} />
      ) : null}

      {!isLoading || products.length > 0 ? (
        <div className="pb-6">
          {sections.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-text-muted">
              {t("products.no_products")}
            </p>
          ) : (
            sections.map((section) => (
              <section key={section.categoryId}>
                <CategorySectionHeader title={section.categoryName} />
                <div className="space-y-4 px-4">
                  {section.listingRows.map((row, rowIndex) => (
                    <div
                      key={`${section.categoryId}-${rowIndex}`}
                      className="grid gap-4"
                      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                    >
                      {row.map(({ product, variant }) => (
                        <ProductGridCard key={variant.id} product={product} variant={variant} />
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
