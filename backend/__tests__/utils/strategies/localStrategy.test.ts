import { jest, describe, it, expect } from "@jest/globals";
import { testLocalProvider } from "../../../__mocks__/utils/strategies/localStrategy";
import {
  createMockData,
  mockConnection,
  mockExecuteQuery,
  sqlResultSetHeader,
} from "../../../__mocks__/utils/DB/dbConfig";
import {
  credentials,
  mockUser,
  registrationData,
} from "../../../__mocks__/models/User";
import { MixedArray, TransactionQuery } from "../../../src/utils/DB/dbConfig";
import { IsOwner, User } from "../../../src/models/User";
import { FunctionError } from "../../../src/models/Errors/ErrorConstructor";
import * as bcrypt from "../../../src/utils/bcrypt";
import { ZodErrors } from "../../../src/models/Errors/ZodErrors";

jest.mock("../../../src/utils/DB/dbConfig");

const hashedPassword = "hashedPassword";

describe("localProvider", () => {
  describe("getUserByEmail", () => {
    it("should call executeQuery with right params and throw error", async () => {
      mockExecuteQuery.mockRejectedValueOnce(Error as never);
      await expect(
        testLocalProvider.testGetUserByEmail(mockConnection, mockUser.email)
      ).rejects.toBeTruthy();
      expect(mockExecuteQuery).toHaveBeenCalled();
      const query: TransactionQuery = {
        query: expect.any(String) as unknown as string,
        params: expect.arrayContaining([]) as unknown as MixedArray,
      };
      expect(mockExecuteQuery).toHaveBeenCalledWith(mockConnection, query);
    });

    it("should return user", async () => {
      mockExecuteQuery.mockResolvedValue(createMockData(mockUser) as never);

      const results = await testLocalProvider.testGetUserByEmail(
        mockConnection,
        mockUser.email
      );
      expect(results).toBe(mockUser);
    });

    it("should return undefined", async () => {
      mockExecuteQuery.mockResolvedValue(createMockData() as never);

      const results = await testLocalProvider.testGetUserByEmail(
        mockConnection,
        mockUser.email
      );
      expect(results).toBeUndefined();
    });
  });

  describe("userLoginHandler", () => {
    it("should throw Error when user not found", async () => {
      mockExecuteQuery.mockResolvedValue(createMockData() as never);
      try {
        await testLocalProvider.userLoginHandler(mockConnection, credentials);
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("Email or Password are incorrect");
        expect(err.code).toBe(401);
      }
    });
    it("should throw Error when theres no password, meaning registered with external method", async () => {
      mockExecuteQuery.mockResolvedValue(createMockData(mockUser) as never);
      try {
        await testLocalProvider.userLoginHandler(mockConnection, credentials);
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("You registered with a different method");
        expect(err.code).toBe(409);
      }
    });
    it("should throw Error when error comparing passwords", async () => {
      const resolvedQuery: User = {
        ...mockUser,
        password: credentials.password,
      };
      jest
        .spyOn(bcrypt, "verifyPassword")
        .mockRejectedValueOnce(new FunctionError("error", 500));
      mockExecuteQuery.mockResolvedValue(
        createMockData(resolvedQuery) as never
      );
      try {
        await testLocalProvider.userLoginHandler(mockConnection, credentials);
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("error");
        expect(err.code).toBe(500);
      }
    });
    it("should return user when succeeded", async () => {
      const resolvedQuery: User = {
        ...mockUser,
        password: credentials.password,
      };
      jest.spyOn(bcrypt, "verifyPassword").mockResolvedValueOnce(undefined);

      mockExecuteQuery.mockResolvedValue(
        createMockData(resolvedQuery) as never
      );
      const res = await testLocalProvider.userLoginHandler(
        mockConnection,
        credentials
      );
      expect(res).toStrictEqual(resolvedQuery);
    });
  });

  describe("createDefaultUserOBJ", () => {
    it("should return user object", () => {
      const res = testLocalProvider.testCreateDefaultUserOBJ(
        registrationData,
        hashedPassword
      );
      const expectedRes: Omit<User, "id"> = {
        fullName: registrationData.fullName,
        email: registrationData.email,
        password: hashedPassword,
        authProviderId: null,
        isRestaurantOwner: IsOwner.false,
        primaryAddressId: null,
      };
      expect(res).toStrictEqual(expectedRes);
    });
  });

  describe("userRegistrationHandler", () => {
    it("should throw error when hash password fails", async () => {
      jest
        .spyOn(bcrypt, "hashPassword")
        .mockRejectedValueOnce(new FunctionError("error", 500));

      try {
        await testLocalProvider.userRegistrationHandler(
          mockConnection,
          registrationData
        );
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("error");
        expect(err.code).toBe(500);
      }
    });
    it("should throw error when parseSchemaThrowZodErrors fails", async () => {
      jest.spyOn(bcrypt, "hashPassword").mockResolvedValue(hashedPassword);

      try {
        await testLocalProvider.userRegistrationHandler(mockConnection, {
          ...registrationData,
          email: "falseEmail",
        });
      } catch (error) {
        const err = error as ZodErrors;
        expect(err).toBeInstanceOf(ZodErrors);
        expect(err.code).toBe(400);
      }
    });
    it("should throw duplicate error when executeQuery fails", async () => {
      jest.spyOn(bcrypt, "hashPassword").mockResolvedValue(hashedPassword);
      mockExecuteQuery.mockRejectedValueOnce({} as never);
      try {
        await testLocalProvider.userRegistrationHandler(
          mockConnection,
          registrationData
        );
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("Email already exist.");
        expect(err.code).toBe(409);
      }
    });
    it("should return user when succeeded", async () => {
      jest.spyOn(bcrypt, "hashPassword").mockResolvedValue(hashedPassword);

      const resolvedExecute = sqlResultSetHeader(12);
      mockExecuteQuery.mockResolvedValueOnce(resolvedExecute as never);
      const userWithoutId = testLocalProvider.testCreateDefaultUserOBJ(
        registrationData,
        hashedPassword
      );
      const results = await testLocalProvider.userRegistrationHandler(
        mockConnection,
        registrationData
      );
      const expectedResults = {
        ...userWithoutId,
        id: resolvedExecute[0].insertId,
      };
      expect(results).toStrictEqual(expectedResults);
    });
  });
});
