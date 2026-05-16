import api from "../lib/api";

export type SellerStatus = "active" | "inactive";

export interface SellerListItem {
  id: string;
  name: string;
  phone: string | null;
  referenceId: string;
  status: SellerStatus;
  /** Unique physical devices (deduped by hardware fingerprint). */
  userCount: number;
  /** All user rows with seller_id set (may include same device). */
  totalSignupsWithSeller: number;
  createdAt: string;
}

export const getSellers = async (): Promise<SellerListItem[]> => {
  const { data } = await api.get<SellerListItem[]>("/admin/sellers");
  return data;
};

export const createSeller = async (payload: {
  name: string;
  phone?: string | null;
  referenceId?: string;
}): Promise<SellerListItem> => {
  const { data } = await api.post<SellerListItem>("/admin/sellers", payload);
  return data;
};

export const updateSeller = async (
  id: string,
  payload: { name?: string; phone?: string | null; status?: SellerStatus }
): Promise<SellerListItem> => {
  const { data } = await api.patch<SellerListItem>(`/admin/sellers/${id}`, payload);
  return data;
};
