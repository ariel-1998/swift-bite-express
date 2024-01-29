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
