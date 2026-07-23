import api from "../lib/api";

export type AdminRole = "SUPER_ADMIN" | "SALES" | "MARKETER" | "FINANCE";
export type AdminAccountStatus = "ACTIVE" | "INACTIVE";

export interface CreateAdminPayload {
  username: string;
  fullName: string;
  password: string;
  phone?: string | null;
  email?: string | null;
  role: AdminRole;
  status?: AdminAccountStatus;
}

export interface AdminRecord {
  id: string;
  username: string;
  fullName: string;
  referenceId?: string | null;
  phone?: string | null;
  email?: string | null;
  role: AdminRole;
  status: AdminAccountStatus;
  createdAt?: string;
  updatedAt?: string;
}

export const createAdmin = async (payload: CreateAdminPayload): Promise<AdminRecord> => {
  const { data } = await api.post<{ admin: AdminRecord }>("/admin", payload);
  return data.admin;
};
