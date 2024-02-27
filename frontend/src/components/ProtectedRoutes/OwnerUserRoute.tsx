import React, { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";
import useUserInfo from "../../hooks/useUserInfo";
import { Role } from "../../models/User";

type OwnerUserRouteProps = {
  element: ReactNode;
  redirect?: string;
};
const OwnerUserRoute: React.FC<OwnerUserRouteProps> = ({
  element,
  redirect = "/",
}) => {
  const { user } = useUserInfo();
  return (
    <ProtectedRoute
      element={element}
      condition={user?.role === Role.user || user?.role === Role.owner}
      redirect={redirect}
    />
  );
};

export default OwnerUserRoute;
