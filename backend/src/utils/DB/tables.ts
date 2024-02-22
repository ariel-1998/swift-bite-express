import { PoolConnection } from "mysql2/promise";
import { Address } from "../../models/Address";
import { AuthProvider } from "../../models/AuthProvider";
import { Restaurant } from "../../models/Restaurant";
import { User } from "../../models/User";
import { executeQuery, pool } from "./dbConfig";
import { RestauransOwnerAddressTable } from "../../models/RestauransOwnerAddressTable";
import { MenuItem } from "../../models/MenuItem";
import { Category } from "../../models/Category";
import { MenuItemCategoryTable } from "../../models/MenuItemCategoryTable";
import { Extra } from "../../models/Extra";
import { Sauce } from "../../models/Sauce";

type SQLTableNames =
  | "auth_provider"
  | "users"
  | "addresses"
  | "restaurants"
  | "restaurant_owner_address"
  | "categories"
  | "menu_items"
  | "sauces"
  | "extras"
  | "menu_items_category";

export class SqlTable<T> {
  constructor(public tableName: SQLTableNames, public columns: Columns<T>) {}
}

type Columns<T> = {
  [K in keyof T]: K;
};

type Tables = {
  auth_provider: SqlTable<Required<AuthProvider>>;
  users: SqlTable<Required<User>>;
  addresses: SqlTable<Required<Address>>;
  restaurant_owner_address: SqlTable<Required<RestauransOwnerAddressTable>>;
  restaurants: SqlTable<Required<Restaurant>>;
  categories: SqlTable<Required<Category>>;
  menu_items: SqlTable<Required<MenuItem>>;
  sauces: SqlTable<Required<Sauce>>;
  extras: SqlTable<Required<Extra>>;
  menu_items_category: SqlTable<Required<MenuItemCategoryTable>>;
};

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
  city: "city",
  building: "building",
  apartment: "apartment",
  entrance: "entrance",
  longitude: "longitude",
  latitude: "latitude",
});

DB.addTable("restaurant_owner_address", {
  addressId: "addressId",
  restaurantId: "restaurantId",
  userId: "userId",
});

DB.addTable("restaurants", {
  id: "id",
  name: "name",
  imgPublicId: "imgPublicId",
  logoPublicId: "logoPublicId",
});

DB.addTable("categories", {
  id: "id",
  restaurantId: "restaurantId",
  description: "description",
  name: "name",
});
DB.addTable("menu_items", {
  id: "id",
  name: "name",
  description: "description",
  imgPublicId: "imgPublicId",
  extrasAmount: "extrasAmount",
  restaurantId: "restaurantId",
  showSouces: "showSouces",
});
DB.addTable("sauces", {
  id: "id",
  restaurantId: "restaurantId",
  name: "name",
});

DB.addTable("extras", {
  id: "id",
  menuItemId: "menuItemId",
  name: "name",
  type: "type",
  extraPrice: "extraPrice",
  restaurantId: "restaurantId",
});

DB.addTable("menu_items_category", {
  menuItemId: "menuItemId",
  categoryId: "categoryId",
  restaurantId: "restaurantId",
});

async function create_auth_provider_table(connection: PoolConnection) {
  const { columns, tableName } = DB.tables.auth_provider;
  const { id, provider, providerUserId } = columns;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ${id} VARCHAR(100) NOT NULL UNIQUE,
    ${provider} ENUM('facebook', 'google') NOT NULL,
    ${providerUserId} VARCHAR(100) NOT NULL,
    PRIMARY KEY (${provider}, ${providerUserId})
)`;
  await createTable(connection, query);
}

async function create_addresses_table(connection: PoolConnection) {
  const { columns, tableName } = DB.tables.addresses;
  const {
    id,
    apartment,
    building,
    city,
    longitude,
    latitude,
    country,
    entrance,
    state,
    street,
  } = columns;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ${id} INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    ${country} VARCHAR(45) NOT NULL,
    ${street} VARCHAR(90) NOT NULL,
    ${building} INT NOT NULL,
    ${entrance} VARCHAR(4) DEFAULT NULL,
    ${apartment} INT DEFAULT NULL,
    ${state} VARCHAR(45) DEFAULT NULL,
    ${city} VARCHAR(90) NOT NULL,
    ${longitude} DECIMAL(20, 17) NOT NULL,
    ${latitude} DECIMAL(20, 17) NOT NULL
    )`;
  await createTable(connection, query);
}

