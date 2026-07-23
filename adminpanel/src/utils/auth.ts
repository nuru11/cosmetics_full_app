export const getToken = () => localStorage.getItem("auth_token");
export const getAuthUser = () => {
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      id?: string;
      username?: string;
      role?: string;
      fullName?: string;
      email?: string | null;
      phone?: string | null;
      referenceId?: string | null;
    };
  } catch {
    return null;
  }
};

export const getCurrentAdminRole = () => getAuthUser()?.role ?? null;
/** Settings + admin-only routes. Server default role is `admin`; also allow SUPER_ADMIN. */
export const isSuperAdmin = () => {
  const r = getCurrentAdminRole();
  if (!r) return false;
  if (r === "SUPER_ADMIN") return true;
  const lower = r.toLowerCase();
  return lower === "admin" || lower === "super_admin";
};
export const isSales = () => getCurrentAdminRole() === "SALES";
export const isMarketer = () => getCurrentAdminRole() === "MARKETER";
export const isFinance = () => getCurrentAdminRole() === "FINANCE";
export const canCreateUser = () => getCurrentAdminRole() === "SUPER_ADMIN";

const base64UrlDecode = (input: string): string => {
  let str = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad === 2) str += "==";
  else if (pad === 3) str += "=";
  else if (pad === 1) throw new Error("Invalid base64url string");

  const binary = atob(str);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const isTokenExpired = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;

    const payload = JSON.parse(base64UrlDecode(parts[1])) as { exp?: number };
    if (typeof payload.exp !== "number") return false;

    return Date.now() >= payload.exp * 1000;
  } catch (err) {
    console.error("Error checking token expiration:", err);
    return true;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  if (isTokenExpired(token)) {
    logout();
    return false;
  }

  return true;
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
};
