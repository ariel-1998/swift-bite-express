import { AddressFormData } from "../models/Address";
import { credentialsAxios, defaultAxios } from "../utils/axiosConfig";

class AddressService {
  private addressRoute = "/address";
  getAddressById = async (id: number) => {
    const { data } = await defaultAxios.get(`${this.addressRoute}/${id}`);
    return data;
  };

  postAddress = async (
    address: AddressFormData,
    restaurantId: number | null = null
  ) => {
    const { data } = await credentialsAxios.post(this.addressRoute, address, {
      params: { restaurantId },
    });
    return data;
  };

  updateAddress = async (
    address: AddressFormData,
    restaurantId: number | null = null
  ) => {
    const { data } = await credentialsAxios.put(this.addressRoute, address, {
      params: { restaurantId },
    });
    return data;
  };

  removeAddress = async (restaurantId: number | null = null) => {
    const { data } = await credentialsAxios.delete(this.addressRoute, {
      params: { restaurantId },
    });
    return data;
  };
}

export const addressService = new AddressService();
