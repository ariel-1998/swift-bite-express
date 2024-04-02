import React, { ChangeEvent } from "react";
import useActiveRestaurantForm from "../../../../../hooks/useActiveRestaurantForm";
import Select from "../../../../Customs/Select";
import {
  CategoryForms,
  FormsState,
  MenuItemForms,
  RestaurantForms,
} from "../../../../../context/RestaurantActiveFormProvider";

type ActiveForm<T extends FormsState> = T["active"][];
const restaurantForms: ActiveForm<RestaurantForms> = [
  "Update Image",
  "Update Logo",
  "Update Name",
];
//no need for address as i set the form based on if there is an address in restaurant or not
//check is in FormOptions
// const addresssForms: ActiveForm<AddressForms>= ["create", "update"];
const categoryForms: ActiveForm<CategoryForms> = [
  "Create Category",
  "Update Category",
];
const menuItemForms: ActiveForm<MenuItemForms> = [
  "Create Menu item",
  "Update Menu item",
];

const ActiveFormOptions: React.FC = () => {
  const { activeForm, setActiveForm } = useActiveRestaurantForm();
  const options = getOptionsArr();

  const changeActiveForm = (e: ChangeEvent<HTMLSelectElement>) => {
    const active = e.target.value;
    setActiveForm((prev) => ({ ...prev, active } as FormsState));
  };

  function getOptionsArr() {
    switch (activeForm.name) {
      case "restaurant":
        return restaurantForms;
      case "category":
        return categoryForms;
      case "menu item":
        return menuItemForms;
      default:
        return null;
    }
  }

  return (
    options && (
      <div className="px-10">
        <Select
          shape={"underline"}
          defaultValue={""}
          onChange={changeActiveForm}
        >
          <option value={""} disabled={activeForm.active !== ""}>
            Select Action
          </option>
          {options.map((opt) => (
            <option value={opt} key={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </div>
    )
  );
};

export default ActiveFormOptions;
