import React from "react";
import AuthForm from "./AuthForm";
import Button from "../Customs/Button";
import Input from "../Customs/Input";
import { Link } from "react-router-dom";
import AuthProviderBtn from "./AuthProviderBtn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCredentials, userLoginFormSchema } from "../../models/User";
import { authService } from "../../services/authService";

const Login: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserCredentials>({ resolver: zodResolver(userLoginFormSchema) });

  const submitLogin = async (data: UserCredentials) => {
    console.log(data);
    await authService.localLogin(data);
  };

  return (
    <AuthForm onSubmit={handleSubmit(submitLogin)} title="Sign In">
      <Input
        label="Email:"
        errMessage={errors.email?.message}
        type="text"
        placeholder="Email..."
        {...register("email")}
      />
      <Input
        label="Password:"
        errMessage={errors.password?.message}
        type="password"
        placeholder="Password..."
        {...register("password")}
      />
      <Button type="submit" size={"formBtn"} variant={"primary"}>
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
