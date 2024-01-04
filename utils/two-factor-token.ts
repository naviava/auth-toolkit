import { db } from "~/lib/db";

export async function get2FATokenByToken(token: string) {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
}

export async function get2FATokenByEmail(email: string) {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
}
