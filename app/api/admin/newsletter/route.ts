import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { sendMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const me = await getCurrentMember();
  if (!me) return { error: NextResponse.json({ error: "unauthenticated" }, { status: 401 }) };
  if (!me.isAdmin) return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  return { me };
}

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscribers: data ?? [] });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;

  const body = (await req.json().catch(() => null)) as { subject?: string; html?: string } | null;
  const subject = (body?.subject ?? "").trim();
  const html = (body?.html ?? "").trim();
  if (!subject || !html) {
    return NextResponse.json({ error: "件名と本文は必須です。" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .is("unsubscribed_at", null);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const recipients = (data ?? []).map((r) => r.email as string).filter(Boolean);
  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  let failed = 0;
  for (const to of recipients) {
    const res = await sendMail({ to, subject, html });
    if (res.ok) sent++;
    else failed++;
  }
  return NextResponse.json({ sent, failed, total: recipients.length });
}
