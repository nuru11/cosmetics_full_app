import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, isSuperAdmin } from "../utils/auth";

export default function SuperAdminRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  if (!isSuperAdmin()) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
}
