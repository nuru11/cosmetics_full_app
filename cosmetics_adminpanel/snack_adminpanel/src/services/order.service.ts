import api from "../lib/api";

export const ORDER_STATUS_VALUES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUS_VALUES)[number];

export function orderStatusLabel(value: string): string {
  const map: Record<string, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return map[value] ?? value;
}

interface ApiProduct {
  id: string;
  productName?: string;
}

interface ApiOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
  product?: ApiProduct | null;
}

interface ApiOrder {
  id: string;
  userId?: string | null;
  clientDeviceId?: string | null;
  status: string;
  totalAmount: string | number;
  customerName?: string | null;
  phone?: string | null;
  city?: string | null;
  shippingAddress?: { name?: string; phone?: string; city?: string } | null;
  createdAt: string;
  updatedAt?: string;
  items?: ApiOrderItem[];
}

export interface OrderListRow {
  id: string;
  customerName: string;
  phone: string;
  city: string | null;
  clientDeviceId: string | null;
  totalAmount: string | number;
  status: string;
  createdAt: string;
}

export interface OrderItemRow {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
  productName: string;
}

export interface OrderDetail extends OrderListRow {
  userId: string | null;
  shippingAddress: { name?: string; phone?: string; city?: string } | null;
  items: OrderItemRow[];
}

export interface OrdersListResult {
  orders: OrderListRow[];
  total: number;
  limit: number;
  offset: number;
}

function mapOrderItem(item: ApiOrderItem): OrderItemRow {
  return {
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    lineTotal: item.lineTotal,
    productName: item.product?.productName ?? "—",
  };
}

function mapOrderListRow(o: ApiOrder): OrderListRow {
  return {
    id: o.id,
    customerName: o.customerName ?? "—",
    phone: o.phone ?? "—",
    city: o.city ?? null,
    clientDeviceId: o.clientDeviceId ?? null,
    totalAmount: o.totalAmount,
    status: o.status,
    createdAt: o.createdAt,
  };
}

function mapOrderDetail(o: ApiOrder): OrderDetail {
  return {
    ...mapOrderListRow(o),
    userId: o.userId ?? null,
    shippingAddress: o.shippingAddress ?? null,
    items: (o.items ?? []).map(mapOrderItem),
  };
}

export async function fetchOrders(params?: {
  limit?: number;
  offset?: number;
  status?: string;
}): Promise<OrdersListResult> {
  const { data } = await api.get<{
    orders: ApiOrder[];
    total: number;
    limit: number;
    offset: number;
  }>("/admin/orders", { params });

  return {
    orders: data.orders.map(mapOrderListRow),
    total: data.total,
    limit: data.limit,
    offset: data.offset,
  };
}

export async function fetchOrderById(id: string): Promise<OrderDetail> {
  const { data } = await api.get<{ order: ApiOrder }>(`/admin/orders/${id}`);
  return mapOrderDetail(data.order);
}

export async function patchOrderStatus(id: string, status: string): Promise<OrderDetail> {
  const { data } = await api.patch<{ order: ApiOrder }>(`/admin/orders/${id}`, {
    status,
  });
  return mapOrderDetail(data.order);
}
