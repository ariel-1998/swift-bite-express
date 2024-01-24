import { jest } from "@jest/globals";
import * as mysql from "mysql2/promise";
import {
  executeQuery,
  executeSingleQuery,
} from "../../../src/utils/DB/dbConfig";
jest.mock("../../../src/utils/DB/dbConfig");
// jest.mock("mysql2/promise");

export type QueryResult<T> = [T & mysql.RowDataPacket[], mysql.FieldPacket[]];
export type DataType<T> = T & mysql.RowDataPacket[];

export const mockConnection = {
  execute: jest.fn() as <T>() => Promise<QueryResult<T>>,
  commit: jest.fn() as () => Promise<void>,
  rollback: jest.fn() as () => Promise<void>,
  release: jest.fn(),
  beginTransaction: jest.fn() as () => Promise<void>,
} as unknown as mysql.PoolConnection;

export const mockPool = {
  getConnection: () => Promise.resolve(mockConnection),
} as unknown as mysql.Pool;

export const mockExecuteQuery = executeQuery as jest.Mock;
export const mockExecuteSingleQuery = executeSingleQuery as jest.Mock;

// export function mockMysql2Module() {
//   jest.mock("mysql2/promise", () => ({
//     createPool: jest.fn(() => ({
//       promise: () => ({
//         getConnection: async () => mockConnection,
//         query: jest.fn(),
//         execute: jest.fn(),
//       }),
//     })),
//   }));
// }

export function createMockData<T>(data?: T): QueryResult<T> {
  return [[data] as DataType<T>, []] as QueryResult<T>;
}

export function sqlResultSetHeader(insertId = 12) {
  return [
    { insertId } as DataType<mysql.ResultSetHeader>,
    [],
  ] as QueryResult<mysql.ResultSetHeader>;
}

export type MockDbConfigModule = {
  mockConnection: mysql.PoolConnection;
  mockPool: mysql.Pool;
  mockExecuteQuery: jest.Mock;
};
