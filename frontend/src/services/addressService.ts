import { Address, AddressFormData } from "../models/Address";
import { credentialsAxios, defaultAxios } from "../utils/axiosConfig";

export type AddressReq = {
  address: AddressFormData;
  restaurantId: number | null;
};

class AddressService {
  private addressRoute = "/address";
  private turnAddressFormDataToAddress(
    address: AddressFormData
  ): Omit<Address, "id" | "longitude" | "latitude"> {
    const building = +address.building;
    const apartment = address.apartment ? +address.apartment : undefined;
    return { ...address, building, apartment };
  }
  getAddressById = async (id: number): Promise<Address> => {
    const { data } = await defaultAxios.get(`${this.addressRoute}/${id}`);
    return data;
  };

  postAddress = async ({
    address,
    restaurantId = null,
  }: AddressReq): Promise<Address> => {
    const convertedAddress = this.turnAddressFormDataToAddress(address);
    const { data } = await credentialsAxios.post<Address>(
      this.addressRoute,
      convertedAddress,
      {
        params: { restaurantId },
      }
    );
    return data;
  };

  updateAddress = async ({
    address,
    restaurantId = null,
  }: AddressReq): Promise<Address> => {
    const convertedAddress = this.turnAddressFormDataToAddress(address);
    const { data } = await credentialsAxios.put(
      this.addressRoute,
      convertedAddress,
      {
        params: { restaurantId },
      }
    );
    return data;
  };

  removeAddress = async (restaurantId: number | null = null) => {
    await credentialsAxios.delete(this.addressRoute, {
      params: { restaurantId },
    });
  };
}

export const addressService = new AddressService();
