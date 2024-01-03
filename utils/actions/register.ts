"use server";

import { z } from "zod";
import { hash } from "bcryptjs";

import { registerSchema } from "~/schemas";
import { db } from "~/lib/db";
import { getUserByEmail } from "~/utils/users";

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

  // TODO: Send verification token email

  return { success: "Email sent!" };
}
