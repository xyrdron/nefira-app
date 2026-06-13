import bcrypt from "bcrypt";

// Hash plaintext password for registration
export async function saltAndHashPassword(
  plainPassword: string,
): Promise<string> {
  const saltRounds = 10;

  return await bcrypt.hash(plainPassword, saltRounds);
}

// Compare plaintext password with stored hash (used during login)
export async function verifyPassword(
  plainPassword: string,
  hash: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hash);
  } catch {
    return false;
  }
}
