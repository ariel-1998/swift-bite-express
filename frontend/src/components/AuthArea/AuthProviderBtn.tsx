import React from "react";
import Button from "../Customs/Button";
import { Provider, authService } from "../../services/authService";

type AuthProviderBtnProps = {
  provider: Provider;
};

const AuthProviderBtn: React.FC<AuthProviderBtnProps> = ({ provider }) => {
  const providerSignup = async () => {
    const path = authService.providerAuth(provider);
    window.open(path, "_self");
  };
  return (
    <Button type="button" size={"formBtn"} onClick={providerSignup}>
      Sign In with {provider}
    </Button>
  );
};

export default AuthProviderBtn;
