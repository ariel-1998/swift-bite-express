import React from "react";
import AuthForm from "../AuthArea/AuthForm";
import Input from "../Customs/Input";
import { useMutation } from "@tanstack/react-query";
import { restaurantService } from "../../services/restaurantService";
import Button from "../Customs/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RestaurantSchema, restaurantSchema } from "../../models/Restaurant";

const CreateRestaurant: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantSchema>({ resolver: zodResolver(restaurantSchema) });

  const mutatation = useMutation({
    mutationFn: restaurantService.createRestaurant,
    onSuccess(data) {
      //need to update query cache
    },
  });

  const submitForm = (data: RestaurantSchema) => {
    mutatation.mutate(data);
  };

  return (
    <AuthForm title="Create Restaurant" onSubmit={handleSubmit(submitForm)}>
      <Input
        label="Restaurant Name:"
        type="text"
        placeholder="Restaurant Name..."
        errMessage={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Restaurant Image:"
        type="file"
        accept="image/*"
        errMessage={errors.image?.message}
        {...register("image")}
      />
      <Input
        label="Restaurant Logo:"
        type="file"
        accept="image/*"
        errMessage={errors.logoImage?.message}
        {...register("logoImage")}
      />

      <Button
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={mutatation.isPending}
      >
        Sign In
      </Button>
    </AuthForm>
  );
};

export default CreateRestaurant;
