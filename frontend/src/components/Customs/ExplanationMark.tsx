import React, { useState, MouseEvent, ReactNode, useRef } from "react";
import { IconType } from "react-icons";
import { FaCircleQuestion } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

type ExplanationMarkProps = {
  Icon?: IconType;
  children: ReactNode;
  className?: string;
  width?: number;
};

const ExplanationMark: React.FC<ExplanationMarkProps> = ({
  Icon,
  children,
  className,
  width = 300,
}) => {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const explanationRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handelMouseEnter = (e: MouseEvent) => {
    setIsExplanationOpen(true);
    if (!wrapperRef.current || !explanationRef.current) return;
    const wrapperRect = wrapperRef.current?.getBoundingClientRect();
    const y = e.pageY + wrapperRect.height;
    const x = Math.min(e.clientX, window.innerWidth - width);
    setPosition({ x, y });
  };

  const handelMouseLeave = () => setIsExplanationOpen(false);

  return (
    <div ref={wrapperRef}>
      <i onMouseEnter={handelMouseEnter} onMouseLeave={handelMouseLeave}>
        {Icon ? (
          <Icon />
        ) : (
          <FaCircleQuestion className="text-secondary-border " />
        )}
      </i>

      <div
        ref={explanationRef}
        className={twMerge(
          `absolute bg-secondary w-[${width}px] rounded text-sm p-2 ${
            isExplanationOpen ? "block" : "hidden"
          }`,
          className
        )}
        style={{
          top: position.y,
          left: position.x,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ExplanationMark;
