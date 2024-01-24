import { Address } from "../models/Address";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import NodeGeocoder from "node-geocoder";

export const nodeGeocoder = NodeGeocoder({
  provider: "openstreetmap",
});

type AddressToConvert = Partial<Address>;
export class Geocoder {
  protected convertAddressObjToQuery = (address: AddressToConvert) => {
    const filteredAddress = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(address).filter(([key, value]) => Boolean(value))
    );
    return filteredAddress;
  };

  protected formatCoords = (longitude: number, latitude: number) => {
    return `${latitude}, ${longitude}` as const;
  };

  geocode = async (address: AddressToConvert) => {
    try {
      const filteredAddress = this.convertAddressObjToQuery(address);
      const data = await nodeGeocoder.geocode(filteredAddress);
      console.log("data", data);
      if (!data.length) throw Error();
      const { longitude, latitude } = data[0];
      if (!longitude || !latitude) throw Error();
      const coords = this.formatCoords(longitude, latitude);
      return coords;
    } catch (error) {
      console.log(error);
      throw new FunctionError("No accurate address found.", 404);
    }
  };
}

export const geocoder = new Geocoder();
