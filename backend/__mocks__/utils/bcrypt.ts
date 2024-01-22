import { jest } from "@jest/globals";
import bcrypt from "bcrypt";

export const mockBcrypt = {
  hash: bcrypt.hash as jest.Mock,
  compare: bcrypt.compare as jest.Mock,
};
