import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type PrivateRouteProps = {
  children: ReactNode;
}

export function PrivateRoute({ children }:PrivateRouteProps) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
}
