import React, { ReactNode } from "react";

type AuthFormProps = {
  title: string;
  children: ReactNode;
};

const AuthForm: React.FC<AuthFormProps> = ({ title, children }) => {
  return (
    <form className="p-6 sm:p-10 border-secondary border-2 flex flex-col w-[95vw] sm:w-[500px] gap-4">
      <h1 className="text-center font-bold text-xl pb-3">{title}</h1>
      {children}
    </form>
  );
};

export default AuthForm;
