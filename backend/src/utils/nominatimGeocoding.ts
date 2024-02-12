import { AddressReqBody } from "../logic/addressLogic";
import { Address, addressSchema } from "../models/Address";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import NodeGeocoder from "node-geocoder";
import { parseSchemaThrowZodErrors } from "../models/Errors/ZodErrors";
import { turnUndefinedToNull } from "./helperFunctions";

export const nodeGeocoder = NodeGeocoder({
  provider: "openstreetmap",
});

type AddressToConvert = Partial<Address>;
export class Geocoder {
  protected convertAddressObjToString = (address: AddressToConvert) => {
    const addressString = `${address.building} ${address.street}, ${address.city}, ${address.country}, ${address.state}`;
    return addressString;
  };

  protected formatCoords = (longitude: number, latitude: number) => {
    return `${latitude}, ${longitude}` as const;
  };

  geocode = async (address: AddressToConvert) => {
    try {
      const addressString = this.convertAddressObjToString(address);
      const data = await nodeGeocoder.geocode(addressString);

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

export async function getCoordsAndturnUndefinedToNull<
  T extends { body: AddressReqBody }
>(req: T) {
  const addressObj = turnUndefinedToNull(
    req.body,
    "state",
    "entrance",
    "apartment"
  );
  const coordinates = await geocoder.geocode(req.body);
  parseSchemaThrowZodErrors(addressSchema, {
    ...addressObj,
    coordinates,
  });
  return { ...addressObj, coordinates };
}
