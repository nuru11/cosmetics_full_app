export const PRODUCT_VERSION_ORDER = ["ORIGINAL", "TWO_LEVEL", "PREMIUM"] as const;

export interface ProductListingEntry {
  product: import("@/types").Product;
  variant: import("@/types").ProductVariant;
}

export interface CategoryProductSection {
  categoryId: string;
  categoryName: string;
  categorySlug?: string | null;
  listingRows: ProductListingEntry[][];
}

export function sortedVariantsForListing(product: import("@/types").Product) {
  const indexed = product.variants.map((variant, index) => ({ variant, index }));
  indexed.sort((a, b) => {
    const va = a.variant.productVersion.toUpperCase();
    const vb = b.variant.productVersion.toUpperCase();
    const ia = PRODUCT_VERSION_ORDER.indexOf(va as (typeof PRODUCT_VERSION_ORDER)[number]);
    const ib = PRODUCT_VERSION_ORDER.indexOf(vb as (typeof PRODUCT_VERSION_ORDER)[number]);
    const oa = ia >= 0 ? ia : PRODUCT_VERSION_ORDER.length;
    const ob = ib >= 0 ? ib : PRODUCT_VERSION_ORDER.length;
    if (oa !== ob) return oa - ob;
    const sortCompare = a.variant.sortOrder - b.variant.sortOrder;
    if (sortCompare !== 0) return sortCompare;
    return a.index - b.index;
  });
  return indexed.map((entry) => entry.variant);
}

export function expandProductsToListingEntries(
  products: import("@/types").Product[],
): ProductListingEntry[] {
  const entries: ProductListingEntry[] = [];
  for (const product of products) {
    for (const variant of sortedVariantsForListing(product)) {
      entries.push({ product, variant });
    }
  }
  return entries;
}

export function chunkListingEntriesIntoRows(
  entries: ProductListingEntry[],
  columns: number,
): ProductListingEntry[][] {
  const rows: ProductListingEntry[][] = [];
  for (let i = 0; i < entries.length; i += columns) {
    rows.push(entries.slice(i, i + columns));
  }
  return rows;
}

export function buildCategorySections(
  products: import("@/types").Product[],
  columns: number,
): CategoryProductSection[] {
  const byCategory = new Map<string, import("@/types").Product[]>();

  for (const product of products) {
    const key = product.categoryId || "unknown";
    const list = byCategory.get(key) ?? [];
    list.push(product);
    byCategory.set(key, list);
  }

  const sections: CategoryProductSection[] = [];

  for (const [categoryId, categoryProducts] of byCategory) {
    const entries = expandProductsToListingEntries(categoryProducts);
    if (entries.length === 0) continue;

    sections.push({
      categoryId,
      categoryName: categoryProducts[0]?.categoryName ?? "Unknown",
      categorySlug: categoryProducts[0]?.category?.slug ?? null,
      listingRows: chunkListingEntriesIntoRows(entries, columns),
    });
  }

  return sections.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}

export function savingsPercentVersusOriginal(
  product: import("@/types").Product,
  variant: import("@/types").ProductVariant,
): number | null {
  const original = product.variants.find((v) => v.productVersion === "ORIGINAL");
  const origPrice = original?.price;
  const price = variant.price;
  if (origPrice == null || origPrice <= 0 || price >= origPrice) return null;
  return Math.round(((origPrice - price) / origPrice) * 100);
}
