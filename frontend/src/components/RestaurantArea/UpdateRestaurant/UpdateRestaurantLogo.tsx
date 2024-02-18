import React, { FormEvent, useRef } from "react";
import {
  NestedRestaurantAndAddress,
  updateRestaurantSchema,
} from "../../../models/Restaurant";
import Button from "../../Customs/Button";
import Input from "../../Customs/Input";
import { useMutation } from "@tanstack/react-query";
import { restaurantService } from "../../../services/restaurantService";
import { ZodError } from "zod";

type UpdateRestaurantLogoProps = {
  restaurant: NestedRestaurantAndAddress;
};

const UpdateRestaurantLogo: React.FC<UpdateRestaurantLogoProps> = ({
  restaurant,
}) => {
  const logoRef = useRef<HTMLInputElement | null>(null);

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
    <form onSubmit={submitUpdate}>
      <Input label="Restaurant Logo:" type="file" ref={logoRef} />
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

export default UpdateRestaurantLogo;
