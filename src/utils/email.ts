import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const defaultFrom = process.env.EMAIL_FROM || "CareerOS AI <onboarding@resend.dev>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Reusable utility to send emails.
 * Uses try/catch so it never interrupts the main execution flow if it fails.
 */
export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  try {
    if (!resend) {
      console.warn("⚠️ RESEND_API_KEY is not set. Email blocked:");
      console.warn(`[To: ${to}] [Subject: ${subject}]`);
      return false; // Fail silently but log it
    }

    const { error } = await resend.emails.send({
      from: defaultFrom,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      return false;
    }

    console.log(`✅ Email sent successfully to ${to} (Subject: ${subject})`);
    return true;

  } catch (err) {
    console.error("❌ Unexpected error while sending email:", err);
    return false; // Never throw to prevent disrupting the main user action
  }
}
