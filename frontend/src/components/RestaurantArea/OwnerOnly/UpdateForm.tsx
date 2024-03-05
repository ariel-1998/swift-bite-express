import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type UpdateFormProps = ComponentProps<"form">;

const classes = "flex flex-col gap-3 p-10";
const UpdateForm: React.FC<UpdateFormProps> = ({ className, ...rest }) => {
  return <form className={twMerge(classes, className)} {...rest} />;
};

export default UpdateForm;
