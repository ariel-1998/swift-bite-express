import { Address } from "../models/Address";
import axios from "axios";
import { FunctionError } from "../models/Errors/ErrorConstructor";

type AddressToConvert = Pick<
  Address,
  "country" | "state" | "street" | "building"
>;
class NominatimGeocoding {
  private url = (address: string) =>
    `https://nominatim.openstreetmap.org/search?q=${address}&format=json`;

  private convertAddressObjToQuery = (address: AddressToConvert) => {
    const { country, state, street, building } = address;
    const addressArray = [country, state, street, building];
    const addressString = addressArray.filter(Boolean).map((value) => {
      if (typeof value === "string") return value.replace(/ /g, "+");
      return value;
    });
    return addressString.toString();
  };

  convertAddressToCoords = async (address: AddressToConvert) => {
    try {
      const addressString = this.convertAddressObjToQuery(address);
      const queryUrl = this.url(addressString);
      const { data } = await axios.get<string>(queryUrl);
      return data;
    } catch (error) {
      throw new FunctionError("Address NOT found.", 404);
    }
  };
}

export const nominatimGeocoding = new NominatimGeocoding();
