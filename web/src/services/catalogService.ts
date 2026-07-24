import api from "@/lib/api";
import { parseVariant } from "@/lib/parsers";
import type { Category, Product } from "@/types";

function parseCategory(json: Record<string, unknown>): Category {
  return {
    id: String(json.id ?? ""),
    name: String(json.name ?? ""),
    slug: (json.slug as string | undefined) ?? null,
    description: (json.description as string | undefined) ?? null,
    imageUrl: (json.imageUrl as string | undefined) ?? (json.image_url as string | undefined) ?? null,
    isActive: Boolean(json.isActive ?? json.is_active ?? true),
  };
}

function parseProduct(json: Record<string, unknown>): Product {
  const category = json.category;
  const categoryObj =
    category && typeof category === "object"
      ? parseCategory(category as Record<string, unknown>)
      : null;

  const rawVariants = json.variants;
  const variants = Array.isArray(rawVariants)
    ? rawVariants
        .filter((v): v is Record<string, unknown> => typeof v === "object" && v !== null)
        .map(parseVariant)
    : [];

  return {
    id: String(json.id ?? ""),
    productName: String(json.productName ?? json.product_name ?? ""),
    productDescription:
      (json.productDescription as string | undefined) ??
      (json.product_description as string | undefined) ??
      null,
    categoryId: String(json.categoryId ?? json.category_id ?? categoryObj?.id ?? ""),
    categoryName: String(
      json.categoryName ?? json.category_name ?? categoryObj?.name ?? "",
    ),
    category: categoryObj,
    gender: String(json.gender ?? "UNISEX"),
    brand: (json.brand as string | undefined) ?? null,
    status: String(json.status ?? "ACTIVE"),
    variants,
    displayPrice:
      json.displayPrice != null
        ? Number(json.displayPrice)
        : json.display_price != null
          ? Number(json.display_price)
          : null,
    displayPriceMax:
      json.displayPriceMax != null
        ? Number(json.displayPriceMax)
        : json.display_price_max != null
          ? Number(json.display_price_max)
          : null,
    displayImage:
      (json.displayImage as string | undefined) ??
      (json.display_image as string | undefined) ??
      null,
    variantCount:
      json.variantCount != null
        ? Number(json.variantCount)
        : json.variant_count != null
          ? Number(json.variant_count)
          : variants.length,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get<{ products?: unknown[] }>("products", {
    params: { activeOnly: true },
  });
  const list = data.products;
  if (!Array.isArray(list)) return [];
  return list
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(parseProduct);
}

export async function fetchProduct(id: string): Promise<Product> {
  const { data } = await api.get<{ product?: Record<string, unknown> }>(`products/${id}`);
  const product = data.product;
  if (!product || typeof product !== "object") {
    throw new Error("Invalid product response");
  }
  return parseProduct(product);
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<{ categories?: unknown[] }>("categories", {
    params: { activeOnly: true },
  });
  const list = data.categories;
  if (!Array.isArray(list)) return [];
  return list
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(parseCategory);
}

export function buildVariantIndex(products: Product[]): Map<string, { product: Product; variant: Product["variants"][number] }> {
  const map = new Map<string, { product: Product; variant: Product["variants"][number] }>();
  for (const product of products) {
    for (const variant of product.variants) {
      map.set(variant.id, { product, variant });
    }
  }
  return map;
}
