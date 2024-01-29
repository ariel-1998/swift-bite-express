import { PoolConnection } from "mysql2/promise";
import { Address } from "../../models/Address";
import { AuthProvider } from "../../models/AuthProvider";
import { MenuItem } from "../../models/MenuItem";
import { Restaurant } from "../../models/Restaurant";
import { User } from "../../models/User";
import { executeQuery, pool } from "./dbConfig";
import { RestauransOwnerAddressTable } from "../../models/RestauransOwnerAddressTable";

type SQLTableNames =
  | "auth_provider"
  | "users"
  | "addresses"
  | "menu_items"
  | "restaurants"
  | "restaurant_owner_address";

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
  menu_items: SqlTable<Required<MenuItem>>;
  restaurant_owner_address: SqlTable<Required<RestauransOwnerAddressTable>>;
  restaurants: SqlTable<Required<Restaurant>>;
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
  addressId: "addressId",
  restaurantId: "restaurantId",
  userId: "userId",
});

DB.addTable("restaurants", {
  id: "id",
  name: "name",
  imgUrl: "imgUrl",
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
  await executeQuery(connection, { query, params: [] });
}

async function create_addresses_table(connection: PoolConnection) {
  const { columns, tableName } = DB.tables.addresses;
  const {
    id,
    apartment,
    building,
    city,
    coordinates,
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
    ${coordinates} VARCHAR(90) NOT NULL
    )`;
  await executeQuery(connection, { query, params: [] });
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
  const auth_provider = DB.tables.auth_provider.tableName;
  const addresses = DB.tables.addresses.tableName;

  const query = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    ${id} INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ${authProviderId} VARCHAR(100) DEFAULT NULL,
    ${primaryAddressId} INT DEFAULT NULL,
    ${fullName} VARCHAR(100) NOT NULL,
    ${password} VARCHAR(90) DEFAULT NULL,
    ${email} VARCHAR(90) UNIQUE NOT NULL,
    ${isRestaurantOwner} TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (${authProviderId}) REFERENCES ${auth_provider}(id),
    FOREIGN KEY (${primaryAddressId}) REFERENCES ${addresses}(id)
    )`;
  await executeQuery(connection, { query, params: [] });
}

export async function createDBTables() {
  let connection: PoolConnection | undefined = undefined;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await create_auth_provider_table(connection);
    await create_addresses_table(connection);
    await create_users_table(connection);
    await connection.commit();
  } catch (error) {
    await connection?.rollback();
    throw error;
  } finally {
    connection?.release();
  }
}
