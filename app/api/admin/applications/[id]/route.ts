import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["受付済", "確認中", "書類通過", "面接中", "終了"] as const;

async function requireAdmin() {
  const me = await getCurrentMember();
  if (!me) return { error: NextResponse.json({ error: "unauthenticated" }, { status: 401 }) };
  if (!me.isAdmin) return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  return { me };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;

  const body = (await req.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status ?? "";
  if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("applications").update({ status }).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
