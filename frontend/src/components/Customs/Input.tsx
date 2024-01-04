import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const inputStyles = cva(
  [
    "w-full",
    "border-solid",
    "border-2",
    "rounded",
    "px-2.5",
    "py-2",
    "outline-none",
    "border-secondary",
  ],
  {
    variants: {
      variant: {
        default: ["focus:border-secondary-hover"],
        error: ["border-error"],
        // secondary: [],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type InputProps = VariantProps<typeof inputStyles> & ComponentProps<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, className, ...rest }, ref) => {
    return (
      <input
        {...rest}
        ref={ref}
        className={twMerge(inputStyles({ variant }), className)}
      />
    );
  }
);

export default Input;
