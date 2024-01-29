import { describe, it, expect, jest } from "@jest/globals";
import { TransactionQuery, executeQuery } from "../../../src/utils/DB/dbConfig";
import * as dbConfig from "../../../src/utils/DB/dbConfig";
import {
  createMockData,
  mockConnection,
} from "../../../__mocks__/utils/DB/dbConfig";
import { mockUser } from "../../../__mocks__/models/User";
import { FunctionError } from "../../../src/models/Errors/ErrorConstructor";

jest.mock("mysql2/promise", () => {
  return {
    createPool: () => {
      return { getConnection: () => Promise.resolve(mockConnection) };
    },
  };
});

describe("dbConfig", () => {
  describe("executeQuery", () => {
    it("should call execute with right params", () => {
      const query: TransactionQuery = { params: [], query: "" };
      executeQuery(mockConnection, query);
      expect(mockConnection.execute).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        query.query,
        query.params
      );
      expect(mockConnection.execute).toHaveBeenCalled();
    });
    it("should return value from mysql execute", async () => {
      const query: TransactionQuery = { params: [], query: "" };
      const mockData = createMockData(mockUser);
      (mockConnection.execute as jest.Mock).mockResolvedValueOnce(
        mockData as never
      );
      const data = await executeQuery(mockConnection, query);
      expect(mockConnection.execute).toHaveBeenCalled();
      expect(data).toStrictEqual(mockData);
    });
    it("should throw execute error", async () => {
      const query: TransactionQuery = { params: [], query: "" };
      (mockConnection.execute as jest.Mock).mockRejectedValueOnce(
        Error("sql error") as never
      );

      try {
        await executeQuery(mockConnection, query);
      } catch (error) {
        expect(mockConnection.execute).toHaveBeenCalled();

        const err = error as Error;
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("sql error");
      }
    });
  });

  describe("executeSingleQuery", () => {
    it("should return execute data", async () => {
      const query: TransactionQuery = { params: [], query: "" };
      const mockData = createMockData(mockUser);
      (mockConnection.execute as jest.Mock).mockResolvedValueOnce(
        mockData as never
      );
      const data = await dbConfig.executeSingleQuery(query.query, query.params);
      expect(data).toStrictEqual(mockData);
      expect(mockConnection.execute).toHaveBeenCalled();
    });
    it("should call execute with right params", async () => {
      const query: TransactionQuery = { params: [], query: "" };
      const mockData = createMockData(mockUser);

      (mockConnection.execute as jest.Mock).mockResolvedValueOnce(
        mockData as never
      );
      await dbConfig.executeSingleQuery(query.query, query.params);
      expect(mockConnection.execute).toHaveBeenCalled();
      expect(mockConnection.execute).toHaveBeenCalledWith(
        query.query,
        query.params
      );
    });
    it("should throw server error if sql threw an error", async () => {
      const query: TransactionQuery = { params: [], query: "" };
      (mockConnection.execute as jest.Mock).mockRejectedValueOnce(
        Error("error") as never
      );
      try {
        await dbConfig.executeSingleQuery(query.query, query.params);
      } catch (error) {
        expect(mockConnection.execute).toHaveBeenCalled();
        const err = error as FunctionError;
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("Server Error");
        expect(err.code).toBe(500);
      }
    });
  });
});
