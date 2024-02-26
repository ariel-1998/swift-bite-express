import React from "react";
import { restaurantService } from "../../services/restaurantService";
import { CONSTANTS } from "../../utils/constants";
import RestaurantCard from "./RestaurantCard";
import useUserInfo from "../../hooks/useUserInfo";
import queryKeys from "../../utils/queryKeys";
import useScrollFetch from "../../hooks/useScrollFetch";
import { NestedRestaurantAndAddress } from "../../models/Restaurant";

const RestaurantCardList: React.FC = () => {
  const { address } = useUserInfo();
  const {
    dataObj: { data, isLoading, isError },
    observer,
  } = useScrollFetch<NestedRestaurantAndAddress>({
    queryKey: queryKeys.restaurants.getNearRestaurantsByPage(address),
    pageLimit: CONSTANTS.RESTAURANTS_PAGE_LIMIT,
    enabled: true,
    queryFn: ({ pageParam }) =>
      restaurantService.getNearRestaurantsByPage(pageParam, {
        latitude: address?.latitude,
        longitude: address?.longitude,
      }),
  });

  return (
    <div className="flex flex-wrap gap-4 p-2 justify-center">
      {isLoading && "loading"}
      {isError && "error"}
      {data?.pages.map((page) =>
        page.map((restaurant, i) => {
          if (page.length === i + 1) {
            return (
              <RestaurantCard
                navigateOnClick={`/restaurants/${restaurant.id}`}
                restaurant={restaurant}
                key={restaurant.id}
                ref={observer}
              />
            );
          }
          return (
            <RestaurantCard
              navigateOnClick={`/restaurants/${restaurant.id}`}
              restaurant={restaurant}
              key={restaurant.id}
            />
          );
        })
      )}
    </div>
  );
};

export default RestaurantCardList;
