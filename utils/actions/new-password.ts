"use server";

import { z } from "zod";
import { hash } from "bcryptjs";

import { getUserByEmail } from "~/utils/users";
import { getPasswordResetTokenByToken } from "~/utils/password-reset-token";

import { newPasswordSchema } from "~/schemas";
import { db } from "~/lib/db";

export async function newPassword(
  values: z.infer<typeof newPasswordSchema>,
  token: string | null,
) {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = newPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasTokenExpired = new Date() > existingToken.expires;
  if (hasTokenExpired) {
    return { error: "Token expired!" };
  }

  const exisitingUser = await getUserByEmail(existingToken.email);
  if (!exisitingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await hash(password, 10);
  await db.user.update({
    where: { id: exisitingUser.id },
    data: { password: hashedPassword },
  });
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });
  return { success: "Password updated!" };
}
