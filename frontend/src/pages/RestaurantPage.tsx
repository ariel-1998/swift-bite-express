import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { restaurantService } from "../services/restaurantService";
import RestaurantCard from "../components/RestaurantArea/RestaurantCard";
import queryKeys from "../utils/queryKeys";

const RestaurantPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.restaurants.getSingleRestaurantById(+restaurantId!),
    queryFn: () => restaurantService.getSingleRestaurantById(+restaurantId!),
    enabled: !!restaurantId,
  });

  return (
    <>
      {data && <RestaurantCard restaurant={data} />}
      {isLoading && "loading..."}
      {isError && "error"}
    </>
  );
};

export default RestaurantPage;
