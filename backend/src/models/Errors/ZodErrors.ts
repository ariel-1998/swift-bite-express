import { ZodError, ZodSchema } from "zod";
import { CustomError } from "./ErrorConstructor";
import { handleErrorTypes } from "../../middleware/errorHandler";

// interface ZodIssuesModel {
//   issues: { message: string }[];
// }

export class ZodErrors extends CustomError {
  constructor(error: ZodError, code: number = 401) {
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
    const handledError = handleErrorTypes(error);
    throw handledError;
  }
}
