import React from "react";
import { User } from "../../models/User";

type AuthedHomeProps = {
  user: User;
};

const AuthedHome: React.FC<AuthedHomeProps> = ({ user }) => {
  return <div>Hello {user.fullName}</div>;
};

export default AuthedHome;
