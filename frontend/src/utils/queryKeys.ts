import { Address } from "../models/Address";

const restaurants = "restaurants";
const user = "user";
const addresses = "addresses";
const categories = "categories";
const menuItems = "menuItems";
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
    searchRestaurantsByName(search: string, address: Address | undefined) {
      return [restaurants, address, "search", search];
    },
    getNearRestaurantsByPage(address: Address | undefined) {
      return [restaurants, address, "pages"];
    },
    getOwnerRestaurants: [restaurants, "owner"],
  };

  categories = {
    //need to check if cahched in object
    getAllCategoriesByRestaurantId(restaurantId: number) {
      return [categories, { restaurantId }];
    },
    getSingleCategoryById(categoryId: number) {
      return [categories, { categoryId }];
    },
  };

  menuItems = {
    getMenuItemById(menuItemId: number) {
      return [menuItems, { menuItemId }];
    },
    getMenuItemByRestaurantId(restaurantId: number) {
      return [menuItems, { restaurantId }];
    },
  };
}

const queryKeys = new QueryKeys();
export default queryKeys;
