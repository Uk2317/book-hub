import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("jwt_token");
  if (token === undefined) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
