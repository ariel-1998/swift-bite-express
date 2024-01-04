import React from "react";
import AuthForm from "./AuthForm";
import Button from "../Customs/Button";
import Input from "../Customs/Input";
import { Link } from "react-router-dom";
import AuthProviderBtn from "./AuthProviderBtn";

const Login: React.FC = () => {
  return (
    <AuthForm title="Sign In">
      <Input placeholder="Email..." />
      <Input placeholder="Password..." />
      <Button size={"formBtn"} variant={"primary"}>
        Sign In
      </Button>
      <hr />
      <div className="flex flex-col gap-1">
        <AuthProviderBtn provider="Google" />
        <AuthProviderBtn provider="Facebook" />
      </div>
      <div className="flex flex-col items-center">
        Don't have an account?
        <Link to={"/auth/register"} className="text-blue-500">
          Sign Up
        </Link>
      </div>
    </AuthForm>
  );
};

export default Login;
