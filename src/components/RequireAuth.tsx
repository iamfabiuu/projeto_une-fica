// components/RequireAuth.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../store/useApp";
import type { Role } from "../store/auth";

export function RequireAuth({ role }: { role?: Role }) {
  const user = useApp((s) => s.user);
  const { pathname } = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: pathname }} replace />;
  if (role && user.role !== role) return <Navigate to="/sem-acesso" replace />;
  return <Outlet />;
}
