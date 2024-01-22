import { describe, it, expect } from "@jest/globals";
import {
  ZodErrors,
  parseSchemaThrowZodErrors,
} from "../../../src/models/Errors/ZodErrors";
import { AuthProvider, authProvider } from "../../../src/models/AuthProvider";

const auth: Omit<AuthProvider, "id"> & { id: number } = {
  id: 12,
  provider: "google",
  providerUserId: "sad",
};

describe("test zod schema parser function", () => {
  it("should throw ZodErrors properly", () => {
    try {
      parseSchemaThrowZodErrors(authProvider, auth as unknown);
    } catch (error) {
      expect(error).toBeInstanceOf(ZodErrors);
    }
  });

  it("ZodErros sould have right properties", () => {
    try {
      parseSchemaThrowZodErrors(authProvider, auth as unknown);
    } catch (error) {
      expect((error as ZodErrors).code).toBe(400);
      expect((error as ZodErrors).message).toEqual(expect.arrayContaining([]));
    }
  });

  it("should NOT throw error", () => {
    const validObj = { ...auth, id: "sting" };
    try {
      parseSchemaThrowZodErrors(authProvider, validObj);
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});
