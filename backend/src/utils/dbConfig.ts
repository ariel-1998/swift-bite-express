import mysql, {
  PoolOptions,
  RowDataPacket,
  PoolConnection,
} from "mysql2/promise";

const config: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
};

export const pool = mysql.createPool(config);

type MixedArray = (string | number | null)[];

export function execute<T>(query: string, params?: MixedArray) {
  return pool.execute<T & RowDataPacket[]>(query, params);
}

export const SQL_TABLES = {
  authProvider: "auth_provider",
  users: "users",
  addresses: "addresses",
  menuItems: "menu_items",
  restaurants: "restaurants",
  restaurantsUsersAddresses: "restaurant_owner_address",
} as const;

type TransactionQuery = {
  query: string;
  params: MixedArray;
};
export async function executeQuery<T>(
  connection: PoolConnection,
  query: TransactionQuery
) {
  const data = await connection.execute<T & RowDataPacket[]>(
    query.query,
    query.params
  );
  return data;
}
