import { AddressFormData } from "../models/Address";

class AddressService {
  getAddressById = () => {};

  postAddress = async (address: AddressFormData) => {
    return address;
  };
}

export const addressService = new AddressService();