async function create_users_table(connection: PoolConnection) {
  const { columns, tableName } = DB.tables.users;
  const {
    id,
    email,
    password,
    fullName,
    authProviderId,
    isRestaurantOwner,
    primaryAddressId,
  } = columns;
  const auth_provider = DB.tables.auth_provider;
  const addresses = DB.tables.addresses;

  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ${id} INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ${authProviderId} VARCHAR(100) DEFAULT NULL,
    ${primaryAddressId} INT DEFAULT NULL,
    ${fullName} VARCHAR(100) NOT NULL,
    ${password} VARCHAR(90) DEFAULT NULL,
    ${email} VARCHAR(90) UNIQUE NOT NULL,
    ${isRestaurantOwner} TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (${authProviderId}) REFERENCES ${auth_provider.tableName}(${auth_provider.columns.id}) ON DELETE CASCADE,
    FOREIGN KEY (${primaryAddressId}) REFERENCES ${addresses.tableName}(${addresses.columns.id}) ON DELETE SET NULL
    )`;
  await createTable(connection, query);
}

async function create_restaurants_table(connection: PoolConnection) {
  const { columns, tableName } = DB.tables.restaurants;
  const { id, name, imgPublicId, logoPublicId } = columns;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ${id} INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ${name} VARCHAR(45) NOT NULL UNIQUE,
    ${imgPublicId} VARCHAR(50) DEFAULT NULL,
    ${logoPublicId} VARCHAR(50) DEFAULT NULL
  )`;
  await createTable(connection, query);
}

async function create_restaurant_owner_address_table(
  connection: PoolConnection
) {
  const tables = DB.tables;
  const { columns, tableName } = tables.restaurant_owner_address;
  const { addressId, restaurantId, userId } = columns;
  const addresses = tables.addresses;
  const restaurants = tables.restaurants;
  const users = tables.users;

  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ${addressId} INT DEFAULT NULL,
    ${restaurantId} INT NOT NULL,
    ${userId} INT NOT NULL,
    PRIMARY KEY (${restaurantId}, ${userId}),
    FOREIGN KEY (${addressId}) REFERENCES ${addresses.tableName}(${addresses.columns.id}) ON DELETE SET NULL,
    FOREIGN KEY (${restaurantId}) REFERENCES ${restaurants.tableName}(${restaurants.columns.id}) ON DELETE CASCADE,
    FOREIGN KEY (${userId}) REFERENCES ${users.tableName}(${users.columns.id}) ON DELETE CASCADE
  )`;
  await createTable(connection, query);
}

async function create_categories_table(connection: PoolConnection) {
  const { tables } = DB;
  const { columns, tableName } = tables.categories;
  const { id, restaurantId, name, description } = columns;
  const { columns: restaurantCols, tableName: restaurants } =
    tables.restaurants;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
  ${id} INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  ${restaurantId} INT NOT NULL,
  ${name} VARCHAR(45) NOT NULL,
  ${description} VARCHAR(500) DEFAULT NULL,
  FOREIGN KEY (${restaurantId}) REFERENCES ${restaurants}(${restaurantCols.id}) ON DELETE CASCADE
  )`;
  await createTable(connection, query);
}

