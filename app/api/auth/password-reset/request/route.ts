import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { findUserByEmail } from "@/lib/auth";
import { escapeHtml, sendMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_MINUTES = 30;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";

  if (!email) return NextResponse.json({ error: "メールアドレスを入力してください。" }, { status: 400 });

  // Always respond success to prevent email enumeration.
  const user = await findUserByEmail(email);
  if (!user) return NextResponse.json({ ok: true });

  const supabase = createSupabaseServerClient();
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TTL_MINUTES * 60 * 1000).toISOString();

  const { error } = await supabase.from("password_reset_tokens").insert({
    token,
    user_id: user.id,
    expires_at: expiresAt,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const url = `${base}/password-reset/confirm?token=${encodeURIComponent(token)}`;

  await sendMail({
    to: user.email,
    subject: "[ACEキャリア] パスワード再発行のご案内",
    html: `
      <p>${escapeHtml(user.name)} 様</p>
      <p>以下のリンクから、新しいパスワードを設定してください（有効期限: ${TTL_MINUTES}分）。</p>
      <p><a href="${url}">${url}</a></p>
      <p>このメールに心当たりがない場合は、破棄してください。</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
