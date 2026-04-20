import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  encodeSession,
  findUserByEmail,
  hashPassword,
  rowToMember,
  sessionCookieOptions,
} from "@/lib/auth";
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

export async function POST(req: Request) {
  const form = await req.formData();

  const email = toStr(form.get("email")).toLowerCase();
  const name = toStr(form.get("name"));
  const password = toStr(form.get("password"));
  const phone = toStr(form.get("phone"));
  const age = toInt(form.get("age"));
  const years = toInt(form.get("years"));
  const currentCompany = toStr(form.get("currentCompany"));
  const qualRaw = toStr(form.get("qualification")) as ActuaryQualification;
  const qualification: ActuaryQualification = QUALIFICATIONS.includes(qualRaw) ? qualRaw : "未取得";
  const otherQualifications = toStr(form.get("otherQualifications"));
  const avatar = form.get("avatar");

  if (!email || !name || !password) {
    return NextResponse.json({ error: "name, email, password are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "このメールアドレスは既に登録されています。" }, { status: 409 });
  }

  const supabase = createSupabaseServerClient();
  const password_hash = await hashPassword(password);

  const { data: inserted, error: insertErr } = await supabase
    .from("users")
    .insert({
      email,
      password_hash,
      name,
      phone,
      age,
      years,
      current_company: currentCompany,
      qualification,
      other_qualifications: otherQualifications,
      is_admin: false,
    })
    .select("*")
    .single();

  if (insertErr || !inserted) {
    return NextResponse.json(
      { error: `登録に失敗しました: ${insertErr?.message ?? "unknown"}` },
      { status: 500 },
    );
  }

  let avatarUrl: string | null = null;
  if (avatar instanceof File && avatar.size > 0) {
    const ext = (avatar.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${inserted.id}/${Date.now()}.${ext || "png"}`;
    const bytes = Buffer.from(await avatar.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, bytes, { contentType: avatar.type || "image/png", upsert: true });
    if (!upErr) {
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = pub.publicUrl;
      await supabase.from("users").update({ avatar_url: avatarUrl }).eq("id", inserted.id);
    }
  }

  const member = rowToMember({ ...inserted, avatar_url: avatarUrl ?? inserted.avatar_url });
  const token = encodeSession(inserted.id);
  cookies().set(SESSION_COOKIE, token, sessionCookieOptions());

  return NextResponse.json({ member });
}
