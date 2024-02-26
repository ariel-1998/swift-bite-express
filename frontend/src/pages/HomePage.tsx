import React from "react";
import RestaurantCardList from "../components/RestaurantArea/RestaurantCardList";
import useUserInfo from "../hooks/useUserInfo";
import { Role } from "../models/User";
import OwnerRestaurantList from "../components/RestaurantArea/OwnerRestaurantList";

//need to implement lazy from react to render components
const HomePage: React.FC = () => {
  const { user } = useUserInfo();

  return (
    <>
      {(!user || user?.role === Role.user) && <RestaurantCardList />}
      {user?.role === Role.owner && <OwnerRestaurantList />}
    </>
  );
};

export default HomePage;
