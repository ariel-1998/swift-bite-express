import React from "react";
import { NestedRestaurantAndAddress } from "../../models/Restaurant";
import { AddressFormData } from "../../models/Address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addressSchema } from "../../models/Address";
import { useMutation } from "@tanstack/react-query";
import { addressService } from "../../services/addressService";
import Input from "../Customs/Input";
import Button from "../Customs/Button";

type RestaurantAddressFormProps = {
  restaurant?: NestedRestaurantAndAddress;
  restaurantId?: number | null;
};

const RestaurantAddressForm: React.FC<RestaurantAddressFormProps> = ({
  restaurant,
  restaurantId = null,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Omit<AddressFormData, "entrance" | "apartment">>({
    resolver: zodResolver(
      addressSchema.omit({ entrance: true, apartment: true })
    ),
  });

  const mutation = useMutation({
    mutationFn: restaurant
      ? addressService.updateAddress
      : addressService.postAddress,
    onSuccess: (data) => {
      //update restaurants caches
      console.log(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const submitAddress = (data: AddressFormData) => {
    mutation.mutate({
      address: data,
      restaurantId,
    });
    //if no user that means he inputs his own address so save it in the local storage
  };

  return (
    <form onSubmit={handleSubmit(submitAddress)}>
      <Input
        label="Country:"
        errMessage={errors.country?.message}
        type="text"
        placeholder="Country..."
        {...register("country")}
        defaultValue={restaurant?.address?.country}
      />
      <Input
        label="State:"
        errMessage={errors.state?.message}
        type="text"
        placeholder="State..."
        {...register("state")}
        defaultValue={restaurant?.address?.state}
      />
      <Input
        label="City:"
        errMessage={errors.city?.message}
        type="text"
        placeholder="City..."
        {...register("city")}
        defaultValue={restaurant?.address?.city}
      />
      <Input
        label="Street:"
        errMessage={errors.street?.message}
        type="text"
        placeholder="Street..."
        {...register("street")}
        defaultValue={restaurant?.address?.street}
      />
      <Input
        label="Building:"
        errMessage={errors.building?.message}
        type="number"
        placeholder="Building..."
        {...register("building")}
        defaultValue={restaurant?.address?.building}
      />

      <Button type="submit" size={"formBtn"} variant={"primary"}>
        Update
      </Button>
    </form>
  );
};

export default RestaurantAddressForm;
