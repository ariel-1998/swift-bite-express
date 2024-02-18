import React, { ReactNode } from "react";
import ProtectedComponent from "./ProtectedComponent";
import useUserInfo from "../../hooks/useUserInfo";

type ProtectedUserComponentProps = {
  element: ReactNode;
  redirect?: string;
};
const ProtectedUserComponent: React.FC<ProtectedUserComponentProps> = ({
  element,
  redirect = "/",
}) => {
  const { user } = useUserInfo();
  return (
    <ProtectedComponent
      element={element}
      condition={!!user}
      redirect={redirect}
    />
  );
};

export default ProtectedUserComponent;
