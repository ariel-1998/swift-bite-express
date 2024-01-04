import React from "react";
import AuthForm from "./AuthForm";
import Button from "../Customs/Button";
import Input from "../Customs/Input";
import { Link } from "react-router-dom";
import AuthProviderBtn from "./AuthProviderBtn";

const Register: React.FC = () => {
  return (
    <AuthForm title="Sign Up">
      <Input placeholder="Email..." />
      <Input placeholder="Password..." />
      <Input placeholder="Confirm Password..." />
      <Button size={"formBtn"} variant={"primary"}>
        Sign Up
      </Button>
      <hr />
      <div className="flex flex-col gap-1">
        <AuthProviderBtn provider="Google" />
        <AuthProviderBtn provider="Facebook" />
      </div>
      <div className="flex flex-col items-center">
        Already have an account?
        <Link to={"/auth/login"} className="text-blue-500">
          Sign In
        </Link>
      </div>
    </AuthForm>
  );
};

export default Register;
