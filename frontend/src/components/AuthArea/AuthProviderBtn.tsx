import React from "react";
import Button from "../Customs/Button";

type Provider = "Google" | "Facebook";

type AuthProviderBtnProps = {
  provider: Provider;
};

const AuthProviderBtn: React.FC<AuthProviderBtnProps> = ({ provider }) => {
  const providerSignup = async () => {
    window.open(
      `http://localhost:3000/auth/${provider.toLowerCase()}`,
      "_blank"
    );
  };
  return (
    <Button size={"formBtn"} onClick={providerSignup}>
      Sign In with {provider}
    </Button>
  );
};

export default AuthProviderBtn;
