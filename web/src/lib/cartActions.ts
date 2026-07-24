import { useCartStore } from "@/stores/cartStore";
import type { Product, ProductVariant } from "@/types";

export type AddToCartResult =
  | { ok: true }
  | { ok: false; reason: "unavailable" | "out_of_stock" | "no_variant" };

export function addVariantToCart(
  product: Product,
  variant: ProductVariant,
  quantity = 1,
): AddToCartResult {
  if (product.status.toUpperCase() !== "ACTIVE") {
    return { ok: false, reason: "unavailable" };
  }

  if (!variant.inStock) {
    return { ok: false, reason: "out_of_stock" };
  }

  const cart = useCartStore.getState();
  const current = cart.quantityFor(variant.id);

  if (current > 0) {
    cart.setQuantity(variant.id, current + quantity);
  } else {
    cart.add(variant.id, quantity);
  }

  return { ok: true };
}

export function addToCartFailureMessage(
  reason: Exclude<AddToCartResult, { ok: true }>["reason"],
  t: (key: string) => string,
): string {
  switch (reason) {
    case "unavailable":
      return t("cart_action.unavailable_product");
    case "out_of_stock":
      return t("cart_action.out_of_stock_message");
    case "no_variant":
      return t("cart_action.no_options_message");
  }
}
