import React, { FormEvent, useRef } from "react";
import {
  NestedRestaurantAndAddress,
  updateRestaurantSchema,
} from "../../../models/Restaurant";
import { ZodError } from "zod";
import { useMutation } from "@tanstack/react-query";
import { restaurantService } from "../../../services/restaurantService";
import Input from "../../Customs/Input";
import Button from "../../Customs/Button";

type UpdateRestaurantImageProps = {
  restaurant: NestedRestaurantAndAddress;
};

const UpdateRestaurantImage: React.FC<UpdateRestaurantImageProps> = ({
  restaurant,
}) => {
  const imageRef = useRef<HTMLInputElement | null>(null);

  const mutation = useMutation({
    mutationFn: restaurantService.updateRestaurant,
    //onSuccess: update restaurant queries
    onSuccess(data) {
      //update owner restaurants query data
      //and update single restaurant query data
      //if there is address in the restaurant then invalidate restaurants data and search data
      console.log(data);
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
      if (error instanceof ZodError) {
        const messageArray = error.issues.map((e) => e.message);
        console.log(messageArray);
      }
    }
  };
  return (
    <form onSubmit={submitUpdate}>
      <Input label="Restaurant Logo:" type="file" ref={imageRef} />
      <Button
        type="submit"
        size={"formBtn"}
        variant={"primary"}
        disabled={mutation.isPending}
      >
        Sign In
      </Button>
    </form>
  );
};

export default UpdateRestaurantImage;
