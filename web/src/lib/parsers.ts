import type { ProductVariant } from "@/types";

function parsePrice(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value) || 0;
  return 0;
}

function parseInStock(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
    const asNumber = Number.parseInt(normalized, 10);
    if (!Number.isNaN(asNumber)) return asNumber > 0;
  }
  return true;
}

function parseImages(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.map(String).filter((s) => s.length > 0);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "[]") return [];
    try {
      const decoded = JSON.parse(trimmed) as unknown;
      if (Array.isArray(decoded)) {
        return decoded.map(String).filter((s) => s.length > 0);
      }
    } catch {
      return [];
    }
  }
  return [];
}

export function parseVariant(json: Record<string, unknown>): ProductVariant {
  return {
    id: String(json.id ?? ""),
    variantDescription:
      (json.variantDescription as string | undefined) ??
      (json.variant_description as string | undefined) ??
      null,
    price: parsePrice(json.price),
    inStock: parseInStock(json.inStock ?? json.in_stock ?? json.stock),
    sku: (json.sku as string | undefined) ?? null,
    color: (json.color as string | undefined) ?? null,
    size: (json.size as string | undefined) ?? null,
    productVersion: String(
      json.productVersion ?? json.product_version ?? "ORIGINAL",
    ).toUpperCase(),
    variantImages: parseImages(json.variantImages ?? json.variant_images),
    sortOrder: Number(json.sortOrder ?? json.sort_order ?? 0),
  };
}

export function variantPrimaryImage(variant: ProductVariant): string | null {
  return variant.variantImages[0] ?? null;
}

export function productPrimaryImage(product: {
  displayImage?: string | null;
  variants: ProductVariant[];
}): string | null {
  if (product.displayImage) return product.displayImage;
  const first = product.variants[0];
  return first ? variantPrimaryImage(first) : null;
}

export function firstInStockVariant(
  product: { variants: ProductVariant[] },
): ProductVariant | null {
  return product.variants.find((v) => v.inStock) ?? product.variants[0] ?? null;
}
