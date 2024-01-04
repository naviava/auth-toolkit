"use server";

import { z } from "zod";
import { AuthError } from "next-auth";

import { db } from "~/lib/db";
import { signIn } from "~/auth";
import { getUserByEmail } from "~/utils/users";
import { get2FATokenByEmail } from "~/utils/two-factor-token";
import { sendVerificationEmail, send2FATokenEmail } from "~/lib/mail";
import { generateVerificationToken, generate2FAToken } from "~/lib/tokens";

import { loginSchema } from "~/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "~/routes";
import { get2FAConfirmationByUserId } from "../two-factor-confirmation";

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { success: "Confirmation email sent!" };
  }

  if (existingUser.is2FAEnabled && !!existingUser.email) {
    if (!!code) {
      const twoFactorToken = await get2FATokenByEmail(existingUser.email);

      if (!twoFactorToken) return { error: "Invalid code" };
      if (twoFactorToken.token !== code) return { error: "Invalid code" };
      if (twoFactorToken.expires < new Date()) return { error: "Code expired" };

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await get2FAConfirmationByUserId(
        existingUser.id,
      );
      if (!!existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }
      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const twoFactorToken = await generate2FAToken(existingUser.email);
      await send2FATokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}
