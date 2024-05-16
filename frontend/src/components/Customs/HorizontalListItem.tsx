import React, { ComponentProps } from "react";
import { FaTimesCircle } from "react-icons/fa";

type HorizontalListItemProps = {
  output: string;
} & ComponentProps<"div">;

const HorizontalListItem: React.FC<HorizontalListItemProps> = ({
  output,
  ...rest
}) => {
  return (
    <div
      className="flex cursor-pointer rounded-full border w-fit p-1 px-2 items-center justify-center gap-1 bg-secondary"
      {...rest}
    >
      <span>{output}</span>
      <span>
        <FaTimesCircle className="text-error" />
      </span>
    </div>
  );
};

export default HorizontalListItem;
