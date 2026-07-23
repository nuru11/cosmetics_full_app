import api from "../lib/api";

export type ProductGender = "MALE" | "FEMALE" | "UNISEX";
export type ProductStatus = "ACTIVE" | "INACTIVE" | "UNAVAILABLE";
export type ProductVersion = "ORIGINAL" | "TWO_LEVEL" | "PREMIUM";

export interface ProductVariantRow {
  id: string;
  variantDescription: string | null;
  price: string | number;
  inStock: boolean;
  sku: string | null;
  color: string | null;
  size: string | null;
  productVersion: ProductVersion;
  variantImages: string[];
  sortOrder: number;
}

export interface ProductRow {
  id: string;
  productName: string;
  productDescription: string | null;
  categoryId: string;
  categoryName: string;
  gender: ProductGender;
  brand: string | null;
  status: ProductStatus;
  variants: ProductVariantRow[];
  variantCount: number;
  displayPrice: number | null;
  displayPriceMax: number | null;
  displayImage: string | null;
}

interface ApiVariant {
  id: string;
  variantDescription?: string | null;
  variant_description?: string | null;
  price: string | number;
  inStock?: boolean;
  in_stock?: boolean;
  sku?: string | null;
  color?: string | null;
  size?: string | null;
  productVersion?: ProductVersion;
  product_version?: ProductVersion;
  variantImages?: unknown;
  variant_images?: unknown;
  sortOrder?: number;
  sort_order?: number;
}

export function parseVariantImages(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "[]") return [];
    try {
      const decoded = JSON.parse(trimmed) as unknown;
      if (Array.isArray(decoded)) {
        return decoded.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return trimmed ? [trimmed] : [];
    }
  }
  return [];
}

interface ApiProduct {
  id: string;
  productName: string;
  productDescription?: string | null;
  categoryId: string;
  category?: { id: string; name: string; slug?: string } | null;
  gender?: ProductGender;
  brand?: string | null;
  status?: ProductStatus;
  variants?: ApiVariant[];
  variantCount?: number;
  displayPrice?: number | string | null;
  displayPriceMax?: number | string | null;
  displayImage?: string | null;
}

function mapVariant(v: ApiVariant): ProductVariantRow {
  return {
    id: v.id,
    variantDescription: v.variantDescription ?? v.variant_description ?? null,
    price: v.price,
    inStock: v.inStock ?? v.in_stock ?? true,
    sku: v.sku ?? null,
    color: v.color ?? null,
    size: v.size ?? null,
    productVersion: v.productVersion ?? v.product_version ?? "ORIGINAL",
    variantImages: parseVariantImages(v.variantImages ?? v.variant_images),
    sortOrder: v.sortOrder ?? v.sort_order ?? 0,
  };
}

function parseNumber(value: number | string | null | undefined): number | null {
  if (value == null) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function mapProduct(p: ApiProduct): ProductRow {
  const variants = (p.variants ?? []).map(mapVariant);
  return {
    id: p.id,
    productName: p.productName,
    productDescription: p.productDescription ?? null,
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? "—",
    gender: p.gender ?? "UNISEX",
    brand: p.brand ?? null,
    status: p.status ?? "ACTIVE",
    variants,
    variantCount: p.variantCount ?? variants.length,
    displayPrice: parseNumber(p.displayPrice),
    displayPriceMax: parseNumber(p.displayPriceMax),
    displayImage: p.displayImage ?? null,
  };
}

export async function fetchAdminProducts(): Promise<ProductRow[]> {
  const { data } = await api.get<{ products: ApiProduct[] }>("/products", {
    params: { activeOnly: "false" },
  });
  return (data.products ?? []).map(mapProduct);
}

export async function fetchProductById(id: string): Promise<ProductRow> {
  const { data } = await api.get<{ product: ApiProduct }>(`/products/${id}`);
  return mapProduct(data.product);
}

export interface ProductVariantInput {
  id?: string;
  variantDescription?: string | null;
  price: number | string;
  inStock?: boolean;
  sku?: string | null;
  color?: string | null;
  size?: string | null;
  productVersion?: ProductVersion;
  variantImages?: string[];
  sortOrder?: number;
}

export interface ProductInput {
  productName: string;
  productDescription?: string | null;
  categoryId: string;
  gender?: ProductGender;
  brand?: string | null;
  status?: ProductStatus;
  variants: ProductVariantInput[];
}

export async function createProduct(input: ProductInput): Promise<ProductRow> {
  const { data } = await api.post<{ product: ApiProduct }>("/products", input);
  return mapProduct(data.product);
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<ProductRow> {
  const { data } = await api.patch<{ product: ApiProduct }>(`/products/${id}`, input);
  return mapProduct(data.product);
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
