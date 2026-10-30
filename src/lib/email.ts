// Sends the course sign-in link through Resend. The sender address is set by EMAIL_FROM.

export async function sendSignInLink(to: string, link: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #0A1C33; max-width: 480px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 20px; font-weight: 800; margin: 0 0 16px;">Save your Own Your 24 progress</p>
      <p style="font-size: 16px; line-height: 1.5;">Tap the button below to save your progress. Then you can pick up where you left off on any device.</p>
      <p style="margin: 28px 0;">
        <a href="${link}" style="background: #2ED4E8; color: #0A1C33; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 999px; display: inline-block;">Save my progress</a>
      </p>
      <p style="font-size: 14px; line-height: 1.5; color: #5B6B80;">This link works for 30 minutes. If you didn't ask for it, you can ignore this email.</p>
      <p style="font-size: 14px; color: #5B6B80;">Brittany, Unbound24</p>
    </div>`;
  const text = `Save your Own Your 24 progress\n\nOpen this link to save your progress. Then you can pick up where you left off on any device:\n${link}\n\nThis link works for 30 minutes. If you didn't ask for it, you can ignore this email.\n\nBrittany, Unbound24`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Brittany at Unbound24 <course@unbound24.com>",
      to,
      subject: "Your Own Your 24 sign-in link",
      html,
      text,
    }),
  });
  if (!response.ok) throw new Error(`Resend failed: ${response.status}`);
}
