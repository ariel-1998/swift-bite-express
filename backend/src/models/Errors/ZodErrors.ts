import { ZodError, ZodSchema } from "zod";
import { CustomError } from "./ErrorConstructor";

export class ZodErrors extends CustomError {
  constructor(error: ZodError, code: number = 400) {
    const messageArray = error.issues.map((e) => e.message);
    super(messageArray, code, "ZodError");
  }
}

export function parseSchemaThrowZodErrors<T>(
  schema: ZodSchema<T>,
  data: T
): void {
  try {
    schema.parse(data);
  } catch (error) {
    throw new ZodErrors(error as ZodError);
  }
}
