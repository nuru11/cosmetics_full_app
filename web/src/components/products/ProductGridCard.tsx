import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ProductImage } from "@/components/shared/ProductImage";
import { ProductVersionCardHeader } from "@/components/products/ProductVersionBadge";
import { Toast } from "@/components/cart/CheckoutModal";
import type { Product, ProductVariant } from "@/types";
import { addToCartFailureMessage, addVariantToCart } from "@/lib/cartActions";
import { formatPrice } from "@/lib/formatPrice";
import { variantPrimaryImage } from "@/lib/parsers";
import { cn } from "@/lib/utils";

export function ProductAddButton({
  product,
  variant,
  iconOnly = false,
  className,
  navigateToCartOnSuccess = false,
}: {
  product: Product;
  variant?: ProductVariant | null;
  iconOnly?: boolean;
  className?: string;
  navigateToCartOnSuccess?: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const canAdd =
    product.status.toUpperCase() === "ACTIVE" && Boolean(variant?.inStock);
  const iconDisabled = !variant?.inStock;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!variant) {
      setToast(t("cart_action.no_options_message"));
      return;
    }

    const result = addVariantToCart(product, variant);
    if (!result.ok) {
      setToast(addToCartFailureMessage(result.reason, t));
      return;
    }

    setToast(t("product.added_to_bag", { name: product.productName }));

    if (navigateToCartOnSuccess) {
      navigate("/cart");
    }
  };

  if (iconOnly) {
    return (
      <>
        <button
          type="button"
          disabled={iconDisabled}
          onClick={handleClick}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white disabled:opacity-40",
            className,
          )}
          aria-label={t("product.add_button")}
        >
          +
        </button>
        <Toast message={toast} visible={Boolean(toast)} onClose={() => setToast("")} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={!canAdd}
        onClick={handleClick}
        className={cn(
          "w-full rounded-full bg-brand-blue px-4 py-3 text-sm font-semibold text-white disabled:opacity-40",
          className,
        )}
      >
        {t("product.add_to_bag")}
      </button>
      {!navigateToCartOnSuccess ? (
        <Toast message={toast} visible={Boolean(toast)} onClose={() => setToast("")} />
      ) : null}
    </>
  );
}

export function ProductGridCard({
  product,
  variant,
}: {
  product: Product;
  variant: ProductVariant;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const imageUrl = variantPrimaryImage(variant) ?? product.displayImage;
  const minPrice = variant.price;
  const inStock = variant.inStock;
  const versionKey = variant.productVersion;

  return (
    <article
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded bg-white shadow-md"
      onClick={() => navigate(`/product/${product.id}?variantId=${variant.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          navigate(`/product/${product.id}?variantId=${variant.id}`);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <ProductVersionCardHeader versionKey={versionKey} />
      <ProductImage alt={product.productName} imageUrl={imageUrl} />
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-tight">
          {product.productName}
        </h3>
        <p className="mt-2 text-sm font-bold">{formatPrice(minPrice)}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span
            className={cn(
              "text-[11px] font-semibold",
              inStock ? "text-accent-green" : "text-accent-red",
            )}
          >
            {inStock ? t("product.in_stock_title") : t("product.out_of_stock_title")}
          </span>
          <ProductAddButton product={product} variant={variant} iconOnly />
        </div>
      </div>
    </article>
  );
}
