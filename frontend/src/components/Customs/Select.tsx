import { cva, VariantProps } from "class-variance-authority";
import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const selectStyles = cva(
  [
    "border-2",
    "cursor-pointer",
    "border-secondary",
    "px-2.5",
    "py-2",
    "leading-tight",
    "outline-none",
  ],
  {
    variants: {
      boxSize: {
        default: ["w-full"],
        fit: ["w-fit"],
      },
      shape: {
        default: ["rounded"],
        underline: ["border-t-0", "border-l-0", "border-r-0"],
      },
    },
    defaultVariants: { shape: "default", boxSize: "default" },
  }
);

type SelectProps = ComponentProps<"select"> & VariantProps<typeof selectStyles>;
const Select: React.FC<SelectProps> = ({
  className,
  shape,
  boxSize,
  ...rest
}) => {
  return (
    <select
      className={twMerge(selectStyles({ shape, boxSize }), className)}
      {...rest}
    />
  );
};

export default Select;
