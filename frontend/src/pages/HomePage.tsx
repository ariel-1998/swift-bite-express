import React from "react";
import RestaurantCardList from "../components/RestaurantArea/RestaurantCardList";
import useUserInfo from "../hooks/useUserInfo";
import { Role } from "../models/User";
import OwnerRestaurantList from "../components/RestaurantArea/OwnerOnly/OwnerRestaurantList";
import ProtectedComp from "../components/ProtectedComponent.tsx/ProtectedComp";

//need to implement lazy from react to render components
const HomePage: React.FC = () => {
  const { user } = useUserInfo();

  return (
    <>
      <ProtectedComp condition={!user || user?.role === Role.user}>
        <RestaurantCardList />
      </ProtectedComp>

      <ProtectedComp condition={user?.role === Role.owner}>
        <OwnerRestaurantList />
      </ProtectedComp>
    </>
  );
};

export default HomePage;
