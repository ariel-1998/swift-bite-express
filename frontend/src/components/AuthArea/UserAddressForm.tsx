import React, { ComponentProps, MouseEvent, ReactNode } from "react";

type AuthFormProps = {
  title?: string;
  children: ReactNode;
} & ComponentProps<"form">;

const AuthForm: React.FC<AuthFormProps> = ({ title, children, ...rest }) => {
  const stopPropagation = (e: MouseEvent) => e.stopPropagation();
  return (
    <form
      onClick={stopPropagation}
      {...rest}
      className="p-6 sm:p-10 border-secondary border-2 flex flex-col w-[95vw] sm:w-[500px] gap-4 bg-white"
    >
      <h1 className="text-center font-bold text-xl pb-3">{title}</h1>
      {children}
    </form>
  );
};

export default AuthForm;
