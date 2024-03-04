import { VariantProps, cva } from "class-variance-authority";
import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const spinnerStyles = cva(
  [
    "rounded-full",
    "h-full",
    "aspect-square",
    "bg-yellow-500",
    "bg-inherit",
    "border",
    "animate-spin",
    "border-b-0",
  ],
  {
    variants: {
      variant: {
        default: ["border-[#007bff]"],
        disabled: ["border-secondary"],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type SpinnerProps = VariantProps<typeof spinnerStyles> & ComponentProps<"div">;

const Spinner: React.FC<SpinnerProps> = ({ variant, className, ...rest }) => {
  return (
    <div className={twMerge(spinnerStyles({ variant }), className)} {...rest} />
  );
};

export default Spinner;
