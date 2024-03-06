import { useContext } from "react";
import { RestaurantActiveFormContext } from "../context/RestaurantActiveFormProvider";

const useActiveRestaurantForm = () => {
  const context = useContext(RestaurantActiveFormContext);
  if (!context)
    throw new Error(
      "Cannot access RestaurantActiveFormContext outside of context"
    );
  return context;
};

export default useActiveRestaurantForm;
