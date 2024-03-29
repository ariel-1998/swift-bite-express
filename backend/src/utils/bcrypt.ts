import bcrypt from "bcrypt";
import { FunctionError } from "../models/Errors/ErrorConstructor";

export const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    throw new FunctionError("Error hashing password", 500);
  }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    if (!result) {
      throw new FunctionError("Incorrect Credentials", 401);
    }
  } catch (error) {
    if (error instanceof FunctionError) throw error;
    throw new FunctionError("Error comparing passwords", 500);
  }
}
