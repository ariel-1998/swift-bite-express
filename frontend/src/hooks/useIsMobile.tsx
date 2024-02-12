import { useEffect, useState } from "react";

const SMALL_SIZE = 640;

const useIsMobile = () => {
  const [isSmall, setIsSmall] = useState<boolean>(
    window.innerWidth < SMALL_SIZE
  );
  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < SMALL_SIZE);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isSmall;
};

export default useIsMobile;
