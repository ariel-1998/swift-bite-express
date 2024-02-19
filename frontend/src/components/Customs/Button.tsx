import { VariantProps, cva } from "class-variance-authority";
import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const btnStyles = cva(["rounded-full", "transition-colors"], {
  variants: {
    variant: {
      default: ["bg-secondary", "hover:bg-secondary-hover"],
      ghost: ["hover:bg-gray-100"],
      primary: ["bg-primary"],
    },
    size: {
      default: ["rounded", "p-2"],
      icon: [
        "rounded-full",
        "w-10",
        "h-10",
        "flex",
        "items-center",
        "justify-center",
        "p-2.5",
      ],
      formBtn: [
        "py-2",
        "px-4",
        "rounded-tr-full",
        "rounded-br-full",
        "font-semibold",
        "w-full",
      ],
    },
    disabledBtn: {
      default: ["bg-secondary", "cursor-default"],
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
    disabledBtn: "default",
  },
});

type ButtonProps = VariantProps<typeof btnStyles> & ComponentProps<"button">;

const Button: React.FC<ButtonProps> = ({
  size,
  variant,
  disabledBtn,
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={twMerge(
        btnStyles({
          variant,
          size,
          disabledBtn: rest.disabled ? disabledBtn : null,
        }),
        className
      )}
    />
  );
};

export default Button;
