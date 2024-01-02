import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { loginSchema } from "./schemas";
import { getUserByEmail } from "./utils/users";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const doPasswordsMatch = await compare(password, user.password);
          if (doPasswordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
