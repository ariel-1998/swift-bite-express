/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from "react";

type useDebounceProps = {
  wait: number;
  fn: (...unknwon: any[]) => void;
};

const useDebounce = ({ wait, fn }: useDebounceProps) => {
  const [loading, setLoading] = useState(false);

  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const debounce = useCallback(
    (...args: any[]) => {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
      setLoading(true);
      timeOutRef.current = setTimeout(() => {
        setLoading(false);
        fn(...args);
      }, wait);
    },
    [fn, wait]
  );
  return { debounce, loading };
};

export default useDebounce;
