import React from "react";
import AuthForm from "./AuthForm";
import Button from "../Customs/Button";
import Input from "../Customs/Input";
import { Link, useNavigate } from "react-router-dom";
import AuthProviderBtn from "./AuthProviderBtn";
import { authService } from "../../services/authService";
import { UserRegisterForm, userRegisterFormSchema } from "../../models/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useUserInfo from "../../hooks/useUserInfo";
import ProviderParamError from "./ProviderParamError";

const Register: React.FC = () => {
  const { setUser } = useUserInfo();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserRegisterForm>({
    resolver: zodResolver(userRegisterFormSchema),
  });

  const submitRegistration = async ({
    email,
    password,
    fullName,
  }: UserRegisterForm) => {
    try {
      const user = await authService.localRegistration({
        email,
        fullName,
        password,
      });
      setUser(user);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthForm title="Sign Up" onSubmit={handleSubmit(submitRegistration)}>
      <ProviderParamError />
      <Input
        label="Email:"
        errMessage={errors.email?.message}
        type={"text"}
        placeholder="Email..."
        {...register("email")}
      />
      <Input
        label="Full Name:"
        errMessage={errors.fullName?.message}
        type={"text"}
        placeholder="Full Name..."
        {...register("fullName")}
      />
      <Input
        label="Password:"
        errMessage={errors.password?.message}
        type={"password"}
        placeholder="Password..."
        {...register("password")}
      />
      <Input
        label="Confirm Password:"
        errMessage={errors.confirmPassword?.message}
        type={"password"}
        placeholder="Confirm Password..."
        {...register("confirmPassword")}
      />
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
