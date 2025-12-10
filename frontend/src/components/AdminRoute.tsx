import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type AdminRouteProps = {
  children: ReactNode;
}

const AdminRoute = ({children}:AdminRouteProps) => {
  const token = localStorage.getItem("token");
  const { user } = useAuth();

  if (!token || !user || !user.admin) {
    return(<Navigate to={"/dashboard"}/>)
  }

  return children;
}

export default AdminRoute;