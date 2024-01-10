import { Address } from "../../models/Address";
import { AuthProvider } from "../../models/AuthProvider";
import { MenuItem } from "../../models/MenuItem";
import { Restaurant } from "../../models/Restaurant";
import { User } from "../../models/User";

type SQLTableNames =
  | "auth_provider"
  | "users"
  | "addresses"
  | "menu_items"
  | "restaurants"
  | "restaurant_owner_address";

class SqlTable<T> {
  constructor(public tableName: SQLTableNames, public columns: Columns<T>) {}
}

type Columns<T> = {
  [K in keyof T]: K;
};

type Tables = {
  auth_provider: SqlTable<Required<AuthProvider>>;
  users: SqlTable<Required<User>>;
  addresses: SqlTable<Required<Address>>;
  menu_items: SqlTable<Required<MenuItem>>;
  restaurant_owner_address: SqlTable<Required<RestauransOwnerAddressTable>>;
  restaurants: SqlTable<Required<Restaurant>>;
};

// type Tables = {
//   auth_provider: SqlTable<AuthProvider>;
//   users: SqlTable<User>;
//   addresses: SqlTable<Address>;
//   menu_items: SqlTable<MenuItem>;
//   restaurant_owner_address: SqlTable<RestauransOwnerAddressTable>;
//   restaurants: SqlTable<Restaurant>;
// };

class DBTables {
  tables: { [K in keyof Tables]: SqlTable<Tables[K]["columns"]> } =
    {} as Tables;

  addTable<T extends keyof Tables>(
    name: T,
    columns: Columns<Tables[T]["columns"]>
  ) {
    const table = new SqlTable<Tables[T]["columns"]>(name, columns);
    this.tables[name] = table as Tables[T];
    return table;
  }
}

export const DB = new DBTables();

DB.addTable("auth_provider", {
  id: "id",
  provider: "provider",
  providerUserId: "providerUserId",
});

DB.addTable("users", {
  id: "id",
  fullName: "fullName",
  email: "email",
  password: "password",
  authProviderId: "authProviderId",
  primaryAddressId: "primaryAddressId",
  isRestaurantOwner: "isRestaurantOwner",
});

DB.addTable("addresses", {
  id: "id",
  state: "state",
  country: "country",
  street: "street",
  building: "building",
  apartment: "apartment",
  entrance: "entrance",
  coordinates: "coordinates",
});
DB.addTable("menu_items", {
  id: "id",
  restaurantId: "restaurantId",
  name: "name",
  description: "description",
  imgUrl: "imgUrl",
});

DB.addTable("restaurant_owner_address", {
  id: "id",
  addressId: "addressId",
  restaurantId: "restaurantId",
  userId: "userId",
});

DB.addTable("restaurants", {
  id: "id",
  name: "name",
  imgUrl: "imgUrl",
});

type RestauransOwnerAddressTable = {
  id: number;
  addressId: number;
  restaurantId: number;
  userId: number;
};
