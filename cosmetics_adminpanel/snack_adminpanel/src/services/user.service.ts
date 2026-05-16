import api from "../lib/api";

export type UserStatus = "active" | "inactive";

export interface UserListItem {
  id: string;
  phone: string;
  fullName: string;
  referenceId: string;
  sellerReferenceId?: string | null;
  status: UserStatus;
  createdAt: string;
  persistentInstallId?: string | null;
  hardwareFingerprint?: string | null;
  deviceGroupKey?: string;
  sameDeviceCount?: number;
}

export type AdminUser = UserListItem;

export const getAllUsers = async (): Promise<UserListItem[]> => {
  const { data } = await api.get<UserListItem[]>("/admin/users");
  return data;
};

export const updateUserStatus = async (
  userId: string,
  status: UserStatus
): Promise<UserListItem> => {
  const { data } = await api.patch<UserListItem>(`/admin/users/${userId}/status`, {
    status,
  });
  return data;
};

export const createUser = async ({
  fullName,
  phone,
  password,
  salesReferenceId,
}: {
  fullName: string;
  phone: string;
  password?: string;
  salesReferenceId?: string | null;
}): Promise<UserListItem & { temporaryPassword?: string }> => {
  const { data } = await api.post<UserListItem & { temporaryPassword?: string }>(
    "/admin/users",
    {
      fullName,
      phone,
      password,
      salesReferenceId,
    }
  );
  return data;
};

export function formatDeviceLabel(user: UserListItem): string {
  const fp = user.hardwareFingerprint?.trim();
  if (fp) {
    const tail = fp.length > 10 ? fp.slice(-10) : fp;
    return tail;
  }
  const pi = user.persistentInstallId?.trim();
  if (pi) {
    return pi.length > 10 ? `…${pi.slice(-8)}` : pi;
  }
  return "—";
}
