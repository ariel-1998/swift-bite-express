import React, { ReactNode, createContext, useState } from "react";
import useUserInfo from "../hooks/useUserInfo";
import { Role } from "../models/User";
type RestaurantActiveFormContextProps = {
  activeForm: FormsState;
  setActiveForm: React.Dispatch<React.SetStateAction<FormsState>>;
} | null;

export const RestaurantActiveFormContext =
  createContext<RestaurantActiveFormContextProps>(null);

export type RestaurantForms = {
  name: "restaurant";
  active: "Update Name" | "Update Logo" | "Update Image" | "";
};

export type AddressForms = {
  name: "address";
  active: "Update Address" | "Create Address" | "";
};

export type CategoryForms = {
  name: "category";
  active: "Update Category" | "Create Category" | "";
};

export type MenuItemForms = {
  name: "menu item";
  active:
    | "Create Menu item"
    | "Update Menu item Image"
    | "Update Menu item Details"
    | "";
};

export type FormsState =
  | RestaurantForms
  | AddressForms
  | CategoryForms
  | MenuItemForms;

type RestaurantActiveFormProviderProps = {
  children: ReactNode;
};
const RestaurantActiveFormProvider: React.FC<
  RestaurantActiveFormProviderProps
> = ({ children }) => {
  const [activeForm, setActiveForm] = useState<FormsState>({
    name: "restaurant",
    active: "",
  });
  return (
    <RestaurantActiveFormContext.Provider value={{ setActiveForm, activeForm }}>
      {children}
    </RestaurantActiveFormContext.Provider>
  );
};

export default function FormContextProvider({
  children,
}: RestaurantActiveFormProviderProps) {
  const { user } = useUserInfo();

  if (user?.role !== Role.owner) return children;
  return (
    <RestaurantActiveFormProvider>{children}</RestaurantActiveFormProvider>
  );
}
