import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { restaurantService } from "../services/restaurantService";
import queryKeys from "../utils/queryKeys";
import RestaurantHeaderImg from "../components/RestaurantArea/RestaurantHeaderImg";
import useUserInfo from "../hooks/useUserInfo";
import { Role } from "../models/User";
import ProtectedComp from "../components/ProtectedComponent.tsx/ProtectedComp";
import UpdateFormsToShow from "../components/RestaurantArea/OwnerOnly/UpdateRestaurant/UpdateOptions/UpdateFormsToShow";
import MenuItemCardList from "../components/MenuItemArea/UserOnly/MenuItemCardList";
//might add react lazy
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

      <ProtectedComp condition={user?.role === Role.owner}>
        {/* {data && <UpdateRestaurant data={data} />} */}
        {data && <UpdateFormsToShow data={data} />}
      </ProtectedComp>

      <ProtectedComp condition={!user || user?.role === Role.user}>
        {data && (
          <>
            <RestaurantHeaderImg restaurant={data} />
            <MenuItemCardList restaurantId={data?.id} />
          </>
        )}
      </ProtectedComp>
    </>
  );
};

export default RestaurantPage;
