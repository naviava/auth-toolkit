"use server";

import { z } from "zod";

import { db } from "~/lib/db";
import { currentUser } from "~/lib/auth";
import { getUserById } from "~/utils/users";

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

  await db.user.update({
    where: { id: user.id },
    data: { ...values },
  });
  return { success: "Settings updated!" };
}
