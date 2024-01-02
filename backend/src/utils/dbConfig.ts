import mysql, { PoolOptions, RowDataPacket } from "mysql2/promise";

const config: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const pool = mysql.createPool(config);

export function execute<T>(query: string, params?: string[]) {
  return pool.execute<T & RowDataPacket[]>(query, params);
}
