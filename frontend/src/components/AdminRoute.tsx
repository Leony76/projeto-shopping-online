import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUser } from "../context/UserContext";

type AdminRouteProps = {
  children: ReactNode;
}

const AdminRoute = ({children}:AdminRouteProps) => {
  const token = localStorage.getItem("token");
  const { user } = useUser();

  if (!token || !user?.admin) {
    return(<Navigate to={"/dashboard"}/>)
  }

  return children;
}

export default AdminRoute;