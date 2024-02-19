import React, { FormEvent, useRef } from "react";
import {
  NestedRestaurantAndAddress,
  updateRestaurantSchema,
} from "../../../models/Restaurant";
import Button from "../../Customs/Button";
import Input from "../../Customs/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "../../../services/restaurantService";
import { ZodError } from "zod";
import { updateRestaurantCache } from "../../../utils/cacheUpdates";
import useUserInfo from "../../../hooks/useUserInfo";
import { useNavigate } from "react-router-dom";

type UpdateRestaurantLogoProps = {
  restaurant: NestedRestaurantAndAddress;
};

const UpdateRestaurantLogo: React.FC<UpdateRestaurantLogoProps> = ({
  restaurant,
}) => {
  const logoRef = useRef<HTMLInputElement | null>(null);
  const { address } = useUserInfo();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: restaurantService.updateRestaurant,
    //onSuccess: update restaurant queries
    onSuccess(data) {
      updateRestaurantCache.updateSingleRestaurantInCache(
        data,
        queryClient,
        address
      );
      navigate("/restaurants/owner");
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
        .refine(({ logoImage }) => logoImage[0], "Logo was not selected")
        .parse({ logoImage });
      mutation.mutate({ restaurantId: restaurant.id, logoImage: logoImage! });
    } catch (error) {
      if (error instanceof ZodError) {
        const messageArray = error.issues.map((e) => e.message);
        console.log(messageArray);
      }
    }
  };
  return (
    <form onSubmit={submitUpdate} className="flex flex-col gap-3 p-10">
      <Input label="Restaurant Logo:" type="file" ref={logoRef} />
      <Button
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={mutation.isPending}
      >
        Update
      </Button>
    </form>
  );
};

export default UpdateRestaurantLogo;
