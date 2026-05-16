import api from "../lib/api";

export type ProductGender = "MALE" | "FEMALE" | "UNISEX";
export type ProductStatus = "ACTIVE" | "INACTIVE" | "UNAVAILABLE";
export type ProductVersion = "ORIGINAL" | "TWO_LEVEL" | "PREMIUM";

export interface ProductRow {
  id: string;
  productName: string;
  productDescription: string | null;
  categoryId: string;
  categoryName: string;
  price: string | number;
  gender: ProductGender;
  brand: string | null;
  status: ProductStatus;
  productVersion: ProductVersion;
  color: string | null;
  size: string | null;
  stock: number;
  sku: string | null;
  productImages: string[];
}

interface ApiProduct {
  id: string;
  productName: string;
  productDescription?: string | null;
  categoryId: string;
  category?: { id: string; name: string; slug?: string } | null;
  price: string | number;
  gender?: ProductGender;
  brand?: string | null;
  status?: ProductStatus;
  productVersion?: ProductVersion;
  color?: string | null;
  size?: string | null;
  stock?: number;
  sku?: string | null;
  productImages?: string[] | null;
}

function mapProduct(p: ApiProduct): ProductRow {
  return {
    id: p.id,
    productName: p.productName,
    productDescription: p.productDescription ?? null,
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? "—",
    price: p.price,
    gender: p.gender ?? "UNISEX",
    brand: p.brand ?? null,
    status: p.status ?? "ACTIVE",
    productVersion: p.productVersion ?? "ORIGINAL",
    color: p.color ?? null,
    size: p.size ?? null,
    stock: p.stock ?? 0,
    sku: p.sku ?? null,
    productImages: Array.isArray(p.productImages) ? p.productImages : [],
  };
}

export async function fetchAdminProducts(): Promise<ProductRow[]> {
  const { data } = await api.get<{ products: ApiProduct[] }>("/products", {
    params: { activeOnly: "false" },
  });
  return (data.products ?? []).map(mapProduct);
}

export interface ProductInput {
  productName: string;
  productDescription?: string | null;
  categoryId: string;
  price: number | string;
  gender?: ProductGender;
  brand?: string | null;
  status?: ProductStatus;
  productVersion?: ProductVersion;
  color?: string | null;
  size?: string | null;
  stock?: number;
  sku?: string | null;
  productImages?: string[];
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
