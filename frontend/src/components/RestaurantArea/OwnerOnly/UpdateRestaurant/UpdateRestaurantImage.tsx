import React, { FormEvent, useRef } from "react";
import {
  NestedRestaurantAndAddress,
  updateRestaurantSchema,
} from "../../../../models/Restaurant";
import { ZodError } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "../../../../services/restaurantService";
import Input from "../../../Customs/Input";
import Button from "../../../Customs/Button";
import { updateRestaurantCache } from "../../../../utils/queryCacheUpdates/updateRestaurantCache";
import { useNavigate } from "react-router-dom";
import UpdateForm from "../UpdateForm";
import { toastifyService } from "../../../../services/toastifyService";

type UpdateRestaurantImageProps = {
  restaurant: NestedRestaurantAndAddress;
};

const UpdateRestaurantImage: React.FC<UpdateRestaurantImageProps> = ({
  restaurant,
}) => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: restaurantService.updateRestaurant,
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
    const image = imageRef.current?.files;
    try {
      updateRestaurantSchema
        .pick({ image: true })
        .refine(({ image }) => image[0], "Image was not selected")
        .parse({ image });
      mutation.mutate({ restaurantId: restaurant.id, image: image! });
    } catch (error) {
      toastifyService.error(error as Error);
    }
  };
  return (
    <UpdateForm onSubmit={submitUpdate}>
      <Input label="Restaurant Image:" type="file" ref={imageRef} />
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

export default UpdateRestaurantImage;
