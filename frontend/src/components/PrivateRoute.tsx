import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUser } from "../context/UserContext";

type PrivateRouteProps = {
  children: ReactNode;
}

export function PrivateRoute({ children }:PrivateRouteProps) {
  const { user, loading } = useUser();

  if (loading) return null;

  return user ? children : <Navigate to="/login"/>;
}
