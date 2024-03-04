import { forwardRef } from "react";
import Input, { InputProps } from "./Input";
import Spinner from "./Spinner";

type LoadingInputProps = {
  spinner?: "default" | "disabled" | null | undefined;
  loading?: boolean;
} & InputProps;

const LoadingInput = forwardRef<HTMLInputElement, LoadingInputProps>(
  ({ spinner = "default", loading = false, disabled, ...rest }, ref) => {
    return (
      <div className="relative p-0 m-0">
        <Input {...rest} ref={ref} disabled={loading || disabled} />
        {loading && (
          <div className="absolute  left-2 bottom-2.5 h-6">
            <Spinner variant={spinner} />
          </div>
        )}
      </div>
    );
  }
);

export default LoadingInput;
