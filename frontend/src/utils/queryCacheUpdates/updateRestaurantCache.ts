import { QueryClient } from "@tanstack/react-query";
import { NestedRestaurantAndAddress } from "../../models/Restaurant";
import queryKeys from "../queryKeys";

class UpdateRestaurantCache {
  private updateGetSingleRestaurantById(
    queryClient: QueryClient,
    data: NestedRestaurantAndAddress
  ) {
    queryClient.setQueryData(
      queryKeys.restaurants.getSingleRestaurantById(data.id),
      data
    );
  }

  private updateGetOwnerRestaurants(
    queryClient: QueryClient,
    data: NestedRestaurantAndAddress
  ) {
    queryClient.setQueryData<NestedRestaurantAndAddress[]>(
      queryKeys.restaurants.getOwnerRestaurants,
      (oldData) => {
        if (!oldData) return;
        return oldData.map((restaurant) => {
          if (restaurant.id !== data.id) return restaurant;
          return data;
        });
      }
    );
  }
  updateSingleRestaurantInCache(
    data: NestedRestaurantAndAddress,
    queryClient: QueryClient
  ) {
    //invalidate restaurants owner queries
    this.updateGetSingleRestaurantById(queryClient, data);
    this.updateGetOwnerRestaurants(queryClient, data);
  }
}

export const updateRestaurantCache = new UpdateRestaurantCache();
