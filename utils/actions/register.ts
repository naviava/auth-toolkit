"use server";

import { z } from "zod";
import { hash } from "bcryptjs";

import { db } from "~/lib/db";
import { getUserByEmail } from "~/utils/users";
import { generateVerificationToken } from "~/lib/tokens";

import { registerSchema } from "~/schemas";

export async function register(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (!!existingUser) return { error: "Email already in use" };

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  // TODO: Send email with verification token.

  return { success: "Confirmation email sent!" };
}
