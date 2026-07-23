import api from "../lib/api";

export interface AdminUser {
  id: string;
  username: string;
  fullName?: string | null;
  role?: string | null;
}

export interface AdminLoginResponse {
  admin: AdminUser;
  accessToken: string;
  expiresIn: number;
}

export const adminLogin = async (
  username: string,
  password: string
): Promise<AdminLoginResponse> => {
  const { data } = await api.post<AdminLoginResponse>("auth/admin/login", {
    username: username.trim(),
    password,
  });
  return data;
};
