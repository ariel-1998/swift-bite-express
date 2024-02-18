import { useQuery } from "@tanstack/react-query";
import React from "react";
import queryKeys from "../../utils/queryKeys";
import { restaurantService } from "../../services/restaurantService";
import RestaurantCard from "./RestaurantCard";
import useOwnerRestaurants from "../../hooks/useOwnerRestaurants";

const OwnerRestaurantList: React.FC = () => {
  const { data, isLoading, isError } = useOwnerRestaurants();

  return (
    <div className="flex flex-wrap gap-4 p-2 ">
      {isLoading && "loading..."}
      {isError && "error"}
      {data &&
        data.map((restaurant) => (
          <RestaurantCard
            restaurant={restaurant}
            key={restaurant.id}
            navigateOnClick={`/restaurants/owner/${restaurant.id}`}
          />
        ))}
    </div>
  );
};

export default OwnerRestaurantList;
