import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/layout/AppShell";
import { ProductGridCard } from "@/components/products/ProductGridCard";
import { useGridColumns } from "@/hooks/useMediaQuery";
import { useCatalogStore } from "@/stores/catalogStore";
import { expandProductsToListingEntries, chunkListingEntriesIntoRows } from "@/lib/productListing";

export default function SearchPage() {
  const { t } = useTranslation();
  const columns = useGridColumns();
  const products = useCatalogStore((s) => s.products);
  const loadAll = useCatalogStore((s) => s.loadAll);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (products.length === 0) void loadAll();
  }, [products.length, loadAll]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((product) => {
      const name = product.productName.toLowerCase();
      const brand = (product.brand ?? "").toLowerCase();
      return name.includes(q) || brand.includes(q);
    });
  }, [products, query]);

  const rows = useMemo(
    () => chunkListingEntriesIntoRows(expandProductsToListingEntries(filtered), columns),
    [filtered, columns],
  );

  return (
    <div>
      <PageHeader title={t("common.search")} backTo="/" />
      <div className="px-4 py-4">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("products.search_hint")}
          className="w-full rounded-xl border border-divider-grey bg-white px-4 py-3 text-sm outline-none focus:border-brand-blue"
        />
      </div>
      {query.trim() === "" ? (
        <p className="px-4 text-sm text-text-muted">{t("products.search_hint")}</p>
      ) : rows.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-text-muted">
          {t("products.no_search_results")}
        </p>
      ) : (
        <div className="space-y-4 px-4 pb-8">
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
      <div className="px-4 pb-8">
        <Link to="/" className="text-sm font-semibold text-brand-blue">
          {t("cart.continue_shopping")}
        </Link>
      </div>
    </div>
  );
}
