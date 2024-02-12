import React from "react";
import useUserInfo from "../hooks/useUserInfo";
import AuthedHome from "../components/HomeArea/AuthedHome";
import GuestHome from "../components/HomeArea/GuestHome";

const HomePage: React.FC = () => {
  const { user } = useUserInfo();
  return user ? <AuthedHome user={user} /> : <GuestHome />;
};

export default HomePage;
