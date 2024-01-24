import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  externalAuthProvider,
  externalAuthStrategy,
} from "../../../src/utils/strategies/externalStrategies";
import { mockProfile, mockUser } from "../../../__mocks__/models/User";
import {
  MockDbConfigModule,
  mockConnection,
} from "../../../__mocks__/utils/DB/dbConfig";
import { handleErrorTypes } from "../../../src/middleware/errorHandler";
import { FunctionError } from "../../../src/models/Errors/ErrorConstructor";
import {
  localLoginStrategy,
  localProvider,
  localSignupStrategy,
} from "../../../src/utils/strategies/localStrategy";
import { Request } from "express";

jest.mock("../../../src/utils/DB/dbConfig", () => {
  const { mockPool, mockExecuteQuery } = jest.requireActual(
    "../../../__mocks__/utils/DB/dbConfig"
  ) as MockDbConfigModule;
  return {
    pool: mockPool,
    executeQuery: mockExecuteQuery,
  };
});
const doneFn = jest.fn();
describe("passport strategies", () => {
  describe("externalAuthStrategy", () => {
    const mockedExternalAuthProvider = externalAuthProvider as jest.Mocked<
      typeof externalAuthProvider
    >;
    beforeEach(() => {
      jest.spyOn(externalAuthProvider, "getUserByProfile");
      jest.spyOn(externalAuthProvider, "createNewUserAndProvider");
    });

    it("should call done with right args user exists", async () => {
      mockedExternalAuthProvider.getUserByProfile.mockResolvedValueOnce(
        mockUser
      );
      await externalAuthStrategy("", "", mockProfile, doneFn);
      expect(doneFn).toBeCalled();
      expect(doneFn).toBeCalledWith(null, mockUser);
      expect(mockConnection.release).toHaveBeenCalled();
    });
    it("should create pool connection and begin transaction", async () => {
      mockedExternalAuthProvider.getUserByProfile.mockResolvedValueOnce(
        mockUser
      );

      await externalAuthStrategy("", "", mockProfile, doneFn);
      expect(mockConnection.beginTransaction).toHaveBeenCalled();
    });
    it("should call rollback if an error was thrown from getUserByProfile", async () => {
      const error = Error("error");
      mockedExternalAuthProvider.getUserByProfile.mockRejectedValueOnce(error);
      try {
        await externalAuthStrategy("", "", mockProfile, doneFn);
      } catch (error) {
        const err = error as FunctionError;
        expect(handleErrorTypes).toHaveBeenCalled();
        expect(handleErrorTypes).toHaveBeenCalledWith(error);
        expect(mockConnection.rollback).toHaveBeenCalled();
        expect(mockConnection.release).toHaveBeenCalled();
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("Server Error");
        expect(err.code).toBe(500);
        expect(doneFn).toHaveBeenCalled();
        expect(doneFn).toHaveBeenCalledWith(handleErrorTypes(err));
      }
    });

    it("should call createNewUserAndProvider with right params if user doesnt exist", async () => {
      mockedExternalAuthProvider.getUserByProfile.mockResolvedValueOnce(
        undefined
      );
      mockedExternalAuthProvider.createNewUserAndProvider.mockResolvedValueOnce(
        mockUser
      );
      await externalAuthStrategy("", "", mockProfile, doneFn);
      expect(
        mockedExternalAuthProvider.createNewUserAndProvider
      ).toHaveBeenCalled();
      expect(
        mockedExternalAuthProvider.createNewUserAndProvider
      ).toHaveBeenCalledWith(mockConnection, mockProfile);
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it("should call rollback if an error was thrown from createNewUserAndProvider", async () => {
      const error = new FunctionError(
        "You Signed In a with a different method.",
        409
      );
      mockedExternalAuthProvider.getUserByProfile.mockResolvedValueOnce(
        undefined
      );
      mockedExternalAuthProvider.createNewUserAndProvider.mockRejectedValueOnce(
        error
      );
      try {
        await externalAuthStrategy("", "", mockProfile, doneFn);
      } catch (error) {
        const err = error as FunctionError;
        expect(mockConnection.rollback).toBeCalled();
        expect(handleErrorTypes).toHaveBeenCalled();
        expect(handleErrorTypes).toHaveBeenCalledWith(error);
        expect(mockConnection.release).toHaveBeenCalled();
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("You Signed In a with a different method.");
        expect(err.code).toBe(409);
        expect(doneFn).toHaveBeenCalled();
        expect(doneFn).toHaveBeenCalledWith(handleErrorTypes(err));
      }
    });

    it("should commit changes if no errors", async () => {
      mockedExternalAuthProvider.getUserByProfile.mockResolvedValueOnce(
        undefined
      );
      mockedExternalAuthProvider.createNewUserAndProvider.mockResolvedValueOnce(
        mockUser
      );
      await externalAuthStrategy("", "", mockProfile, doneFn);
      expect(mockConnection.commit).toHaveBeenCalled();
      expect(mockConnection.release).toHaveBeenCalled();
    });
    it("should call done with right args if user was created", async () => {
      mockedExternalAuthProvider.getUserByProfile.mockResolvedValueOnce(
        undefined
      );
      mockedExternalAuthProvider.createNewUserAndProvider.mockResolvedValueOnce(
        mockUser
      );
      await externalAuthStrategy("", "", mockProfile, doneFn);
      expect(doneFn).toHaveBeenCalled();
      expect(doneFn).toHaveBeenCalledWith(null, mockUser);
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  describe("localStrategy", () => {
    const mockedLocalProvider = localProvider as jest.Mocked<
      typeof localProvider
    >;
    const password = "password";

    describe("localLoginStrategy", () => {
      beforeEach(() => {
        jest.spyOn(localProvider, "userLoginHandler");
      });
      it("should call done with right params in case user is exist", async () => {
        mockedLocalProvider.userLoginHandler.mockResolvedValueOnce(mockUser);
        await localLoginStrategy(mockUser.email, password, doneFn);
        expect(doneFn).toHaveBeenCalled();
        expect(doneFn).toHaveBeenCalledWith(null, mockUser);
        expect(mockConnection.release).toHaveBeenCalled;
      });

      it("should coll done with error", async () => {
        const error = new FunctionError("Email or Password are incorrect", 401);
        mockedLocalProvider.userLoginHandler.mockRejectedValueOnce(error);
        try {
          await localLoginStrategy(mockUser.email, password, doneFn);
        } catch (error) {
          const err = error as FunctionError;
          expect(error).toBeDefined();
          expect(err).toBeInstanceOf(FunctionError);
          expect(err.code).toBe(401);
          expect(err.message).toBe("Email or Password are incorrect");
          expect(mockConnection.release).toHaveBeenCalled();
          expect(handleErrorTypes).toHaveBeenCalled();
          expect(handleErrorTypes).toHaveBeenCalledWith(err);
          expect(doneFn).toHaveBeenCalled();
          expect(doneFn).toHaveBeenCalledWith(handleErrorTypes(err));
        }
      });
    });

    describe("localSignupStrategy", () => {
      beforeEach(() => {
        jest.spyOn(localProvider, "userRegistrationHandler");
      });
      const fullName = "fullName";
      const req = { body: { fullName } } as Request;
      it("should call done with right params when user created", async () => {
        mockedLocalProvider.userRegistrationHandler.mockResolvedValueOnce(
          mockUser
        );
        await localSignupStrategy(req, mockUser.email, password, doneFn);
        expect(mockConnection.commit).toHaveBeenCalled();
        expect(doneFn).toHaveBeenCalled();
        expect(doneFn).toHaveBeenCalledWith(null, mockUser);
        expect(mockConnection.release).toHaveBeenCalled();
      });
      it("should call done with right params when error was thrown", async () => {
        const error = Error("error");
        mockedLocalProvider.userRegistrationHandler.mockRejectedValueOnce(
          error
        );
        try {
          await localSignupStrategy(req, mockUser.email, password, doneFn);
        } catch (error) {
          const err = error as FunctionError;
          expect(err).toBeInstanceOf(FunctionError);
          expect(err.message).toBe("Server Error");
          expect(err.code).toBe(500);
          expect(doneFn).toHaveBeenCalled();
          expect(doneFn).toHaveBeenCalledWith(err);
          expect(handleErrorTypes).toHaveBeenCalled();
          expect(handleErrorTypes).toHaveBeenCalledWith(err);
          expect(mockConnection.rollback).toHaveBeenCalled();
          expect(mockConnection.release).toHaveBeenCalled();
        }
      });
    });
  });
});
