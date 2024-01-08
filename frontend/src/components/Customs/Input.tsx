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

type InputProps = {
  errMessage?: string;
  label?: string;
} & VariantProps<typeof inputStyles> &
  ComponentProps<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, label, errMessage, className, ...rest }, ref) => {
    return (
      <div>
        <InputLabel label={label} />
        <input
          {...rest}
          ref={ref}
          className={twMerge(inputStyles({ variant }), className)}
        />
        <InputError error={errMessage} />
      </div>
    );
  }
);

export default Input;

type InputErrorProps = {
  error?: string;
};

function InputError({ error }: InputErrorProps) {
  return error ? <div className="text-error">{error}</div> : null;
}

type InputLabelProps = {
  label?: string;
};

function InputLabel({ label }: InputLabelProps) {
  return label ? <label>{label}</label> : null;
}
