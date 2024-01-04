import crypto from "crypto";
import { v4 as uuid } from "uuid";

import { db } from "~/lib/db";
import { getPasswordResetTokenByEmail } from "~/utils/password-reset-token";
import { get2FATokenByEmail } from "~/utils/two-factor-token";
import { getVerificationTokenByEmail } from "~/utils/verification-token";

export async function generateVerificationToken(email: string) {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);

  if (!!existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: { email, token, expires },
  });
  return verificationToken;
}

export async function generatePasswordResetToken(email: string) {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (!!existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: { email, token, expires },
  });
  return passwordResetToken;
}

export async function generate2FAToken(email: string) {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 300 * 1000);

  const existingToken = await get2FATokenByEmail(email);
  if (!!existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: { email, token, expires },
  });
  return twoFactorToken;
}
