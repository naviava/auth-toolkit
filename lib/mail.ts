import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: "verify@fondingo.com",
    to: email,
    subject: "Confirm your email address",
    html: `<p><a href="${confirmLink}">Click here</a> to confirm your email address.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
  await resend.emails.send({
    from: "reset@fondingo.com",
    to: email,
    subject: "Reset your password",
    html: `<p><a href="${resetLink}">Click here</a> to reset your password.</p>`,
  });
}
