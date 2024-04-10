import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";

type HorizontalListProps = ComponentProps<"div">;

const HorizontalList: React.FC<HorizontalListProps> = ({
  children,
  className,
  ...rest
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLButtonElement | null>(null);
  const rightRef = useRef<HTMLButtonElement | null>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);
  const [translate, setTranslate] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    setTranslate((prev) => {
      return Math.min(prev, list.scrollWidth - list.clientWidth);
    });
  }, [children]);

  useEffect(() => {
    if (!listRef.current) return;
    const observer = new ResizeObserver(() => {
      const list = listRef.current;
      if (!list) return;
      setShowLeftBtn(translate > 0);
      setShowRightBtn(translate + list.clientWidth < list.scrollWidth);
    });
    observer.observe(listRef.current);
    return () => {
      observer.disconnect();
    };
  }, [translate, children]);

  const handleScroll = (direction: "+" | "-") => {
    const list = listRef.current;
    if (!list) return;
    const multiplyer = direction === "+" ? 1 : -1;
    const left = leftRef.current?.getBoundingClientRect().width || 0;
    const right = rightRef.current?.getBoundingClientRect().width || 0;
    const btnsSizes = left + right;
    setTranslate((prev) => {
      const newTranslate = prev + (list.clientWidth - btnsSizes) * multiplyer;
      if (newTranslate < 0) return 0;

      return Math.min(newTranslate, list.scrollWidth - list.clientWidth);
    });
  };

  return (
    <div ref={listRef} className="overflow-x-hidden relative ">
      <div
        className={twMerge(
          `flex whitespace-nowrap gap-2 py-4 w-max transition-transform`,
          className
        )}
        style={{
          transform: `translateX(-${translate}px)`,
        }}
        {...rest}
      >
        {children}
      </div>
      {showLeftBtn && (
        <Button
          ref={leftRef}
          type="button"
          className="absolute flex justify-center items-center left-0 top-0 bottom-0 w-6 p-0 rounded-r-full"
          onClick={() => handleScroll("-")}
        >
          <FaCaretLeft />
        </Button>
      )}
      {showRightBtn && (
        <Button
          variant={"default"}
          ref={rightRef}
          type="button"
          className="absolute flex justify-center items-center top-0 bottom-0 right-0 w-6 p-0 rounded-l-full"
          onClick={() => handleScroll("+")}
        >
          <FaCaretRight />
        </Button>
      )}
    </div>
  );
};

export default HorizontalList;
