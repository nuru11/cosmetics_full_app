import api from "../lib/api";

/** Must match server `ALLOWED_ORDER_STATUSES` in orderController.js */
export const ORDER_STATUS_VALUES = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUS_VALUES)[number];

export function orderStatusLabel(value: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[value] ?? value;
}

export interface OrderListRow {
  id: number;
  customer_name: string;
  phone: string;
  notes: string;
  area: string | null;
  sub_city: string | null;
  building: string | null;
  client_device_id?: string | null;
  total_amount: string | number;
  status: string;
  /** When the order was placed (from orders.created_at). */
  order_created_at?: string;
  created_at: string;
}

/** Order placed-at timestamp — never user account created_at. */
export function getOrderPlacedAt(order: Pick<OrderListRow, "order_created_at" | "created_at">): string {
  return order.order_created_at ?? order.created_at ?? "";
}

function normalizeOrderRow(row: OrderListRow): OrderListRow {
  const placedAt = getOrderPlacedAt(row);
  return {
    ...row,
    order_created_at: placedAt,
    created_at: placedAt,
  };
}

export interface OrderItemRow {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  product_name: string;
}

export interface OrderDetail extends OrderListRow {
  items: OrderItemRow[];
}

export interface OrdersListResult {
  orders: OrderListRow[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchOrders(params?: {
  limit?: number;
  offset?: number;
}): Promise<OrdersListResult> {
  const { data } = await api.get<{ data: OrdersListResult }>("/orders", { params });
  return {
    ...data.data,
    orders: data.data.orders.map(normalizeOrderRow),
  };
}

export async function fetchOrderById(id: number): Promise<OrderDetail> {
  const { data } = await api.get<{ data: OrderDetail }>(`/orders/${id}`);
  return normalizeOrderRow(data.data);
}

export async function patchOrderStatus(id: number, status: string): Promise<OrderDetail> {
  const { data } = await api.patch<{ data: OrderDetail }>(`/orders/${id}`, { status });
  return normalizeOrderRow(data.data);
}
