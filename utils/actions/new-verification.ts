"use server";

import { db } from "~/lib/db";
import { getUserByEmail } from "~/utils/users";
import { getVerificationTokenByToken } from "~/utils/verification-token";

export async function newVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) return { error: "Token not found" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Email does not exist" };

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      email: existingToken.email,
      emailVerified: new Date(),
    },
  });
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified" };
}
