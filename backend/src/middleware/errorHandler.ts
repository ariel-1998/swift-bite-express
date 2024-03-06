import { NextFunction, Request, Response } from "express";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { ZodErrors } from "../models/Errors/ZodErrors";
import { ZodError } from "zod";

type Errors = FunctionError | ZodErrors | ZodError | unknown;

export function handleErrorTypes(error: Errors) {
  if (error instanceof FunctionError) return error;
  if (error instanceof ZodErrors) return error;
  if (error instanceof ZodError) return new ZodErrors(error);
  else return new FunctionError("Server Error", 500);
}

export function errorHandler(
  error: Errors,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const err = handleErrorTypes(error);
  res.status(err.code).json({ message: err.message });
}
