// Sends email via Resend HTTP API when RESEND_API_KEY is set.
// Falls back to console.log — useful in development without a provider.

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export async function sendMail(args: SendArgs): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = args.from || process.env.MAIL_FROM || "ACE Career <noreply@acecareer.jp>";
  const to = Array.isArray(args.to) ? args.to : [args.to];

  if (!apiKey) {
    console.log("[mail:fallback]", { to, subject: args.subject, text: args.text ?? stripHtml(args.html) });
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject: args.subject,
        html: args.html,
        text: args.text ?? stripHtml(args.html),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) return { ok: false, error: data?.message ?? `HTTP ${res.status}` };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown error" };
  }
}

export function adminEmail(): string | null {
  return process.env.ADMIN_NOTIFICATION_EMAIL ?? "Admin@gmail.com";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
