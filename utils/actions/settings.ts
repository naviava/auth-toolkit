"use server";

import { z } from "zod";
import { compare, hash } from "bcryptjs";

import { db } from "~/lib/db";
import { currentUser } from "~/lib/auth";
import { sendVerificationEmail } from "~/lib/mail";
import { generateVerificationToken } from "~/lib/tokens";
import { getUserByEmail, getUserById } from "~/utils/users";

import { settingsSchema } from "~/schemas";

export async function settings(values: z.infer<typeof settingsSchema>) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized!" };
  }

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized!" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.is2FAEnabled = undefined;
  }

  if (!!values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (!!existingUser && existingUser.id !== user.id) {
      return { error: "Email already exists!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { success: "Email updated! Please verify your new email." };
  }

  if (!!values.password && !!values.newPassword && !!dbUser.password) {
    const doPasswordsMatch = await compare(values.password, dbUser.password);
    if (!doPasswordsMatch) {
      return { error: "Wrong password!" };
    }

    const hashedPassword = await hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: user.id },
    data: { ...values },
  });
  return { success: "Settings updated!" };
}
