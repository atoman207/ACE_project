import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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
    .from("applications")
    .select(
      "id, applied_at, status, intent, reason, current_situation, wants_counseling, free_text, " +
        "users:user_id ( id, name, email, phone, age, years, current_company, qualification ), " +
        "jobs:job_id ( id, company, position )",
    )
    .order("applied_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications: data ?? [] });
}
