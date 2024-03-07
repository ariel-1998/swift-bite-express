import React from "react";
import useActiveRestaurantForm from "../../../../../hooks/useActiveRestaurantForm";
import { FormsState } from "../../../../../context/RestaurantActiveFormProvider";
import { NestedRestaurantAndAddress } from "../../../../../models/Restaurant";

type UpdateOptionsProps = {
  data: NestedRestaurantAndAddress;
};
const forms: FormsState["name"][] = [
  "restaurant",
  "address",
  "category",
  "menu item",
];

const UpdateOptions: React.FC<UpdateOptionsProps> = ({ data }) => {
  const { setActiveForm, activeForm } = useActiveRestaurantForm();

  const updateActiveForm = (form: (typeof forms)[number]) => {
    if (form === activeForm.name) return;
    switch (form) {
      case "restaurant": {
        setActiveForm({ name: form, active: "" });
        break;
      }
      case "address": {
        setActiveForm({
          name: form,
          active: data.address.id ? "Update Address" : "Create Address",
        });
        break;
      }
      case "category": {
        setActiveForm({ name: form, active: "" });
        break;
      }
      case "menu item": {
        setActiveForm({ name: form, active: "" });
        break;
      }
      default: {
        setActiveForm({ name: "menu item", active: "" });
      }
    }
  };

  return (
    <ul className="flex font-bold justify-around mb-5 divide-x divide-solid">
      {forms.map((formName) => (
        <li
          key={formName}
          onClick={() => updateActiveForm(formName)}
          className={`grow hover:bg-secondary p-2 transition-colors text-center
          ${
            activeForm.name === formName
              ? "bg-secondary cursor-default"
              : "hover:bg-secondary cursor-pointer"
          }`}
        >
          {formName}
        </li>
      ))}
    </ul>
  );
};

export default UpdateOptions;
