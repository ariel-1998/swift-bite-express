import React, { ReactNode } from "react";
import ProtectedComponent from "./ProtectedComponent";
import useUserInfo from "../../hooks/useUserInfo";

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
      condition={!!user?.isRestaurantOwner}
      redirect={redirect ?? "/"}
    />
  );
};

export default ProtectedRestaurantOwnerComponent;
