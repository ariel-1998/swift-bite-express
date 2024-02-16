import React, { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "../models/User";
import { authService } from "../services/authService";
import { Address } from "../models/Address";
import { useQuery } from "@tanstack/react-query";
import { addressService } from "../services/addressService";
import queryKeys from "../utils/queryKeys";

export type UserContextProps = {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  address?: Address;
  setAddress: (address: Address | undefined) => void;
  clearCache(): void;
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
    queryKey: queryKeys.auth.getLogin,
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
    queryKey: queryKeys.addresses.getAddressById,
    queryFn: async () => {
      return addressService
        .getAddressById(user!.primaryAddressId!)
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

  useEffect(() => {
    if (user || loadingUser) return;
    const stringAddress = localStorage.getItem("address");
    if (!stringAddress) return;
    const address: Address = JSON.parse(stringAddress);
    setAddress(address);
  }, [user, loadingUser]);

  function clearCache() {
    setUser(undefined);
    setAddress(undefined);
  }

  return (
    <UserInfoContext.Provider
      value={{ user, setUser, address, setAddress, clearCache }}
    >
      {loadingUser ? "Loading..." : children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
