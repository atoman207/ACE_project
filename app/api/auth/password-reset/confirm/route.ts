import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { token?: string; password?: string } | null;
  const token = body?.token ?? "";
  const password = body?.password ?? "";

  if (!token || !password) {
    return NextResponse.json({ error: "token と password は必須です。" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "パスワードは6文字以上で入力してください。" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("password_reset_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json({ error: "トークンが無効です。" }, { status: 400 });
  }
  if (row.used_at) {
    return NextResponse.json({ error: "このリンクは既に使用されています。" }, { status: 400 });
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "リンクの有効期限が切れています。" }, { status: 400 });
  }

  const password_hash = await hashPassword(password);
  const { error: updErr } = await supabase
    .from("users")
    .update({ password_hash })
    .eq("id", row.user_id);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  await supabase
    .from("password_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token);

  return NextResponse.json({ ok: true });
}
