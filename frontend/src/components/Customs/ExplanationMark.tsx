import React, { useState, MouseEvent, ReactNode } from "react";
import { IconType } from "react-icons";
import { FaCircleQuestion } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

type ExplanationMarkProps = {
  Icon?: IconType;
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
};

const ExplanationMark: React.FC<ExplanationMarkProps> = ({
  Icon,
  children,
  className,
  height,
  width,
}) => {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handelMouseEnter = (e: MouseEvent) => {
    setIsExplanationOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handelMouseLeave = () => setIsExplanationOpen(false);

  const leftPosition = Math.min(position.x, window.innerWidth - (width || 300));
  const topPosition = Math.min(
    position.y,
    window.innerHeight - (height || 150)
  );

  return (
    <div className="relative">
      <i onMouseEnter={handelMouseEnter} onMouseLeave={handelMouseLeave}>
        {Icon ? (
          <Icon />
        ) : (
          <FaCircleQuestion className="text-secondary-border " />
        )}
      </i>

      {isExplanationOpen && (
        <div
          className={twMerge(
            `absolute bg-secondary-hover top-${topPosition} w-[250px] left-${leftPosition} text-sm p-2`,
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ExplanationMark;
