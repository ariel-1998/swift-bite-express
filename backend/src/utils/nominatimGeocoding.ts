import { Address } from "../models/Address";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import NodeGeocoder from "node-geocoder";

const nodeGeocoder = NodeGeocoder({
  provider: "openstreetmap",
});

type AddressToConvert = Partial<Address>;
class Geocoder {
  private convertAddressObjToQuery = (address: AddressToConvert) => {
    const filteredAddress = Object.fromEntries(
      Object.entries(address).filter(([_, value]) => Boolean(value))
    );
    return filteredAddress;
  };

  private formatCoords = (longitude: number, latitude: number) => {
    return `${latitude}, ${longitude}`;
  };

  geocode = async (address: AddressToConvert) => {
    try {
      const filteredAddress = this.convertAddressObjToQuery(address);
      const data = await nodeGeocoder.geocode(filteredAddress);
      if (!data.length) throw Error();
      const { longitude, latitude } = data[0];
      if (!longitude || !latitude) throw Error();
      const coords = this.formatCoords(longitude, latitude);
      return coords;
    } catch (error) {
      throw new FunctionError("No accurate address found.", 404);
    }
  };
}

export const geocoder = new Geocoder();
