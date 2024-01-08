import bcrypt from "bcrypt";
const saltRounds = 10;

export async function hashPassword(password: string) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

export async function verifyPassword(passwoed: string, hashedPassword: string) {
  try {
    const result = await bcrypt.compare(passwoed, hashedPassword);
    return result;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
}
