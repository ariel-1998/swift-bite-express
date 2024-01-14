import React, { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "../models/User";
import { authService } from "../services/authService";
import { Address } from "../models/Address";

export type UserContextProps = {
  user?: User;
  setUser: (user: User) => void;
  address?: Address;
  setAddress: (address: Address) => void;
};

export const UserInfoContext = createContext<UserContextProps | null>(null);

type UserInfoProviderProps = {
  children: ReactNode;
};

const UserInfoProvider: React.FC<UserInfoProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [address, setAddress] = useState<Address>();
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    //fetchUser
    authService
      .getLogin()
      .then((user) => setUser(user))
      .finally(() => setLoadingUser(false));
  }, []);

  return (
    <UserInfoContext.Provider value={{ user, setUser, address, setAddress }}>
      {loadingUser ? "Loading..." : children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
