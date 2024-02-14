import React, { useEffect } from "react";
import useUserInfo from "../../hooks/useUserInfo";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";

const Logout: React.FC = () => {
  const { logout } = useUserInfo();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: onSuccessLogout,
    onError: (error) => console.log(error),
  });

  function onSuccessLogout() {
    logout();
    navigate("/auth/login");
  }

  useEffect(() => {
    mutation.mutate();
  }, [mutation]);

  return null;
};

export default Logout;
