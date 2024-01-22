import { describe, it, expect, jest } from "@jest/globals";
import {
  SALT_ROUNDS,
  hashPassword,
  verifyPassword,
} from "../../src/utils/bcrypt";
import { FunctionError } from "../../src/models/Errors/ErrorConstructor";
import { mockBcrypt } from "../../__mocks__/utils/bcrypt";
jest.mock("bcrypt");

const password = "password";

describe("bcrypt functions", () => {
  describe("hashPassword", () => {
    it("should run bcrypt.hash with right params", async () => {
      mockBcrypt.hash.mockResolvedValueOnce("randomString" as never);
      await hashPassword(password);
      expect(mockBcrypt.hash).toHaveBeenCalled();
      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, SALT_ROUNDS);
    });
    it("should return hashed password", async () => {
      mockBcrypt.hash.mockResolvedValueOnce("randomString" as never);
      const res = await hashPassword(password);
      expect(res).toEqual(expect.any(String));
    });
    it("should return FunctionError", async () => {
      mockBcrypt.hash.mockRejectedValueOnce({} as never);
      try {
        await hashPassword(password);
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("Error hashing password");
        expect(err.code).toBe(500);
      }
    });
  });

  describe("verifyPassword", () => {
    const hashedPassword = "hashedPassword";
    it("should run bcrypt.compare with right params", async () => {
      mockBcrypt.compare.mockResolvedValueOnce(true as never);
      await verifyPassword(password, hashedPassword);
      expect(mockBcrypt.compare).toHaveBeenCalled();
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
    it("should return true", async () => {
      mockBcrypt.compare.mockResolvedValueOnce(true as never);
      await expect(
        verifyPassword(password, hashedPassword)
      ).resolves.not.toThrow();
    });
    it("should throw error in false compare false", async () => {
      mockBcrypt.compare.mockResolvedValueOnce(false as never);
      try {
        await verifyPassword(password, hashedPassword);
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("Incorrect Credentials");
        expect(err.code).toBe(401);
      }
    });
    it("should throw error on compare server Error", async () => {
      mockBcrypt.compare.mockRejectedValueOnce({} as never);
      try {
        await verifyPassword(password, hashedPassword);
      } catch (error) {
        const err = error as FunctionError;
        expect(err).toBeInstanceOf(FunctionError);
        expect(err.message).toBe("Error comparing passwords");
        expect(err.code).toBe(500);
      }
    });
  });
});
