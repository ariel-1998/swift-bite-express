import React from "react";
import RestaurantCard from "./RestaurantCard";
import useOwnerRestaurants from "../../hooks/useOwnerRestaurants";

const OwnerRestaurantList: React.FC = () => {
  const { data, isLoading, isError } = useOwnerRestaurants();

  return (
    <div className="flex flex-wrap gap-4 p-2 justify-center">
      {isLoading && "loading..."}
      {isError && "error"}
      {data &&
        data.map((restaurant) => (
          <RestaurantCard
            restaurant={restaurant}
            key={restaurant.id}
            navigateOnClick={`/restaurants/${restaurant.id}`}
          />
        ))}
    </div>
  );
};

export default OwnerRestaurantList;
