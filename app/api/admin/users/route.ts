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

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: (data ?? []).map(rowToMember) });
}

export async function POST(req: Request) {
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
      }
    | null;

  const email = (body?.email ?? "").trim().toLowerCase();
  const password = body?.password ?? "";
  const name = (body?.name ?? "").trim();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "name, email, password are required." }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const password_hash = await hashPassword(password);
  const qual: ActuaryQualification = QUALIFICATIONS.includes(body?.qualification as ActuaryQualification)
    ? (body!.qualification as ActuaryQualification)
    : "未取得";

  const { data, error } = await supabase
    .from("users")
    .insert({
      email,
      password_hash,
      name,
      phone: body?.phone ?? "",
      age: body?.age ?? 0,
      years: body?.years ?? 0,
      current_company: body?.currentCompany ?? "",
      qualification: qual,
      other_qualifications: body?.otherQualifications ?? "",
      is_admin: Boolean(body?.isAdmin),
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "insert failed" }, { status: 500 });
  }
  return NextResponse.json({ user: rowToMember(data) });
}
