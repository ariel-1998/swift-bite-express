import { useEffect, useState } from "react";

const LG_SIZE = 1024;
const MD_SIZE = 768;
const SM_SIZE = 640;
function determinSize(size: Screen) {
  if (size === "sm") return SM_SIZE;
  if (size === "md") return MD_SIZE;
  return LG_SIZE;
}
type Screen = "lg" | "md" | "sm";
const useScreenSize = (size: Screen) => {
  const breakPoint = determinSize(size);
  const [isSmaller, setIsSmaller] = useState<boolean>(
    window.innerWidth <= breakPoint
  );
  useEffect(() => {
    const handleResize = () => {
      setIsSmaller(window.innerWidth <= breakPoint);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakPoint]);

  return isSmaller;
};

export default useScreenSize;
