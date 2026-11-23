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

// Tells Brittany a Brand Guide lead asked for a mock up (2026-11-17). Goes only to LEAD_ALERT_TO.
// Until unbound24.com is verified in Resend, it sends from Resend's onboarding@resend.dev, which only delivers to the
// Resend account's own address (so sign up to Resend with the LEAD_ALERT_TO address). Set LEAD_ALERT_FROM once the
// domain is verified. Returns false instead of throwing: a missed alert must never lose the lead.
export async function sendLeadAlert(lead: { name: string; email: string; business: string; guide: string; notionUrl?: string; due: string; photos: number }) {
  if (!process.env.RESEND_API_KEY || !process.env.LEAD_ALERT_TO) return false;
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const who = lead.business ? `${lead.name} (${lead.business})` : lead.name;
  const photos = lead.photos ? `${lead.photos} photo${lead.photos === 1 ? "" : "s"} for the mock up (in Notion).` : "No photos sent.";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; max-width: 560px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 20px; font-weight: 800; margin: 0 0 12px;">New mock up request</p>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 4px;"><b>${esc(who)}</b>, ${esc(lead.email)}</p>
      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px;">The site promised a website mock up, review strategy, social media plan and SEO/AEO plan within 3 days: due <b>${esc(lead.due)}</b>. ${photos}</p>
      ${lead.notionUrl ? `<p style="margin: 0 0 20px;"><a href="${esc(lead.notionUrl)}" style="background: #03c0e8; color: #111; font-weight: 800; text-decoration: none; padding: 12px 22px; border-radius: 999px; display: inline-block;">Open the lead in Notion</a></p>` : ""}
      <p style="font-size: 13px; color: #555; margin: 0 0 6px;">Their brand guide:</p>
      <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; background: #f8f0e3; padding: 16px; border-radius: 12px;">${esc(lead.guide)}</pre>
    </div>`;
  const text = `New mock up request\n\n${who}, ${lead.email}\nDue ${lead.due} (the site promised within 3 days). ${photos}\n${lead.notionUrl ? `Notion: ${lead.notionUrl}\n` : ""}\nTheir brand guide:\n\n${lead.guide}`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_ALERT_FROM ?? "Unbound24 site <onboarding@resend.dev>",
        to: process.env.LEAD_ALERT_TO,
        reply_to: lead.email,
        subject: `Mock up request: ${who}`,
        html,
        text,
      }),
    });
    if (!response.ok) console.error("lead alert failed", response.status, await response.text().catch(() => ""));
    return response.ok;
  } catch (err) {
    console.error("lead alert failed", err);
    return false;
  }
}
