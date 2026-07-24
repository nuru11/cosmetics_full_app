import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductGridCard } from "@/components/products/ProductGridCard";
import { EmptyState, PageLoader } from "@/components/shared/LoadingState";
import { useGridColumns } from "@/hooks/useMediaQuery";
import { chunkListingEntriesIntoRows, expandProductsToListingEntries } from "@/lib/productListing";
import { fetchProducts } from "@/services/catalogService";
import { useWishlistStore } from "@/stores/wishlistStore";
import type { Product } from "@/types";

export default function SavedPage() {
  const { t } = useTranslation();
  const columns = useGridColumns();
  const variantIds = useWishlistStore((s) => s.variantIds);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        setProducts(await fetchProducts());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const entries = useMemo(() => {
    const all = expandProductsToListingEntries(products);
    return all.filter((entry) => variantIds.includes(entry.variant.id));
  }, [products, variantIds]);

  const rows = useMemo(
    () => chunkListingEntriesIntoRows(entries, columns),
    [entries, columns],
  );

  if (loading) return <PageLoader />;

  return (
    <div className="pb-8">
      <div className="border-b border-divider-grey/50 bg-white px-4 py-4 lg:rounded-none">
        <h1 className="text-lg font-semibold">{t("saved.title")}</h1>
      </div>

      {entries.length === 0 ? (
        <EmptyState title={t("saved.empty_title")} message={t("saved.empty_message")} />
      ) : (
        <div className="space-y-4 px-4 py-4">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {row.map(({ product, variant }) => (
                <ProductGridCard key={variant.id} product={product} variant={variant} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
