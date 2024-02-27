import React, { FormEvent, useRef, useState } from "react";
import AuthForm from "../AuthArea/AuthForm";
import Input from "../Customs/Input";
import useUserInfo from "../../hooks/useUserInfo";
import { Role } from "../../models/User";
import { useMutation } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import useOwnerRestaurants from "../../hooks/useOwnerRestaurants";
import ProtectedComp from "../ProtectedComponent.tsx/ProtectedComp";
import Button from "../Customs/Button";
import { FaArrowRotateRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toastifyService } from "../../services/toastifyService";

const UpdateRole: React.FC = () => {
  const { user, setUser } = useUserInfo();
  const { data } = useOwnerRestaurants();
  const navigate = useNavigate();
  const [randomNum, setRandomNum] = useState(generateRandomNum());
  const randomNumRef = useRef<HTMLInputElement | null>(null);
  const checkboxRef = useRef<HTMLInputElement | null>(null);
  const title =
    (user?.role === Role.user && "Switch to Owner Membership") ||
    (user?.role === Role.owner && "Revert to User Membership") ||
    "";
  const { mutate } = useMutation({
    mutationFn: userService.updateRole,
    onSuccess: () => {
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          role: prev.role === Role.user ? Role.owner : Role.user,
        };
      });
      navigate("/");
    },
  });

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    const inputNum = randomNumRef.current;
    const checkbox = checkboxRef.current;
    if (!inputNum || !checkbox) return;

    if (data?.length)
      return toastifyService.error({
        message: "Cannot Revert to user membership while owning restaurants",
      });

    if (!checkbox.checked) {
      return toastifyService.error({ message: "Select checkbox to confirm" });
    }

    if (inputNum.value === randomNum.join("")) {
      return toastifyService.error({
        message: "Incorrect number. Please try again.",
      });
    }

    let updatedRole: Role | undefined = undefined;
    if (user?.role === Role.user) updatedRole = Role.owner;
    if (user?.role === Role.owner) updatedRole = Role.user;
    if (!updatedRole) {
      return toastifyService.error({
        message: "This account cannot update role",
      });
    }
    mutate(updatedRole);
  };

  const changeRandomNum = () => setRandomNum(generateRandomNum());
  function generateRandomNum() {
    return Array.from({ length: 5 }, () => Math.ceil(Math.random() * 9));
  }
  return (
    <AuthForm onSubmit={submitForm} title={`${title}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center text-error text-center ">
          <span className="font-bold">NOTE:</span>
          <ProtectedComp condition={user?.role === Role.user}>
            <span>
              Switching to Owner membership means you will not be able to order
              from this account anymore
            </span>
          </ProtectedComp>
          <ProtectedComp condition={user?.role === Role.owner}>
            <span>
              Switching to User membership means you will not be able to own
              restaurants anymore
            </span>
          </ProtectedComp>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={changeRandomNum}
          >
            <FaArrowRotateRight />
          </Button>
          <span>{randomNum}</span>
        </div>
        <Input type="text" placeholder="Type the above" ref={randomNumRef} />
        <div className="flex flex-row gap-1 items-center">
          <Input type="checkbox" ref={checkboxRef} />
          <label>{title}</label>
        </div>
        <Button size={"formBtn"} variant={"primary"}>
          Submit
        </Button>
      </div>
    </AuthForm>
  );
};

export default UpdateRole;
