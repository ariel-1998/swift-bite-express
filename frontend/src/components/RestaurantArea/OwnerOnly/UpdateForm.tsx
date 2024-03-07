import React, { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type UpdateFormProps = {
  children: ReactNode;
  formTitle?: string;
} & ComponentProps<"form">;

const classes = "flex flex-col gap-3 px-10 py-5";
const UpdateForm: React.FC<UpdateFormProps> = ({
  className,
  children,
  formTitle,
  ...rest
}) => {
  return (
    <form className={twMerge(classes, className)} {...rest}>
      <div className="text-center font-bold text-xl">{formTitle}</div>
      {children}
    </form>
  );
};

export default UpdateForm;
