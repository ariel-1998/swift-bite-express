import React, { useMemo, useState } from "react";
import RestaurantCard from "../RestaurantCard";
import useOwnerRestaurants from "../../../hooks/useOwnerRestaurants";
import Input from "../../Customs/Input";

const OwnerRestaurantList: React.FC = () => {
  const { data, isLoading, isError } = useOwnerRestaurants();
  const [search, setSearch] = useState("");
  const filteredData = useMemo(() => {
    return data?.filter((rest) => rest.name.includes(search));
  }, [data, search]);

  return (
    <div className="p-2">
      <h2 className="text-center font-extrabold text-xl">My Restaurants</h2>
      <Input
        className="max-w-80 block m-auto mt-2 text-center"
        placeholder="Filter My Restaurants"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-wrap gap-4 p-2 justify-center">
        {isLoading && "loading..."}
        {isError && "error"}
        {filteredData &&
          filteredData.map((restaurant) => (
            <RestaurantCard
              restaurant={restaurant}
              key={restaurant.id}
              navigateOnClick={`/restaurants/${restaurant.id}`}
            />
          ))}
      </div>
    </div>
  );
};

export default OwnerRestaurantList;
