import React from "react";
import CreateRestaurant from "../components/RestaurantArea/CreateRestaurant";
import RestaurantCardList from "../components/RestaurantArea/RestaurantCardList";

const HomePage: React.FC = () => {
  return (
    <>
      {/* <CreateRestaurant /> */}
      <RestaurantCardList />
    </>
  );
};

export default HomePage;
