import React, { FormEvent, useRef } from "react";
import {
  NestedRestaurantAndAddress,
  updateRestaurantSchema,
} from "../../../../models/Restaurant";
import Button from "../../../Customs/Button";
import Input from "../../../Customs/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "../../../../services/restaurantService";
import { updateRestaurantCache } from "../../../../utils/queryCacheUpdates/updateRestaurantCache";
import { useNavigate } from "react-router-dom";
import UpdateForm from "../UpdateForm";
import { toastifyService } from "../../../../services/toastifyService";

type UpdateRestaurantLogoProps = {
  restaurant: NestedRestaurantAndAddress;
};

const UpdateRestaurantLogo: React.FC<UpdateRestaurantLogoProps> = ({
  restaurant,
}) => {
  const logoRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: restaurantService.updateRestaurant,
    //onSuccess: update restaurant queries
    onSuccess(data) {
      updateRestaurantCache.updateSingleRestaurantInCache(data, queryClient);
      navigate("/");
    },
    onError(error) {
      console.log(error);
    },
  });

  const submitUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const logoImage = logoRef.current?.files;
    try {
      updateRestaurantSchema
        .pick({ logoImage: true })
        .refine(({ logoImage }) => logoImage?.[0], "Logo was not selected")
        .parse({ logoImage });
      mutation.mutate({ restaurantId: restaurant.id, logoImage: logoImage! });
    } catch (error) {
      toastifyService.error(error as Error);
    }
  };
  return (
    <UpdateForm onSubmit={submitUpdate} formTitle="Update restaurant logo">
      <Input label="Restaurant Logo:" type="file" ref={logoRef} />
      <Button
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={mutation.isPending}
      >
        Update
      </Button>
    </UpdateForm>
  );
};

export default UpdateRestaurantLogo;
