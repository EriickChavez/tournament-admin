import { Navigate, Outlet } from "react-router";
import { useCurrentUser } from "../features/auth/hooks/use-current-user";

export function ProtectedRoute() {
  const { data, isLoading } = useCurrentUser();

  if (isLoading) return null;
  if (!data?.user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { data, isLoading } = useCurrentUser();

  if (isLoading) return null;
  if (data?.user) return <Navigate to="/home" replace />;

  return <Outlet />;
}
