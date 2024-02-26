import React, { ReactNode } from "react";
import ProtectedComponent from "./ProtectedComponent";
import useUserInfo from "../../hooks/useUserInfo";
import { Role } from "../../models/User";

type ProtectedRestaurantOwnerComponentProps = {
  element: ReactNode;
  redirect?: string;
};

const ProtectedRestaurantOwnerComponent: React.FC<
  ProtectedRestaurantOwnerComponentProps
> = ({ element, redirect = "/" }) => {
  const { user } = useUserInfo();
  return (
    <ProtectedComponent
      element={element}
      condition={user?.role === Role.owner}
      redirect={redirect ?? "/"}
    />
  );
};

export default ProtectedRestaurantOwnerComponent;
