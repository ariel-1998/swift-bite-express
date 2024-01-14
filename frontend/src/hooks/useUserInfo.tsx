import { useContext } from "react";
import { UserContextProps, UserInfoContext } from "../context/UserInfoProvider";

const useUserInfo = (): UserContextProps => {
  const context = useContext(UserInfoContext);
  if (!context)
    throw new Error("useUserInfo must be used inside UserInfoProvider!");
  return context;
};

export default useUserInfo;
