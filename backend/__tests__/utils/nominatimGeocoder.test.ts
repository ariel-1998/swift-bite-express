import { describe, it, expect } from "@jest/globals";
import { Address } from "../../src/models/Address";
import { testGeocoder } from "../../__mocks__/utils/nominatimGeocoding";

const validAddress = {
  country: "israel",
  city: "jerusalem",
  building: 31,
  street: "Jaffa",
};
const longitude = 45.2131;
const latitude = 44.98564;
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

  //   describe("geocode", () => {
  //     it("should throw 404 error if no address found", async () => {
  //       (spy as unknown as jest.Mock).mockRejectedValueOnce(Error as never);
  //       try {
  //         await testGeocoder.geocode(validAddress);
  //       } catch (error) {
  //         const err = error as FunctionError;
  //         expect(err).toBeDefined();
  //         expect(err).toBeInstanceOf(FunctionError);
  //         expect(err.message).toBe("No accurate address found.");
  //         expect(err.code).toBe(404);
  //       }
  //     });
  //     it("should convert address to coords", async () => {
  //       const geocodeRes = [{ longitude, latitude }];
  //       (spy as unknown as jest.Mock).mockResolvedValueOnce(geocodeRes as never);

  //       //   (geocoder.geocode as jest.Mock).mockResolvedValueOnce(
  //       //     geocodeRes as never
  //       //   );
  //       const res = await testGeocoder.geocode(validAddress);
  //       expect(res).toBe(coords);
  //     });
  //   });
});
