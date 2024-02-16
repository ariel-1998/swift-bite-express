import { Address } from "../models/Address";

const restaurants = "restaurants";
const user = "user";
const addresses = "addresses";

class QueryKeys {
  auth = {
    getLogin: [user],
  };
  addresses = {
    getAddressById: [addresses, "user"],
  };
  restaurants = {
    getSingleRestaurantById(restaurantId: number) {
      return [restaurants, "byId", restaurantId];
    },
    //infinite query check if valid or need to add another variable for page
    searchRestaurantsByName(search: string, address: Address | undefined) {
      return [restaurants, "search", search, address];
    },
    //infinite query check if valid or need to add another variable for page
    getNearRestaurantsByPage(address: Address | undefined) {
      return [restaurants, "pages", address];
    },
  };
}

const queryKeys = new QueryKeys();
export default queryKeys;
