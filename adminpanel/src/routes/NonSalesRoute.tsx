import { Navigate, Outlet } from "react-router-dom";
import { getCurrentAdminRole, isAuthenticated } from "../utils/auth";

export default function NonSalesRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  const role = getCurrentAdminRole();
  if (role !== "SUPER_ADMIN" && role !== "FINANCE") {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
}
