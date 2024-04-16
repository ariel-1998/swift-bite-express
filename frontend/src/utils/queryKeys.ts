import { Address } from "../models/Address";

const restaurants = "restaurants";
const user = "user";
const addresses = "addresses";
const categories = "categories";
const menuItems = "menuItems";
class QueryKeys {
  auth = {
    getLogin: [user], //User
  };
  addresses = {
    getAddressById: [addresses, "user"], //Address
  };
  restaurants = {
    getSingleRestaurantById(restaurantId: number) {
      return [restaurants, "byId", restaurantId]; //NestedRestaurantAndAddress
    },
    searchRestaurantsByName(search: string, address: Address | undefined) {
      return [restaurants, address, "search", search]; //InfiniteData<Restaurant[]>
    },
    getNearRestaurantsByPage(address: Address | undefined) {
      return [restaurants, address, "pages"]; //InfiniteData<NestedRestaurantAndAddress[]>
    },
    getOwnerRestaurants: [restaurants, "owner"], //NestedRestaurantAndAddress[]
  };

  categories = {
    //need to check if cahched in object
    getAllCategoriesByRestaurantId(restaurantId: number) {
      return [categories, { restaurantId }]; //Category[]
    },
    getSingleCategoryById(categoryId: number) {
      return [categories, { categoryId }]; //Category
    },
  };

  menuItems = {
    getMenuItemById(menuItemId: number) {
      return [menuItems, { menuItemId }]; //MenuItemWdOptions
    },
    getMenuItemsByRestaurantId(restaurantId: number) {
      //user = MenuItemWCategoryAndOptions[] |owner =  CategoriesNestedInMenuItem[]
      return [menuItems, { restaurantId }];
      //old //owner = CategoriesNestedInMenuItem[] || user = MenuItemsNestedInCategories[]
    },
  };
}

const queryKeys = new QueryKeys();
export default queryKeys;
