import { describe, it, expect, jest } from "@jest/globals";
import { Request, Response } from "express";
import { mockUser } from "../../__mocks__/models/User";
import {
  verifyAuthMiddleware,
  verifyUser,
} from "../../src/middleware/verifyAuth";
import { FunctionError } from "../../src/models/Errors/ErrorConstructor";

const next = jest.fn();
const reqWithUser = { user: mockUser } as Request;
const reqWithoutUser = {} as Request;

describe("verifyAuthMiddleware", () => {
  const res = {} as Response;
  it("should return next with No error", () => {
    try {
      verifyAuthMiddleware(reqWithUser, res, next);
      expect(next).toHaveBeenCalled();
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
  it("should return next With Error", () => {
    try {
      verifyAuthMiddleware(reqWithoutUser, res, next);
    } catch (error) {
      const err = error as FunctionError;
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(FunctionError);
      expect(err.message).toBe("UnAuouthorized, Please Login");
      expect(err.code).toBe(403);
    }
  });
});

describe("verifyUser", () => {
  it("should return void", () => {
    try {
      verifyUser(reqWithUser);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
  it("should throw error", () => {
    try {
      verifyUser(reqWithoutUser);
    } catch (error) {
      const err = error as FunctionError;
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(FunctionError);
      expect(err.message).toBe("Unauthorized, Please Login.");
      expect(err.code).toBe(401);
    }
  });
});
