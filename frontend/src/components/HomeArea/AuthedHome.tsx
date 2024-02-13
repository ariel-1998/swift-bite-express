import React from "react";
import { User } from "../../models/User";
import Header from "../Layout/Header/Header";
import CreateRestaurant from "../RestaurantArea/CreateRestaurant";
type AuthedHomeProps = {
  user: User;
};

const AuthedHome: React.FC<AuthedHomeProps> = ({ user }) => {
  return (
    <>
      <Header />
      <CreateRestaurant />
    </>
  );
  // return <div>Hello {user.fullName}</div>;
};

export default AuthedHome;
