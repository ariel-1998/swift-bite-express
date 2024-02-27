import React, { FormEvent, useRef } from "react";
import {
  NestedRestaurantAndAddress,
  updateRestaurantSchema,
} from "../../../../models/Restaurant";
import Input from "../../../Customs/Input";
import Button from "../../../Customs/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "../../../../services/restaurantService";
import { ZodError } from "zod";
import { updateRestaurantCache } from "../../../../utils/cacheUpdates";
import { useNavigate } from "react-router-dom";

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
      navigate("/restaurants/owner");
    },
  });

  const submitUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    try {
      updateRestaurantSchema.pick({ name: true }).parse({ name });
    } catch (error) {
      if (error instanceof ZodError) {
        const messageArray = error.issues.map((e) => e.message);
        console.log(messageArray);
      }
    }
    mutation.mutate({ restaurantId: restaurant.id, name });
  };

  return (
    <form onSubmit={submitUpdate} className="flex flex-col gap-3 p-10">
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
    </form>
  );
};

export default UpdateRestaurantName;
