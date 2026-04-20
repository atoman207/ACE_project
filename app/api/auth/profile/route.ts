import { NextResponse } from "next/server";
import { getCurrentMember, rowToMember } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { ActuaryQualification } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QUALIFICATIONS: ActuaryQualification[] = ["未取得", "研究会員", "準会員", "正会員"];

function toInt(v: FormDataEntryValue | null): number {
  if (typeof v !== "string" || !v) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}
function toStr(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function PATCH(req: Request) {
  const me = await getCurrentMember();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const form = await req.formData();
  const patch: Record<string, unknown> = {};

  const name = toStr(form.get("name"));
  if (name) patch.name = name;
  const phone = form.get("phone");
  if (phone !== null) patch.phone = toStr(phone);
  const age = form.get("age");
  if (age !== null) patch.age = toInt(age);
  const years = form.get("years");
  if (years !== null) patch.years = toInt(years);
  const currentCompany = form.get("currentCompany");
  if (currentCompany !== null) patch.current_company = toStr(currentCompany);
  const qualRaw = toStr(form.get("qualification")) as ActuaryQualification;
  if (QUALIFICATIONS.includes(qualRaw)) patch.qualification = qualRaw;
  const otherQ = form.get("otherQualifications");
  if (otherQ !== null) patch.other_qualifications = toStr(otherQ);

  const supabase = createSupabaseServerClient();

  const avatar = form.get("avatar");
  if (avatar instanceof File && avatar.size > 0) {
    const ext = (avatar.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${me.id}/${Date.now()}.${ext || "png"}`;
    const bytes = Buffer.from(await avatar.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, bytes, { contentType: avatar.type || "image/png", upsert: true });
    if (!upErr) {
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      patch.avatar_url = pub.publicUrl;
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ member: me });
  }

  const { data, error } = await supabase.from("users").update(patch).eq("id", me.id).select("*").single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "update failed" }, { status: 500 });
  }
  return NextResponse.json({ member: rowToMember(data) });
}
