import { AddressReqBody } from "../logic/addressLogic";
import { AddressSchema, addressSchema } from "../models/Address";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import NodeGeocoder from "node-geocoder";

export const nodeGeocoder = NodeGeocoder({
  provider: "openstreetmap",
});

type AddressToConvert = Partial<AddressSchema>;
export class Geocoder {
  protected convertAddressObjToString = (address: AddressToConvert) => {
    const addressString = `${address.building ?? ""} ${address.street ?? ""}, ${
      address.city ?? ""
    }, ${address.country ?? ""}, ${address.state ?? ""}`;
    return addressString;
  };

  geocode = async (address: AddressToConvert) => {
    try {
      const addressString = this.convertAddressObjToString(address);
      const data = await nodeGeocoder.geocode(addressString);
      if (!data.length) throw Error();
      const { longitude, latitude } = data[0];
      if (!longitude || !latitude) throw Error();
      return { longitude: `${longitude}`, latitude: `${latitude}` };
    } catch (error) {
      throw new FunctionError("No accurate address found.", 404);
    }
  };
}

export const geocoder = new Geocoder();

export async function getCoordsAndParseAddress(address: AddressReqBody) {
  const data = addressSchema.parse(address);
  const coordinates = await geocoder.geocode(data);
  return { ...data, ...coordinates };
}
