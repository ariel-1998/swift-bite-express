import { PoolConnection } from "mysql2/promise";
import { Address } from "../../models/Address";
import { AuthProvider } from "../../models/AuthProvider";
import { Restaurant } from "../../models/Restaurant";
import { User } from "../../models/User";
import { executeQuery, pool } from "./dbConfig";
import { RestauransOwnerAddressTable } from "../../models/RestauransOwnerAddressTable";
import {
  Category,
  Meal,
  MealCategoryTable,
  Extra,
  Sauce,
} from "../../models/Meal";

type SQLTableNames =
  | "auth_provider"
  | "users"
  | "addresses"
  | "menu_items"
  | "restaurants"
  | "restaurant_owner_address"
  //trying, check if works ///////////////////////////////////
  | "categories"
  | "meals"
  | "sauces"
  | "extras"
  | "meal_category";

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

  //trying, check if works ///////////////////////////////////

  categories: SqlTable<Required<Category>>;
  meals: SqlTable<Required<Meal>>;
  sauces: SqlTable<Required<Sauce>>;
  extras: SqlTable<Required<Extra>>;
  meal_category: SqlTable<Required<MealCategoryTable>>;
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

//trying, check if works ///////////////////////////////////
DB.addTable("categories", {
  id: "id",
  restaurantId: "restaurantId",
  description: "description",
  name: "name",
});
DB.addTable("meals", {
  id: "id",
  name: "name",
  description: "description",
  imgPublicId: "imgPublicId",
  extrasAmount: "extrasAmount",
  showSouces: "showSouces",
});
DB.addTable("sauces", {
  id: "id",
  restaurantId: "restaurantId",
  name: "name",
});

DB.addTable("extras", {
  id: "id",
  mealId: "mealId",
  name: "name",
  type: "type",
  extraPrice: "extraPrice",
});

DB.addTable("meal_category", {
  mealId: "mealId",
  categotyId: "categotyId",
});

async function create_auth_provider_table(connection: PoolConnection) {
  const { columns, tableName } = DB.tables.auth_provider;
  const { id, provider, providerUserId } = columns;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ${id} VARCHAR(100) NOT NULL UNIQUE,
    ${provider} ENUM('facebook', 'google') NOT NULL,
    ${providerUserId} VARCHAR(90) NOT NULL,
    PRIMARY KEY (${provider}, ${providerUserId})
)`;
  await createTable(connection, query);

  // await executeQuery(connection, { query, params: [] });
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

  // await executeQuery(connection, { query, params: [] });
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

  // await executeQuery(connection, { query, params: [] });
}

//check if right table
async function create_restaurants_table(connection: PoolConnection) {
  const { columns, tableName } = DB.tables.restaurants;
  const { id, name, imgPublicId, logoPublicId } = columns;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ${id} INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ${name} VARCHAR(45) NOT NULL UNIQUE,
    ${imgPublicId} VARCHAR(20) DEFAULT NULL,
    ${logoPublicId} VARCHAR(20) DEFAULT NULL
  )`;
  await createTable(connection, query);

  // await executeQuery(connection, { query, params: [] });
}

//check if right table
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
  // await executeQuery(connection, { query, params: [] });
}

//trying, check if works ///////////////////////////////////
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

async function create_meals_table(connection: PoolConnection) {
  const { columns, tableName } = DB.tables.meals;
  const { id, name, description, extrasAmount, imgPublicId, showSouces } =
    columns;
  const query = `
   CREATE TABLE IF NOT EXISTS ${tableName} (
  ${id} INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  ${name} VARCHAR(45) NOT NULL,
  ${description} VARCHAR(500) DEFAULT NULL,
  ${extrasAmount} INT DEFAULT NULL,
  ${showSouces} TINYINT NOT NULL DEFAULT 0,
  ${imgPublicId} VARCHAR(500) DEFAULT NULL
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
  const { id, mealId, name, type, extraPrice } = columns;
  const { columns: mealCols, tableName: meals } = tables.meals;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
  ${id} INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  ${mealId} INT NOT NULL,
  ${name} VARCHAR(45) NOT NULL,
  ${type} ENUM('drink', 'extra') NOT NULL,
  ${extraPrice} INT DEFAULT NULL,
  FOREIGN KEY (${mealId}) REFERENCES ${meals}(${mealCols.id}) ON DELETE CASCADE
  )`;
  await createTable(connection, query);
}
async function create_meal_category_table(connection: PoolConnection) {
  const { tables } = DB;
  const { columns, tableName } = tables.meal_category;
  const { categotyId, mealId } = columns;
  const { columns: mealCols, tableName: meals } = tables.meals;
  const { columns: categoryCols, tableName: categories } = tables.categories;
  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
  ${mealId} INT NOT NULL,
  ${categotyId} INT NOT NULL,
  FOREIGN KEY (${mealId}) REFERENCES ${meals}(${mealCols.id}) ON DELETE CASCADE,
  FOREIGN KEY (${categotyId}) REFERENCES ${categories}(${categoryCols.id}) ON DELETE CASCADE
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

    //trying, check if works ///////////////////////////////////
    await create_categories_table(connection);
    await create_meals_table(connection);
    await create_sauces_table(connection);
    await create_extras_table(connection);
    await create_meal_category_table(connection);
    //trying, check if works ///////////////////////////////////

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
