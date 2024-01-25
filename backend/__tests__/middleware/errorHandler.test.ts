import { describe, it, expect } from "@jest/globals";
import { handleErrorTypes } from "../../src/middleware/errorHandler";
import { FunctionError } from "../../src/models/Errors/ErrorConstructor";
import { ZodError } from "zod";
import { ZodErrors } from "../../src/models/Errors/ZodErrors";

describe("handleErrorTypes", () => {
  it("should return server Error if not type Errors", () => {
    const error = Error("error");
    const err = handleErrorTypes(error);
    expect(err).toBeInstanceOf(FunctionError);
    expect(err.message).toBe("Server Error");
    expect(err.code).toBe(500);
  });
  it("should return initial Error if instanceof FunctionError", () => {
    const message = "error";
    const code = 400;
    const error = new FunctionError(message, code);
    const err = handleErrorTypes(error);
    expect(err).toBeInstanceOf(FunctionError);
    expect(err.message).toBe(message);
    expect(err.code).toBe(code);
  });
  it("should return ZodErrors if instanceof ZodError", () => {
    const error = new ZodError([]);
    const err = handleErrorTypes(error);
    expect(err).toBeInstanceOf(ZodErrors);
    expect(err.message).toEqual(expect.arrayContaining([]));
    expect(err.code).toBe(400);
  });
  it("should return server Error if not type Errors", () => {
    const message = "hello";
    const error = new ZodErrors({ issues: [{ message }] } as ZodError, 400);
    const err = handleErrorTypes(error);
    expect(err).toBeInstanceOf(ZodErrors);
    expect(err.message).toEqual(expect.arrayContaining([message]));
    expect(err.code).toBe(400);
  });
});

// describe("errorHandler", () => {
//   const req = {} as Request;
//   const res = {
//     status: (code: number) => {
//       return { json: (message: unknown) => res };
//     },
//   } as Response;
//   it("should run handleErrorTypes to clarify the error", () => {
//     const expectedError = handleErrorTypes(Error);
//     const err = errorHandler(Error, req, res, jest.fn());
//     expect(err).toStrictEqual(expectedError);
//   });
// });

// export function errorHandler(
//     error: Errors,
//     req: Request,
//     res: Response,
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     next: NextFunction
//   ) {
//     const err = handleErrorTypes(error);
//     res.status(err.code).json(err.message);
//   }
