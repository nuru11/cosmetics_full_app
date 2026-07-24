import api, { ApiException } from "@/lib/api";
import type { Order } from "@/types";

function parseOrderLineItem(json: Record<string, unknown>) {
  const product = json.product;
  let productName: string | null = null;
  if (product && typeof product === "object") {
    productName = String((product as Record<string, unknown>).name ?? "");
  }
  return {
    id: String(json.id ?? ""),
    productId: String(json.productId ?? json.product_id ?? ""),
    quantity: Number(json.quantity ?? 0),
    unitPrice: Number(json.unitPrice ?? json.unit_price ?? 0),
    lineTotal: Number(json.lineTotal ?? json.line_total ?? 0),
    productName,
  };
}

function parseOrder(json: Record<string, unknown>): Order {
  const rawItems = json.items;
  const items = Array.isArray(rawItems)
    ? rawItems
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
        .map(parseOrderLineItem)
    : [];

  return {
    id: String(json.id ?? ""),
    status: String(json.status ?? "PENDING"),
    totalAmount: Number(json.totalAmount ?? json.total_amount ?? 0),
    createdAt: String(json.createdAt ?? json.created_at ?? "") || null,
    customerName: (json.customerName as string | undefined) ?? (json.customer_name as string | undefined) ?? null,
    phone: (json.phone as string | undefined) ?? null,
    city: (json.city as string | undefined) ?? null,
    items,
  };
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await api.get<{ orders?: unknown[] }>("orders");
  const list = data.orders;
  if (!Array.isArray(list)) return [];
  return list
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map(parseOrder);
}

export async function checkoutOrder(payload: {
  items: { variantId: string; quantity: number }[];
  customerName: string;
  phone: string;
  city: string;
}): Promise<Order> {
  const { data } = await api.post<{ order?: Record<string, unknown> }>("orders/checkout", {
    items: payload.items,
    customerName: payload.customerName,
    phone: payload.phone,
    city: payload.city,
  });
  const order = data.order;
  if (!order || typeof order !== "object") {
    throw new ApiException("Invalid checkout response");
  }
  return parseOrder(order);
}
