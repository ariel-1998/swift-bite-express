import React, { ReactNode, createContext, useState } from "react";
type RestaurantActiveFormContextProps = {
  activeForm: FormsState;
  setActiveForm: React.Dispatch<React.SetStateAction<FormsState>>;
} | null;

export const RestaurantActiveFormContext =
  createContext<RestaurantActiveFormContextProps>(null);

type RestaurantForms = {
  name: "restaurant";
  active: "name" | "logo" | "image";
};

type AddressForms = {
  name: "address";
  active: "update" | "create";
};

type CategoryForms = {
  name: "category";
  active: "update" | "create";
};

type MenuItemForms = {
  name: "menuItem";
  active: "create" | "updateImage" | "updateNoImg";
};

type FormsState =
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
    active: "name",
  });
  return (
    <RestaurantActiveFormContext.Provider value={{ setActiveForm, activeForm }}>
      {children}
    </RestaurantActiveFormContext.Provider>
  );
};

export default RestaurantActiveFormProvider;
