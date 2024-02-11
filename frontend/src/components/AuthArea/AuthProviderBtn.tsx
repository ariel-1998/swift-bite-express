import React from "react";
import Button from "../Customs/Button";
import { Auth, Provider, authService } from "../../services/authService";

type AuthProviderBtnProps = {
  provider: Provider;
  auth: Auth;
};

const AuthProviderBtn: React.FC<AuthProviderBtnProps> = ({ provider }) => {
  const providerSignup = async () => {
    window.open(authService.providerAuth(provider), "_self");
  };
  return (
    <Button type="button" size={"formBtn"} onClick={providerSignup}>
      Sign In with {provider}
    </Button>
  );
};

export default AuthProviderBtn;
