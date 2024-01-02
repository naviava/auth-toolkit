"use server";

import { z } from "zod";
import { registerSchema } from "~/schemas";

export async function register(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  return { success: "Email sent!" };
}
