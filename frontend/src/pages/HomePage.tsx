import React from "react";
import useUserInfo from "../hooks/useUserInfo";
import AuthedHome from "../components/Home/AuthedHome";
import GuestHome from "../components/Home/GuestHome";

const HomePage: React.FC = () => {
  const { user } = useUserInfo();
  return user ? <AuthedHome user={user} /> : <GuestHome />;
};

export default HomePage;
