import { v4 as uuid } from "uuid";

import { db } from "~/lib/db";
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
