import { describe, it, expect } from "@jest/globals";
import { TransactionQuery } from "../../../src/utils/DB/dbConfig";
import {
  createMockData,
  mockConnection,
  mockExecuteQuery,
  sqlResultSetHeader,
} from "../../../__mocks__/utils/DB/dbConfig";
import { testExternalAuthProvider } from "../../../__mocks__/utils/strategies/externalStrategies";
import {
  AuthProvider,
  ProviderLiterals,
} from "../../../src/models/AuthProvider";
import { Role, User } from "../../../src/models/User";
import { FunctionError } from "../../../src/models/Errors/ErrorConstructor";
import { mockProfile, mockUser } from "../../../__mocks__/models/User";
import { mockProviderData } from "../../../__mocks__/models/AuthProvider";

describe("externalAuthProvider", () => {
  //queryProviderData
  describe("queryProviderData", () => {
    it("should to call executeQuery", async () => {
      mockExecuteQuery.mockResolvedValueOnce(createMockData() as never);

      await testExternalAuthProvider.testQueryProviderData(
        mockConnection,
        mockProfile
      );
      expect(mockExecuteQuery).toHaveBeenCalled();
    });

    it("should call executeQuery with right args", async () => {
      const resolvedData = createMockData();
      mockExecuteQuery.mockResolvedValueOnce(resolvedData as never);
      await testExternalAuthProvider.testQueryProviderData(
        mockConnection,
        mockProfile
      );
      expect(mockExecuteQuery).toHaveBeenCalledWith(mockConnection, {
        params: [mockProfile.provider, mockProfile.id],
        query: expect.any(String) as unknown as string,
      } as TransactionQuery);
    });

    it("should return the expected AuthProvider obj", async () => {
      const resolvedData = createMockData(mockProviderData);
      mockExecuteQuery.mockResolvedValueOnce(resolvedData as never);
      const results = await testExternalAuthProvider.testQueryProviderData(
        mockConnection,
        mockProfile
      );
      expect(results).toBe(resolvedData[0][0]);
    });

    it("should return undefined", async () => {
      const resolvedData = createMockData();
      mockExecuteQuery.mockResolvedValueOnce(resolvedData as never);
      const results = await testExternalAuthProvider.testQueryProviderData(
        mockConnection,
        mockProfile
      );
      expect(results).toBeUndefined();
    });
  });
  //getUserByProfile
  describe("getUserByProfile", () => {
    it("should run executeQuery with right args", async () => {
      const resolvedData = createMockData();
      mockExecuteQuery.mockResolvedValueOnce(resolvedData as never);
      await testExternalAuthProvider.testGetUserByAuthProviderId(
        mockConnection,
        mockUser.authProviderId!
      );
      const params = [mockUser.authProviderId];
      const query = expect.any(String) as unknown as string;
      const q: TransactionQuery = { params, query };
      expect(mockExecuteQuery).toHaveBeenCalledWith(mockConnection, q);
    });

    it("should return User", async () => {
      const resolvedData = createMockData(mockUser);
      mockExecuteQuery.mockResolvedValueOnce(resolvedData as never);
      const results =
        await testExternalAuthProvider.testGetUserByAuthProviderId(
          mockConnection,
          mockUser.authProviderId!
        );
      expect(results).toBe(resolvedData[0][0]);
    });
    it("should return undefined", async () => {
      const resolvedData = createMockData();
      mockExecuteQuery.mockResolvedValueOnce(resolvedData as never);
      const results =
        await testExternalAuthProvider.testGetUserByAuthProviderId(
          mockConnection,
          "someId"
        );
      expect(results).toBeUndefined();
    });
  });
  //getUserByProfile
  describe("getUserByProfile", () => {
    it("should call executeQuery once and return undefined", async () => {
      const resolvedProviderData = createMockData();
      mockExecuteQuery.mockResolvedValueOnce(resolvedProviderData as never);
      const result = await testExternalAuthProvider.getUserByProfile(
        mockConnection,
        mockProfile
      );
      expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
    it("should call executeQuery twice and return undefined", async () => {
      const resolvedProviderData = createMockData(mockProviderData);
      const resolvedUserData = createMockData(); //mockUser
      mockExecuteQuery
        .mockResolvedValueOnce(resolvedProviderData as never)
        .mockResolvedValueOnce(resolvedUserData as never);

      const result = await testExternalAuthProvider.getUserByProfile(
        mockConnection,
        mockProfile
      );
      expect(mockExecuteQuery).toHaveBeenCalledTimes(2);
      expect(result).toBeUndefined();
    });
    it("should call executeQuery twice and return user", async () => {
      const resolvedProviderData = createMockData(mockProviderData);
      const resolvedUserData = createMockData(mockUser);
      mockExecuteQuery
        .mockResolvedValueOnce(resolvedProviderData as never)
        .mockResolvedValueOnce(resolvedUserData as never);

      const result = await testExternalAuthProvider.getUserByProfile(
        mockConnection,
        mockProfile
      );
      expect(mockExecuteQuery).toHaveBeenCalledTimes(2);
      expect(result).toBe(mockUser);
    });
  });
  //createDefaultProviderOBJ
  describe("createDefaultProviderOBJ", () => {
    it("should return AuthProvider obj", () => {
      const id = "someId";
      const result = testExternalAuthProvider.testCreateDefaultProviderOBJ(
        mockProfile,
        id
      );
      const expectedObj: AuthProvider = {
        id,
        provider: mockProfile.provider as ProviderLiterals,
        providerUserId: mockProfile.id,
      };
      expect(result).toStrictEqual(expectedObj);
    });
  });
  describe("generateAutProviderIdForDB", () => {
    it("should return id string with provider and provider.id", () => {
      const results =
        testExternalAuthProvider.testGenerateAuthProviderIdForDB(mockProfile);
      expect(results).toEqual(`${mockProfile.provider}-${mockProfile.id}`);
    });
  });

  //addProviderDataToDB
  describe("addProviderDataToDB", () => {
    it("should return generated id", async () => {
      const generatedId =
        testExternalAuthProvider.testGenerateAuthProviderIdForDB(mockProfile);
      const result = await testExternalAuthProvider.testAddProviderDataToDB(
        mockConnection,
        mockProfile
      );
      expect(result).toBe(generatedId);
    });
  });

  describe("createDefaultUserOBJ", () => {
    it("should return user object without id", () => {
      const id = "someID";
      const userObj = testExternalAuthProvider.testCreateDefaultUserOBJ(
        mockProfile,
        id
      );
      const expectedData: Omit<User, "id"> = {
        fullName: mockProfile.displayName,
        authProviderId: id,
        primaryAddressId: null,
        password: null,
        role: Role.user,
        email: mockProfile._json.email!,
      };
      expect(userObj).toStrictEqual(expectedData);
    });
  });
  describe("addUserDataToDB", () => {
    const generatedId =
      testExternalAuthProvider.testGenerateAuthProviderIdForDB(mockProfile);
    it("should return user", async () => {
      const userObj = testExternalAuthProvider.testCreateDefaultUserOBJ(
        mockProfile,
        generatedId
      );
      const data = sqlResultSetHeader();

      mockExecuteQuery.mockResolvedValueOnce(data as never);
      const expectedObj: User = {
        ...userObj,
        id: data[0].insertId,
      };
      const result = await testExternalAuthProvider.testAddUserDataToDB(
        mockConnection,
        mockProfile,
        generatedId
      );
      expect(result).toStrictEqual(expectedObj);
    });

    it("should throw 409 error", () => {
      mockExecuteQuery.mockRejectedValueOnce({} as never);
      testExternalAuthProvider
        .testAddUserDataToDB(mockConnection, mockProfile, generatedId)
        .catch((err: FunctionError) => {
          expect(err).toBeInstanceOf(FunctionError);
          expect(err.message).toBe("You Signed In a with a different method.");
          expect(err.code).toBe(409);
        });
    });
  });
  describe("createNewUserAndProvider", () => {
    it("should return user, and run executeQuery 2 times with right params", async () => {
      const rows = sqlResultSetHeader();
      mockExecuteQuery.mockResolvedValue(rows as never);

      const insertId = rows[0].insertId;

      const res = await testExternalAuthProvider.createNewUserAndProvider(
        mockConnection,
        mockProfile
      );

      const expectedRes: User = {
        ...mockUser,
        id: insertId,
        authProviderId: expect.any(String) as unknown as string,
      };
      expect(res).toStrictEqual(expectedRes);
      expect(mockExecuteQuery).toBeCalledTimes(2);
    });
  });
});
