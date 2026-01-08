import { Navigate } from "react-router-dom";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const ResetPasswordGuard = ({ children }: Props) => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const email = params.get("email");

  if (!token || !email) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ResetPasswordGuard;
