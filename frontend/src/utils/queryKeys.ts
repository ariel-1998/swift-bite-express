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
    searchRestaurantsByName(search: string) {
      return [restaurants, "search", search];
    },
    //infinite query check if valid or need to add another variable for page
    getNearRestaurantsByPage: [restaurants, "pages"],
  };
}

const queryKeys = new QueryKeys();
export default queryKeys;
