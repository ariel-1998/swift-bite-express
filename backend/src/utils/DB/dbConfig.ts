import mysql, {
  PoolOptions,
  RowDataPacket,
  PoolConnection,
  Pool,
} from "mysql2/promise";
import { FunctionError } from "../../models/Errors/ErrorConstructor";

export const config: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
};

export const pool: Pool = mysql.createPool(config);
export type MixedArray = (string | number | null)[];

export type TransactionQuery = {
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

export async function executeSingleQuery<T>(query: string, params: MixedArray) {
  let connection: PoolConnection | undefined = undefined;
  try {
    connection = await pool.getConnection();
  } catch (error) {
    connection?.release();
    throw new FunctionError("Server Error", 500);
  }

  try {
    const data = await executeQuery<T>(connection, { query, params });
    connection.release();
    return data;
  } catch (error) {
    connection.release();
    throw error;
  }
}
