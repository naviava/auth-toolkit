"use server";

import { z } from "zod";

import { getUserByEmail } from "~/utils/users";
import { generatePasswordResetToken } from "~/lib/tokens";

import { resetSchema } from "~/schemas";
import { sendPasswordResetEmail } from "~/lib/mail";

export async function reset(values: z.infer<typeof resetSchema>) {
  const validatedFields = resetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Email not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );
  return { success: "Reset email sent!" };
}
