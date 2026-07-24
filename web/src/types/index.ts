export type ProductVersion = "ORIGINAL" | "TWO_LEVEL" | "PREMIUM" | string;

export interface ProductVariant {
  id: string;
  variantDescription?: string | null;
  price: number;
  inStock: boolean;
  sku?: string | null;
  color?: string | null;
  size?: string | null;
  productVersion: ProductVersion;
  variantImages: string[];
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface Product {
  id: string;
  productName: string;
  productDescription?: string | null;
  categoryId: string;
  categoryName: string;
  category?: Category | null;
  gender: string;
  brand?: string | null;
  status: string;
  variants: ProductVariant[];
  displayPrice?: number | null;
  displayPriceMax?: number | null;
  displayImage?: string | null;
  variantCount?: number | null;
}

export interface CartLine {
  variantId: string;
  quantity: number;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productName?: string | null;
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt?: string | null;
  customerName?: string | null;
  phone?: string | null;
  city?: string | null;
  items: OrderLineItem[];
}

export interface CheckoutContact {
  name: string;
  phone: string;
  city: string;
}

export type OrderFilter = "all" | "active" | "past";
