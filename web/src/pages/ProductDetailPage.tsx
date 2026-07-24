import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProductAddButton } from "@/components/products/ProductGridCard";
import { ProductDetailHero } from "@/components/products/ProductDetailHero";
import { ProductVersionBadge } from "@/components/products/ProductVersionBadge";
import { PageHeader } from "@/components/layout/AppShell";
import { SaveProductButton } from "@/components/shared/SaveProductButton";
import { ErrorState, PageLoader } from "@/components/shared/LoadingState";
import { versionLabelKey, versionSubtitleKey } from "@/i18n";
import { formatPrice } from "@/lib/formatPrice";
import { savingsPercentVersusOriginal, sortedVariantsForListing } from "@/lib/productListing";
import { fetchProduct } from "@/services/catalogService";
import type { Product, ProductVariant } from "@/types";
import { cn } from "@/lib/utils";

function ProductDetailInfo({
  product,
  selectedVariant,
  savings,
  description,
  expanded,
  onToggleExpanded,
  onSelectVariant,
}: {
  product: Product;
  selectedVariant: ProductVariant;
  savings: number | null;
  description: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onSelectVariant: (variant: ProductVariant) => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          {product.brand ? (
            <p className="text-xs font-semibold tracking-wide text-text-muted">
              {product.brand.toUpperCase()}
            </p>
          ) : null}
          <h2 className="mt-1 font-display text-2xl font-semibold lg:text-3xl">
            {product.productName}
          </h2>
          <p className="mt-2 text-xl font-bold text-brand-blue lg:text-2xl">
            {formatPrice(selectedVariant.price)}
          </p>
          {savings ? (
            <p className="mt-1 text-sm font-semibold text-accent-green">
              {t("product.save_percent", { percent: savings })}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
            selectedVariant.inStock
              ? "bg-status-delivered-bg text-status-delivered-text"
              : "bg-status-pending-bg text-accent-red",
          )}
        >
          {selectedVariant.inStock
            ? t("product.in_stock_title")
            : t("product.out_of_stock_title")}
        </span>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold">{t("product.choose_version")}</h3>
        <p className="mt-1 text-xs text-text-muted">
          {t("product.options_available", { count: product.variants.length })}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {sortedVariantsForListing(product).map((variant) => {
            const selected = variant.id === selectedVariant.id;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onSelectVariant(variant)}
                className={cn(
                  "rounded-xl border p-3 text-left transition",
                  selected
                    ? "border-brand-blue bg-brand-blue/5"
                    : "border-divider-grey bg-white",
                )}
              >
                <ProductVersionBadge versionKey={variant.productVersion} className="inline-block rounded" />
                <p className="mt-2 text-xs font-semibold">
                  {t(versionLabelKey(variant.productVersion))}
                </p>
                <p className="mt-1 text-[11px] text-text-muted">
                  {variant.variantDescription?.trim() ||
                    t(versionSubtitleKey(variant.productVersion))}
                </p>
                <p className="mt-2 text-sm font-bold">{formatPrice(variant.price)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {description ? (
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm lg:shadow-none lg:ring-1 lg:ring-divider-grey/60">
          <h3 className="text-sm font-semibold">{t("product.about")}</h3>
          <p className={cn("mt-2 text-sm text-text-muted", !expanded && "line-clamp-4")}>
            {description}
          </p>
          {description.length > 180 ? (
            <button
              type="button"
              onClick={onToggleExpanded}
              className="mt-2 text-sm font-semibold text-brand-blue"
            >
              {expanded ? t("product.read_less") : t("product.read_more")}
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default function ProductDetailPage() {
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("error.invalid_product");
      setIsLoading(false);
      return;
    }

    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loaded = await fetchProduct(id);
        setProduct(loaded);
        const preferredId = searchParams.get("variantId");
        const variants = sortedVariantsForListing(loaded);
        const preferred = variants.find((v) => v.id === preferredId);
        setSelectedVariant(preferred ?? variants.find((v) => v.inStock) ?? variants[0] ?? null);
      } catch {
        setError("error.load_product");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, searchParams]);

  const savings = useMemo(() => {
    if (!product || !selectedVariant) return null;
    return savingsPercentVersusOriginal(product, selectedVariant);
  }, [product, selectedVariant]);

  if (isLoading) return <PageLoader />;
  if (error) {
    return (
      <ErrorState
        message={t(error)}
        onRetry={() => window.location.reload()}
        retryLabel={t("common.retry")}
      />
    );
  }
  if (!product || !selectedVariant) {
    return <ErrorState message={t("product.not_found")} />;
  }

  const heroImages =
    selectedVariant.variantImages.length > 0
      ? selectedVariant.variantImages
      : product.displayImage
        ? [product.displayImage]
        : [];
  const description = product.productDescription ?? "";

  return (
    <div className="pb-28 lg:pb-8">
      <div className="lg:hidden">
        <PageHeader
          title={product.productName}
          action={<SaveProductButton variantId={selectedVariant.id} />}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 lg:py-8">
        <div className="mb-4 hidden justify-end lg:flex">
          <SaveProductButton variantId={selectedVariant.id} />
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
          <ProductDetailHero
            key={selectedVariant.id}
            images={heroImages}
            alt={product.productName}
          />

          <div className="px-0 py-5 lg:sticky lg:top-24 lg:py-0">
            <ProductDetailInfo
              product={product}
              selectedVariant={selectedVariant}
              savings={savings}
              description={description}
              expanded={expanded}
              onToggleExpanded={() => setExpanded((v) => !v)}
              onSelectVariant={setSelectedVariant}
            />

            <div className="mt-8 hidden lg:block">
              <ProductAddButton
                product={product}
                variant={selectedVariant}
                className="w-full max-w-md"
                navigateToCartOnSuccess
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-divider-grey bg-white p-4 lg:hidden">
        <div className="mx-auto flex max-w-3xl gap-3">
          <ProductAddButton
            product={product}
            variant={selectedVariant}
            className="flex-1"
            navigateToCartOnSuccess
          />
        </div>
      </div>
    </div>
  );
}
