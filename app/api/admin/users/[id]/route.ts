import { NextResponse } from "next/server";
import { getCurrentMember, hashPassword, rowToMember } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { ActuaryQualification } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QUALIFICATIONS: ActuaryQualification[] = ["未取得", "研究会員", "準会員", "正会員"];

async function requireAdmin() {
  const me = await getCurrentMember();
  if (!me) return { error: NextResponse.json({ error: "unauthenticated" }, { status: 401 }) };
  if (!me.isAdmin) return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  return { me };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;

  const body = (await req.json().catch(() => null)) as
    | {
        email?: string;
        password?: string;
        name?: string;
        phone?: string;
        age?: number;
        years?: number;
        currentCompany?: string;
        qualification?: ActuaryQualification;
        otherQualifications?: string;
        isAdmin?: boolean;
        avatarUrl?: string | null;
      }
    | null;

  const patch: Record<string, unknown> = {};
  if (typeof body?.email === "string" && body.email.trim()) patch.email = body.email.trim().toLowerCase();
  if (typeof body?.name === "string" && body.name.trim()) patch.name = body.name.trim();
  if (typeof body?.phone === "string") patch.phone = body.phone;
  if (typeof body?.age === "number") patch.age = body.age;
  if (typeof body?.years === "number") patch.years = body.years;
  if (typeof body?.currentCompany === "string") patch.current_company = body.currentCompany;
  if (QUALIFICATIONS.includes(body?.qualification as ActuaryQualification)) patch.qualification = body!.qualification;
  if (typeof body?.otherQualifications === "string") patch.other_qualifications = body.otherQualifications;
  if (typeof body?.isAdmin === "boolean") patch.is_admin = body.isAdmin;
  if (body?.avatarUrl === null || typeof body?.avatarUrl === "string") patch.avatar_url = body.avatarUrl;
  if (typeof body?.password === "string" && body.password.length >= 6) {
    patch.password_hash = await hashPassword(body.password);
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("users").update(patch).eq("id", params.id).select("*").single();
  if (error || !data) return NextResponse.json({ error: error?.message ?? "update failed" }, { status: 500 });
  return NextResponse.json({ user: rowToMember(data) });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;

  if (gate.me.id === params.id) {
    return NextResponse.json({ error: "自分自身は削除できません。" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("users").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
