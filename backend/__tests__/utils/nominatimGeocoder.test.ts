import { describe, it, expect, jest } from "@jest/globals";
import { testGeocoder } from "../../__mocks__/utils/nominatimGeocoding";
import { Address } from "../../src/models/Address";
import { FunctionError } from "../../src/models/Errors/ErrorConstructor";

const longitude = 45.2131;
const latitude = 44.98564;
jest.mock("node-geocoder", () => () => {
  return {
    geocode: (address: string | Record<string, unknown>) => {
      if (typeof address === "object") return [{ longitude, latitude }];
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

const coords = `${latitude}, ${longitude}`;

describe("geocoder", () => {
  describe("convertAddressObjToQuery", () => {
    it("should return object with no nullish values", () => {
      const address: Partial<Address> = {
        country: "israel",
        city: "jerusalem",
        state: null,
        building: 31,
        street: "Jaffa",
      };
      const res = testGeocoder.testConvertAddressObjToQuery(address);
      expect(res).toStrictEqual(validAddress);
    });
  });
  describe("formatCoords", () => {
    it("should return coords format", () => {
      const res = testGeocoder.testFormatCoords(longitude, latitude);
      expect(res).toBe(coords);
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
      expect(res).toBe(coords);
    });
  });
});
