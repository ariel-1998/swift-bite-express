import { describe, it, expect, jest } from "@jest/globals";
import { testGeocoder } from "../../__mocks__/utils/nominatimGeocoding";
import { Address } from "../../src/models/Address";
import { FunctionError } from "../../src/models/Errors/ErrorConstructor";

const longitude = "45.2131";
const latitude = "44.98564";

const addressStringWithUndefined = `31 Jaffa, jerusalem, israel, `;
jest.mock("node-geocoder", () => () => {
  return {
    geocode: (address: string) => {
      if (address === addressStringWithUndefined)
        return [{ longitude, latitude }];
      if (typeof address === "string") return [];
      throw new Error();
    },
  };
});

const validAddress = {
  country: "israel",
  city: "jerusalem",
  building: 31,
  street: "Jaffa",
};

describe("geocoder", () => {
  describe("convertAddressObjToString", () => {
    it("should return object with no nullish values", () => {
      const addressString = `31 Jaffa, jerusalem, israel, `;
      const address: Partial<Address> = {
        country: "israel",
        city: "jerusalem",
        state: null,
        building: 31,
        street: "Jaffa",
      };
      const res = testGeocoder.testConvertAddressObjToString(address);
      expect(res).toBe(addressString);
    });
  });

  describe("geocode", () => {
    it("should throw 404 error if no address found", async () => {
      try {
        await testGeocoder.geocode("string Address" as Partial<Address>);
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("No accurate address found.");
        expect(err.code).toBe(404);
      }
    });
    it("should throw 404 error if no address found", async () => {
      try {
        await testGeocoder.geocode(12 as Partial<Address>);
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("No accurate address found.");
        expect(err.code).toBe(404);
      }
    });
    it("should convert address to coords", async () => {
      const res = await testGeocoder.geocode(validAddress);
      expect(res).toStrictEqual({
        longitude,
        latitude,
      });
    });
  });
});
