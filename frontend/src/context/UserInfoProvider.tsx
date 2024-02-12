import React, { ReactNode, createContext, useState } from "react";
import { User } from "../models/User";
import { authService } from "../services/authService";
import { Address } from "../models/Address";
import { useQuery } from "@tanstack/react-query";
import { addressService } from "../services/addressService";

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

  //get user data
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return authService
        .getLogin()
        .then((data) => {
          setUser(data);
          if (!data.primaryAddressId) setLoadingUser(false);
          return data;
        })
        .catch((err) => {
          setLoadingUser(false);
          throw err;
        });
    },
  });

  //get user address
  useQuery({
    queryKey: ["userAddress"],
    queryFn: async () => {
      if (!user) return undefined;
      return addressService
        .getAddressById(user.primaryAddressId!)
        .then((data) => {
          setAddress(data);
          return data;
        })
        .finally(() => {
          setLoadingUser(false);
        });
    },
    enabled: !!user?.primaryAddressId,
  });

  return (
    <UserInfoContext.Provider value={{ user, setUser, address, setAddress }}>
      {loadingUser ? "Loading..." : children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
