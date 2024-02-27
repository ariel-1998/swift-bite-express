import React from "react";
import { Restaurant } from "../../../models/Restaurant";
import RestaurantSearchResultCard from "./RestaurantSearchResultCard";

type RestaurantSearchListProps = {
  data: Restaurant[];
  observer?: (node: HTMLAnchorElement) => void;
};

const RestaurantSearchList: React.FC<RestaurantSearchListProps> = ({
  data,
  observer,
}) => {
  return (
    <>
      {data.map((restaurant, i) => {
        if (data.length === i + 1 && observer) {
          return (
            <RestaurantSearchResultCard
              restaurant={restaurant}
              key={restaurant.id}
              ref={observer}
            />
          );
        }
        return (
          <RestaurantSearchResultCard
            restaurant={restaurant}
            key={restaurant.id}
          />
        );
      })}
    </>
  );
};

export default RestaurantSearchList;
