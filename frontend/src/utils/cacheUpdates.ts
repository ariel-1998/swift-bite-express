import { QueryClient } from "@tanstack/react-query";
import { NestedRestaurantAndAddress } from "../models/Restaurant";
import queryKeys from "./queryKeys";
import { Address } from "../models/Address";

class UpdateRestaurantCache {
  private invalidateRestaurantSearchQueries(
    queryClient: QueryClient,
    address: Address | undefined
  ) {
    queryClient.invalidateQueries({
      queryKey: ["restaurants", address, "search"],
    });
  }
  private invalidateGetNearRestaurantsByPage(
    queryClient: QueryClient,
    address: Address | undefined
  ) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.restaurants.getNearRestaurantsByPage(address),
    });
  }

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
    queryClient: QueryClient,
    address: Address | undefined
  ) {
    //invalidate restaurant queries that depend on address so if there is no address the user cannot get it from db
    if (data.address) {
      this.invalidateRestaurantSearchQueries(queryClient, address);
      this.invalidateGetNearRestaurantsByPage(queryClient, address);
    }
    this.updateGetSingleRestaurantById(queryClient, data);
    this.updateGetOwnerRestaurants(queryClient, data);
  }
}

export const updateRestaurantCache = new UpdateRestaurantCache();
