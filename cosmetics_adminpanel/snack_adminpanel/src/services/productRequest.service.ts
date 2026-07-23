import api from "../lib/api";
import { resolveAssetUrl } from "./upload.service";

export const PRODUCT_REQUEST_STATUS_VALUES = [
  "NEW",
  "REVIEWED",
  "FULFILLED",
  "CLOSED",
] as const;

export type ProductRequestStatusValue = (typeof PRODUCT_REQUEST_STATUS_VALUES)[number];

export function productRequestStatusLabel(value: string): string {
  const map: Record<string, string> = {
    NEW: "New",
    REVIEWED: "Reviewed",
    FULFILLED: "Fulfilled",
    CLOSED: "Closed",
  };
  return map[value] ?? value;
}

interface ApiProductRequest {
  id: string;
  description: string;
  imageUrl?: string | null;
  customerName: string;
  phone: string;
  city: string;
  clientDeviceId?: string | null;
  userId?: string | null;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductRequestListRow {
  id: string;
  description: string;
  imageUrl: string | null;
  customerName: string;
  phone: string;
  city: string;
  clientDeviceId: string | null;
  status: string;
  createdAt: string;
}

export interface ProductRequestsListResult {
  productRequests: ProductRequestListRow[];
  total: number;
  limit: number;
  offset: number;
}

function mapProductRequestListRow(row: ApiProductRequest): ProductRequestListRow {
  return {
    id: row.id,
    description: row.description,
    imageUrl: resolveAssetUrl(row.imageUrl),
    customerName: row.customerName,
    phone: row.phone,
    city: row.city,
    clientDeviceId: row.clientDeviceId ?? null,
    status: row.status,
    createdAt: row.createdAt,
  };
}

export async function fetchProductRequests(params?: {
  limit?: number;
  offset?: number;
  status?: string;
}): Promise<ProductRequestsListResult> {
  const { data } = await api.get<{
    productRequests: ApiProductRequest[];
    total: number;
    limit: number;
    offset: number;
  }>("/admin/product-requests", { params });

  return {
    productRequests: data.productRequests.map(mapProductRequestListRow),
    total: data.total,
    limit: data.limit,
    offset: data.offset,
  };
}

export async function patchProductRequestStatus(
  id: string,
  status: string
): Promise<ProductRequestListRow> {
  const { data } = await api.patch<{ productRequest: ApiProductRequest }>(
    `/admin/product-requests/${id}`,
    { status }
  );
  return mapProductRequestListRow(data.productRequest);
}
