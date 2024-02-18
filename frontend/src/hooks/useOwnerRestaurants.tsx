import { useQuery } from "@tanstack/react-query";
import queryKeys from "../utils/queryKeys";
import { restaurantService } from "../services/restaurantService";
import { NestedRestaurantAndAddress } from "../models/Restaurant";

type UseOwnerRestaurants = {
  onSuccess?: (data: NestedRestaurantAndAddress[]) => void;
  onError?: (error: unknown) => void;
};

const useOwnerRestaurants = (props?: UseOwnerRestaurants) => {
  const response = useQuery({
    queryKey: queryKeys.restaurants.getOwnerRestaurants,
    queryFn: async () => {
      try {
        const data = await restaurantService.getOwnerRestaurants();
        if (props?.onSuccess) props.onSuccess(data);
        return data;
      } catch (error) {
        if (props?.onError) props.onError(error);
        throw error;
      }
    },
  });
  return response;
};

export default useOwnerRestaurants;
