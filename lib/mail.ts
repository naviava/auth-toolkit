import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: "info@fondingo.com",
    to: email,
    subject: "Confirm your email address",
    html: `<p><a href="${confirmLink}">Click here</a> to confirm your email address.</p>`,
  });
}
