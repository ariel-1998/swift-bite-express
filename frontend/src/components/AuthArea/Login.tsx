import React from "react";
import AuthForm from "./UserAddressForm";
import Button from "../Customs/Button";
import Input from "../Customs/Input";
import { Link, useNavigate } from "react-router-dom";
import AuthProviderBtn from "./AuthProviderBtn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCredentials, userLoginFormSchema } from "../../models/User";
import { authService } from "../../services/authService";
import ProviderParamError from "./ProviderParamError";
import { useMutation } from "@tanstack/react-query";
import useUserInfo from "../../hooks/useUserInfo";

const Login: React.FC = () => {
  const { setUser } = useUserInfo();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserCredentials>({ resolver: zodResolver(userLoginFormSchema) });

  const mutatation = useMutation({
    mutationFn: authService.localLogin,
    onSuccess: (data) => {
      setUser(data);
      navigate("/");
    },
  });

  const submitLogin = async (data: UserCredentials) => {
    mutatation.mutate(data);
  };

  return (
    <AuthForm onSubmit={handleSubmit(submitLogin)} title="Sign In">
      <ProviderParamError />
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
      <Button
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={mutatation.isPending}
      >
        Sign In
      </Button>
      <hr />
      <div className="flex flex-col gap-1">
        <AuthProviderBtn provider="Google" auth="login" />
        <AuthProviderBtn provider="Facebook" auth="login" />
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
