import React from "react";
import { useForm } from "react-hook-form";
import { Address, AddressFormData, addressSchema } from "../../models/Address";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthForm from "../AuthArea/AuthForm";
import Input from "../Customs/Input";
import Button from "../Customs/Button";
import { useMutation } from "@tanstack/react-query";
import { AddressReq, addressService } from "../../services/addressService";
import useUserInfo from "../../hooks/useUserInfo";

type AddressFormProps = {
  address?: Address;
  title: string;
  fn: (address: AddressReq) => Promise<Address>;
  restaurantId: number | null;
  onSuccess?: () => void;
};

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  title,
  fn,
  restaurantId,
  onSuccess = () => undefined,
}) => {
  const { user, setAddress } = useUserInfo();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AddressFormData>({ resolver: zodResolver(addressSchema) });

  const mutation = useMutation({
    mutationFn: fn,
    onSuccess,
  });
  const converAddressMut = useMutation({
    mutationFn: addressService.convertAddressToCoords,
    onSuccess(data) {
      // save the address in local storage and update address
      localStorage.setItem("address", JSON.stringify(data));
      setAddress(data);
      onSuccess();
    },
    onError: (error) => console.log(error),
  });

  const submitAddress = (data: AddressFormData) => {
    if (user) return mutation.mutate({ address: data, restaurantId });
    //if no user that means he inputs his own address so save it in the local storage
    converAddressMut.mutate(data);
  };

  return (
    <div className="max-h-full overflow-auto">
      <AuthForm onSubmit={handleSubmit(submitAddress)} title={title}>
        <Input
          label="Country:"
          errMessage={errors.country?.message}
          type="text"
          placeholder="Country..."
          {...register("country")}
          defaultValue={address?.country}
        />
        <Input
          label="State:"
          errMessage={errors.state?.message}
          type="text"
          placeholder="State..."
          {...register("state")}
          defaultValue={address?.state}
        />
        <Input
          label="City:"
          errMessage={errors.city?.message}
          type="text"
          placeholder="City..."
          {...register("city")}
          defaultValue={address?.city}
        />
        <Input
          label="Street:"
          errMessage={errors.street?.message}
          type="text"
          placeholder="Street..."
          {...register("street")}
          defaultValue={address?.street}
        />
        <Input
          label="Building:"
          errMessage={errors.building?.message}
          type="number"
          placeholder="Building..."
          {...register("building")}
          defaultValue={address?.building}
        />
        <Input
          label="Entrance:"
          errMessage={errors.entrance?.message}
          type="text"
          placeholder="Entrance..."
          {...register("entrance")}
          defaultValue={address?.entrance}
        />
        <Input
          label="Apartment:"
          errMessage={errors.apartment?.message}
          type="text"
          placeholder="Apartment..."
          {...register("apartment")}
          defaultValue={address?.apartment}
        />
        <Button type="submit" size={"formBtn"} variant={"primary"}>
          {title}
        </Button>
      </AuthForm>
    </div>
  );
};

export default AddressForm;
