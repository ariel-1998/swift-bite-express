import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const btnStyles = cva(["rounded-full", "transition-colors"], {
  variants: {
    variant: {
      default: ["bg-secondary", "hover:bg-secondary-hover"],
      ghost: ["hover:bg-gray-100"],
      primary: ["bg-primary"],
      error: ["bg-orange"],
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
        "shadow-sm",
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

export type ButtonProps = VariantProps<typeof btnStyles> &
  ComponentProps<"button">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size, variant, disabledBtn, disabled, className, ...rest }, ref) => {
    return (
      <button
        {...rest}
        ref={ref}
        className={twMerge(
          btnStyles({
            variant,
            size,
            disabledBtn: disabled ? disabledBtn : null,
          }),
          className
        )}
        disabled={disabled}
      />
    );
  }
);

export default Button;
