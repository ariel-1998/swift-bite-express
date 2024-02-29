import React from "react";
import AuthForm from "../../AuthArea/AuthForm";
import Input from "../../Customs/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "../../../services/restaurantService";
import Button from "../../Customs/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RestaurantSchema, restaurantSchema } from "../../../models/Restaurant";
import { updateRestaurantCache } from "../../../utils/queryCacheUpdates/updateRestaurantCache";
import { useNavigate } from "react-router-dom";

const CreateRestaurant: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RestaurantSchema>({ resolver: zodResolver(restaurantSchema) });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutatation = useMutation({
    mutationFn: restaurantService.createRestaurant,
    onSuccess(data) {
      updateRestaurantCache.updateSingleRestaurantInCache(data, queryClient);

      navigate(`/restaurants/${data.id}?activeForm=address`);
      //no need to update query cache for restaurants as there is no address in it and all the query caches are with addresses
      //need to navigate to update restaurant address page "restaurant/owner/:restaurantId"
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
