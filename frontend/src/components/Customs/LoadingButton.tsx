import React from "react";
import Button, { ButtonProps } from "./Button.tsx";
import Spinner from "./Spinner.tsx";

type LoadingButtonProps = Omit<ButtonProps, "disabledBtn"> & {
  isLoading?: boolean;
};
const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  disabled,
  ...rest
}) => {
  return (
    <Button {...rest} disabled={disabled}>
      {isLoading || disabled ? (
        <div className="flex justify-center">
          <Spinner className="h-6" variant={"white"} />
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
