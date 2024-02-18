import { ReactElement, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedComponentProps = {
  element: ReactNode;
  condition: boolean;
  redirect: string;
};

const ProtectedComponent = ({
  element,
  condition,
  redirect = "/",
}: ProtectedComponentProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(redirect);
  }, [navigate, redirect]);

  return condition ? element : null;
};

export default ProtectedComponent;
