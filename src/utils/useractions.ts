"use server";

import { prisma } from "@/lib/prisma";

/**
 * Find a user by email in the database
 */
export async function getUserFromDb(email: string, passwordHash: string) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      //@ts-ignore
      where: { email, password: passwordHash },
    });

    return user;
  } catch {
    return null;
  }
}
