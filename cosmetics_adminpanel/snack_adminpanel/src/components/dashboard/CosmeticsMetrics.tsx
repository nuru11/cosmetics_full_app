import { useEffect, useState } from "react";
import { fetchAdminProducts } from "../../services/product.service";
import { fetchCategories } from "../../services/category.service";

export default function CosmeticsMetrics() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [products, categories] = await Promise.all([
          fetchAdminProducts(),
          fetchCategories(false),
        ]);
        if (cancelled) return;
        setProductCount(products.length);
        setCategoryCount(categories.length);
      } catch {
        if (!cancelled) setError("Could not load catalog stats.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <MetricCard label="Products" value={productCount} error={error} />
      <MetricCard label="Categories" value={categoryCount} error={error} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  error,
}: {
  label: string;
  value: number | null;
  error: string | null;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
        {error ? "—" : value === null ? "…" : value}
      </h4>
    </div>
  );
}
