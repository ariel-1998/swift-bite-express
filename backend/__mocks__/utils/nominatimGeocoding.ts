import { Geocoder } from "../../src/utils/nominatimGeocoding";

class TestGeocoder extends Geocoder {
  testConvertAddressObjToString = this.convertAddressObjToString;
  // testFormatCoords = this.formatCoords;
}

export const testGeocoder = new TestGeocoder();
