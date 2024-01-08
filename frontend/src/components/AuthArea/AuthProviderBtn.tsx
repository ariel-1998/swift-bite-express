import React from "react";
import Button from "../Customs/Button";
import { Provider, authService } from "../../services/authService";

type AuthProviderBtnProps = {
  provider: Provider;
};

const AuthProviderBtn: React.FC<AuthProviderBtnProps> = ({ provider }) => {
  const providerSignup = async () => {
    window.open(authService.providerAuth(provider), "_blank");
  };
  return (
    <Button size={"formBtn"} onClick={providerSignup}>
      Sign In with {provider}
    </Button>
  );
};

export default AuthProviderBtn;
