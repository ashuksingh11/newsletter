// Email sending service.
// Currently runs in "mock mode" — logs to the console instead of
// actually sending emails. To enable real emails:
//   1. Sign up at resend.com
//   2. Add RESEND_API_KEY to your .env file
//
// This separation means the rest of the app doesn't need to know
// HOW emails are sent — it just calls sendEmail().

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

type SendResult = {
  success: boolean;
  error?: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  // If no API key is configured, use mock mode
  if (!apiKey) {
    console.log(`[MOCK EMAIL] To: ${to}`);
    console.log(`[MOCK EMAIL] Subject: ${subject}`);
    console.log(`[MOCK EMAIL] Body: ${html.substring(0, 100)}...`);
    return { success: true };
  }

  // Real mode — send via Resend's REST API.
  // fetch() works on the server too, not just in browsers.
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "newsletter@example.com",
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to send email" };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Network error sending email" };
  }
}

// Send the same email to multiple recipients.
// Returns how many succeeded and how many failed.
export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  // Send emails one at a time to avoid rate limiting.
  // In production, you'd use a queue system for large lists.
  for (const email of recipients) {
    const result = await sendEmail({ to: email, subject, html });
    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}
