import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const me = await getCurrentMember();
  if (!me) return NextResponse.json({ jobIds: [] });

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", me.id)
    .order("saved_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ jobIds: (data ?? []).map((r) => r.job_id as string) });
}

export async function POST(req: Request) {
  const me = await getCurrentMember();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { jobId?: string; action?: "toggle" | "add" | "remove" } | null;
  const jobId = body?.jobId?.trim();
  if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

  const supabase = createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", me.id)
    .eq("job_id", jobId)
    .maybeSingle();

  const action = body?.action ?? "toggle";
  const shouldRemove =
    action === "remove" || (action === "toggle" && existing);

  if (shouldRemove) {
    const { error } = await supabase.from("saved_jobs").delete().eq("user_id", me.id).eq("job_id", jobId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ saved: false });
  }

  if (!existing) {
    const { error } = await supabase.from("saved_jobs").insert({ user_id: me.id, job_id: jobId });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ saved: true });
}
