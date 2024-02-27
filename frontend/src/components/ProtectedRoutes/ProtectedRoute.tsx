import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = {
  element: ReactNode;
  condition: boolean;
  redirect: string;
};
//might add a lazy load from react
const ProtectedRoute = ({
  element,
  condition,
  redirect = "/",
}: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!condition) navigate(redirect);
  }, [navigate, redirect, condition]);

  return element;
};

export default ProtectedRoute;
