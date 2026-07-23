import api from "../lib/api";

export type DeliveryKind = "areas" | "sub-cities" | "buildings";

export interface DeliveryRowAdmin {
  id: number;
  name: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
}

export async function fetchDeliveryAdmin(kind: DeliveryKind): Promise<DeliveryRowAdmin[]> {
  const { data } = await api.get<{ data: DeliveryRowAdmin[] }>(`/delivery/admin/${kind}`);
  return data.data ?? [];
}

export async function createDeliveryRow(
  kind: DeliveryKind,
  body: { name: string; sort_order?: number; is_active?: number | boolean },
): Promise<number> {
  const { data } = await api.post<{ data: { id: number } }>(`/delivery/${kind}`, {
    name: body.name,
    sort_order: body.sort_order ?? 0,
    is_active: body.is_active === false || body.is_active === 0 ? 0 : 1,
  });
  return data.data?.id ?? 0;
}

export async function updateDeliveryRow(
  kind: DeliveryKind,
  id: number,
  patch: Partial<{ name: string; sort_order: number; is_active: number | boolean }>,
): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.sort_order !== undefined) payload.sort_order = patch.sort_order;
  if (patch.is_active !== undefined) {
    payload.is_active = patch.is_active === false || patch.is_active === 0 ? 0 : 1;
  }
  await api.patch(`/delivery/${kind}/${id}`, payload);
}

export async function deleteDeliveryRow(kind: DeliveryKind, id: number): Promise<void> {
  await api.delete(`/delivery/${kind}/${id}`);
}
