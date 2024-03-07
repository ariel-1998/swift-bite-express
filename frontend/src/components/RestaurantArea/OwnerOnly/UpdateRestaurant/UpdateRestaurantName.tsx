import React, { FormEvent, useRef } from "react";
import {
  NestedRestaurantAndAddress,
  updateRestaurantSchema,
} from "../../../../models/Restaurant";
import Input from "../../../Customs/Input";
import Button from "../../../Customs/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "../../../../services/restaurantService";
import { updateRestaurantCache } from "../../../../utils/queryCacheUpdates/updateRestaurantCache";
import { useNavigate } from "react-router-dom";
import UpdateForm from "../UpdateForm";
import { toastifyService } from "../../../../services/toastifyService";

type UpdateRestaurantNameProps = {
  restaurant: NestedRestaurantAndAddress;
};

const UpdateRestaurantName: React.FC<UpdateRestaurantNameProps> = ({
  restaurant,
}) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: restaurantService.updateRestaurant,
    onSuccess(data) {
      updateRestaurantCache.updateSingleRestaurantInCache(data, queryClient);
      navigate("/");
    },
  });

  const submitUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    try {
      updateRestaurantSchema.pick({ name: true }).parse({ name });
    } catch (error) {
      toastifyService.error(error as Error);
    }
    mutation.mutate({ restaurantId: restaurant.id, name });
  };

  return (
    <UpdateForm onSubmit={submitUpdate} formTitle="Update restaurant name">
      <Input label="Restaurant Name:" type="text" ref={nameRef} />
      <Button
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={mutation.isPending}
        defaultValue={restaurant.name}
      >
        Update Name
      </Button>
    </UpdateForm>
  );
};

export default UpdateRestaurantName;
