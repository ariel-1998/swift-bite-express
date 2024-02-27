import React, { ReactNode } from "react";

type ProtectedCompProps = {
  condition: boolean;
  children: ReactNode;
};

const ProtectedComp: React.FC<ProtectedCompProps> = ({
  children,
  condition,
}) => {
  return condition ? children : null;
};

export default ProtectedComp;
