import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { restaurantService } from "../services/restaurantService";
import queryKeys from "../utils/queryKeys";
import RestaurantHeaderImg from "../components/RestaurantArea/RestaurantHeaderImg";
import UpdateRestaurant from "../components/RestaurantArea/UpdateRestaurant/UpdateRestaurant";
import useUserInfo from "../hooks/useUserInfo";
import { Role } from "../models/User";

const RestaurantPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { user } = useUserInfo();
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.restaurants.getSingleRestaurantById(+restaurantId!),
    queryFn: () => restaurantService.getSingleRestaurantById(+restaurantId!),
    enabled: !!restaurantId,
  });

  return (
    <>
      {isLoading && "loading..."}
      {isError && "error"}
      {data && user?.role === Role.owner ? (
        <UpdateRestaurant data={data} />
      ) : (
        data && <RestaurantHeaderImg restaurant={data} />
      )}
    </>
  );
};

export default RestaurantPage;
