import React from "react";
import Header from "../components/Layout/Header/Header";
import CreateRestaurant from "../components/RestaurantArea/CreateRestaurant";
import RestaurantCardList from "../components/RestaurantArea/RestaurantCardList";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <CreateRestaurant />
      <RestaurantCardList />
    </>
  );
};

export default HomePage;
