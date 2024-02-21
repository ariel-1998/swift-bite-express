import { SQLBoolean } from "./SQLBoolean";
// routes
// get all categories by restaurantId //done
// update category by categoryId and restaurantId(verify if it the owner trying to update) //done
// create category with restaurantId (verify if it the owner trying to create) //done
//delete category with restaurantId and categoryId (check if its the owner trying to delete)// done
//routes
//in route need to check before each request with the middlewares below, only get doesnt need any middleware
// 1 isRestaurantOwner
// 2 verifyOwnershipByRestaurantIdAndUserIdMiddleware
export type Category = {
  id: number;
  name: string;
  description: string | undefined | null;
  restaurantId: number; //refers to restaurants
};

export type MenuItem = {
  id: number;
  name: string;
  restaurantId: number; //refers to restaurants
  description: string | undefined | null;
  extrasAmount: number | undefined | null;
  showSouces: SQLBoolean;
  imgPublicId: string | undefined | null;
};
// get all sauces by restaurantId
// update sauce by id and restaurantId(check if its the owner trying to update)
// create sauce name with restaurantId(check if its the owner trying to create)
// delete sauce by id and restaurantId  (check if its the owner trying to delete)
//routes
//in route need to check before each request with the middlewares below, only get doesnt need any middleware
// 1 isRestaurantOwner
// 2 verifyOwnershipByRestaurantIdAndUserIdMiddleware
export type Sauce = {
  id: number;
  restaurantId: number; //refers to restaurants
  name: string;
};

// get all extras by MenuItemId
// create extra with MenuItemId and restaurantId(check if its the owner trying to create)
// update extra check how to do //need to join menuItem and check if its restaurantId = ?
// delete extra check how to do //need to join menuItem and check if its restaurantId = ?
export type Extra = {
  id: number;
  menuItemId: number; //refers to MenuItem
  name: string;
  extraPrice: number | undefined | null;
  type: "drink" | "extra";
};

// create MenuItemCategory row when user select category for the item
// update MenuItemCategory row when user changes the category for the item to a different category
// no need for delete as i set it to cascade no matter if category/menuItem gets deleted this row will be deleted with them
export type MenuItemCategoryTable = {
  menuItemId: number; //refers to MenuItem
  categoryId: number; //refers to Category
};
