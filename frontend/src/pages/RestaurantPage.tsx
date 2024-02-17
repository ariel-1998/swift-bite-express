import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { restaurantService } from "../services/restaurantService";
import queryKeys from "../utils/queryKeys";
import RestaurantHeaderImg from "../components/RestaurantArea/RestaurantHeaderImg";

const RestaurantPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.restaurants.getSingleRestaurantById(+restaurantId!),
    queryFn: () => restaurantService.getSingleRestaurantById(+restaurantId!),
    enabled: !!restaurantId,
  });

  return (
    <>
      {isLoading && "loading..."}
      {isError && "error"}
      {data && <RestaurantHeaderImg restaurant={data} />}
    </>
  );
};

export default RestaurantPage;
