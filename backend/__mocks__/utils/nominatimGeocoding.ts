import { Geocoder } from "../../src/utils/nominatimGeocoding";

class TestGeocoder extends Geocoder {
  testConvertAddressObjToQuery = this.convertAddressObjToQuery;
  testFormatCoords = this.formatCoords;
}

export const testGeocoder = new TestGeocoder();