async function create_menu_items_table(connection: PoolConnection) {
  const { columns, tableName } = DB.tables.menu_items;
  const {
    id,
    name,
    description,
    extrasAmount,
    imgPublicId,
    showSouces,
    restaurantId,
  } = columns;
  const { columns: restaurantCols, tableName: restaurants } =
    DB.tables.restaurants;
  const query = `
   CREATE TABLE IF NOT EXISTS ${tableName} (
  ${id} INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  ${restaurantId} INT NOT NULL,
  ${name} VARCHAR(45) NOT NULL,
  ${description} VARCHAR(500) DEFAULT NULL,
  ${extrasAmount} INT DEFAULT NULL,
  ${showSouces} TINYINT NOT NULL DEFAULT 0,
  ${imgPublicId} VARCHAR(500) DEFAULT NULL,
  FOREIGN KEY (${restaurantId}) REFERENCES ${restaurants}(${restaurantCols.id}) ON DELETE CASCADE
  )`;
  await createTable(connection, query);
}

async function create_sauces_table(connection: PoolConnection) {
  const { tables } = DB;
  const { columns, tableName } = tables.sauces;
  const { id, restaurantId, name } = columns;
  const { columns: restaurantCols, tableName: restaurants } =
    tables.restaurants;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
  ${id} INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  ${restaurantId} INT NOT NULL,
  ${name} VARCHAR(45) NOT NULL,
  FOREIGN KEY (${restaurantId}) REFERENCES ${restaurants}(${restaurantCols.id}) ON DELETE CASCADE
  )`;
  await createTable(connection, query);
}

async function create_extras_table(connection: PoolConnection) {
  const { tables } = DB;
  const { columns, tableName } = tables.extras;
  const { id, menuItemId, name, type, extraPrice, restaurantId } = columns;
  const { columns: itemCols, tableName: menuItems } = tables.menu_items;
  const { columns: restCols, tableName: restaurants } = tables.restaurants;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
  ${id} INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  ${menuItemId} INT NOT NULL,
  ${name} VARCHAR(45) NOT NULL,
  ${type} ENUM('drink', 'extra') NOT NULL,
  ${extraPrice} INT DEFAULT NULL,
  ${restaurantId} INT NOT NULL,
  FOREIGN KEY (${menuItemId}) REFERENCES ${menuItems}(${itemCols.id}) ON DELETE CASCADE,
  FOREIGN KEY (${restaurantId}) REFERENCES ${restaurants}(${restCols.id}) ON DELETE CASCADE
  )`;
  await createTable(connection, query);
}
async function create_menu_items_category_table(connection: PoolConnection) {
  const { tables } = DB;
  const { columns, tableName } = tables.menu_items_category;
  const { categoryId, menuItemId, restaurantId } = columns;
  const { columns: itemCols, tableName: menuItems } = tables.menu_items;
  const { columns: categoryCols, tableName: categories } = tables.categories;
  const { columns: restCols, tableName: restaurants } = tables.restaurants;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
  ${menuItemId} INT NOT NULL,
  ${categoryId} INT NOT NULL,
  ${restaurantId} INT NOT NULL,
  PRIMARY KEY (${categoryId}, ${menuItemId}),
  FOREIGN KEY (${menuItemId}) REFERENCES ${menuItems}(${itemCols.id}) ON DELETE CASCADE,
  FOREIGN KEY (${categoryId}) REFERENCES ${categories}(${categoryCols.id}) ON DELETE CASCADE,
  FOREIGN KEY (${restaurantId}) REFERENCES ${restaurants}(${restCols.id}) ON DELETE CASCADE
  )`;
  await createTable(connection, query);
}

export async function createDBTables() {
  let connection: PoolConnection | undefined = undefined;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await create_auth_provider_table(connection);
    await create_addresses_table(connection);
    await create_users_table(connection);
    await create_restaurants_table(connection);
    await create_restaurant_owner_address_table(connection);
    await create_categories_table(connection);
    await create_menu_items_table(connection);
    await create_sauces_table(connection);
    await create_extras_table(connection);
    await create_menu_items_category_table(connection);
    await connection.commit();
  } catch (error) {
    await connection?.rollback();
    throw error;
  } finally {
    connection?.release();
  }
}

async function createTable(connection: PoolConnection, query: string) {
  await executeQuery(connection, { query, params: [] });
}
