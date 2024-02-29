import React, { ComponentProps, ReactNode } from "react";

type UpdateFormProps = {
  children: ReactNode;
} & ComponentProps<"form">;

const UpdateForm: React.FC<UpdateFormProps> = ({ children, ...rest }) => {
  return (
    <form {...rest} className="flex flex-col gap-3 p-10">
      {children}
    </form>
  );
};

export default UpdateForm;
