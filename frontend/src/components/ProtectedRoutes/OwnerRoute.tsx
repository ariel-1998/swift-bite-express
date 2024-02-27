import React, { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";
import useUserInfo from "../../hooks/useUserInfo";
import { Role } from "../../models/User";

type OwnerRouteProps = {
  element: ReactNode;
  redirect?: string;
};

const OwnerRoute: React.FC<OwnerRouteProps> = ({ element, redirect = "/" }) => {
  const { user } = useUserInfo();
  return (
    <ProtectedRoute
      element={element}
      condition={user?.role === Role.owner}
      redirect={redirect ?? "/"}
    />
  );
};

export default OwnerRoute;
