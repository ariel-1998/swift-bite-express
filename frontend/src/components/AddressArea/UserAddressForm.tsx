import React from "react";
import { useForm } from "react-hook-form";
import { Address, AddressFormData, addressSchema } from "../../models/Address";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthForm from "../AuthArea/AuthForm";
import Input from "../Customs/Input";
import Button from "../Customs/Button";
import { addressService } from "../../services/addressService";

type UserAddressFormProps = {
  address?: Address;
  title: string;
};

const UserAddressForm: React.FC<UserAddressFormProps> = ({
  address,
  title,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AddressFormData>({ resolver: zodResolver(addressSchema) });

  const submitAddress = async (data: AddressFormData) => {
    await addressService.postAddress(data);
  };

  return (
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
  );
};

export default UserAddressForm;
