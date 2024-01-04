"use server";

import { z } from "zod";
import { resetSchema } from "~/schemas";
import { getUserByEmail } from "../users";

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

  // TODO: Generate token and send email.
  return { success: "Reset email sent!" };
}
