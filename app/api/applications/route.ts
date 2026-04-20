import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { adminEmail, escapeHtml, sendMail } from "@/lib/mail";
import type { Application } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApplicationRow = {
  id: string;
  user_id: string;
  job_id: string;
  applied_at: string;
  status: Application["status"];
  intent: string;
  reason: string;
  current_situation: string;
  wants_counseling: boolean;
  free_text: string;
};

function toApplication(r: ApplicationRow): Application {
  return {
    id: r.id,
    jobId: r.job_id,
    appliedAt: r.applied_at,
    status: r.status,
    intent: r.intent ?? "",
    reason: r.reason ?? "",
    currentSituation: r.current_situation ?? "",
    wantsCounseling: Boolean(r.wants_counseling),
    freeText: r.free_text ?? "",
  };
}

export async function GET() {
  const me = await getCurrentMember();
  if (!me) return NextResponse.json({ applications: [] });

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", me.id)
    .order("applied_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applications: (data ?? []).map((r) => toApplication(r as ApplicationRow)) });
}

export async function POST(req: Request) {
  const me = await getCurrentMember();
  if (!me) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | {
        jobId?: string;
        intent?: string;
        reason?: string;
        currentSituation?: string;
        wantsCounseling?: boolean;
        freeText?: string;
      }
    | null;

  const jobId = body?.jobId?.trim();
  if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

  const supabase = createSupabaseServerClient();

  const { data: job, error: jobErr } = await supabase
    .from("jobs")
    .select("id, company, position")
    .eq("id", jobId)
    .maybeSingle();
  if (jobErr || !job) return NextResponse.json({ error: "job not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: me.id,
      job_id: jobId,
      intent: body?.intent ?? "",
      reason: body?.reason ?? "",
      current_situation: body?.currentSituation ?? "",
      wants_counseling: Boolean(body?.wantsCounseling),
      free_text: body?.freeText ?? "",
    })
    .select("*")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return NextResponse.json({ error: "この求人にはすでに応募済みです。" }, { status: 409 });
    }
    return NextResponse.json({ error: error?.message ?? "insert failed" }, { status: 500 });
  }

  const admin = adminEmail();
  if (admin) {
    await sendMail({
      to: admin,
      subject: `[ACEキャリア] 新しい応募: ${job.position} (${job.company})`,
      html: `
        <h2>新しい応募がありました</h2>
        <p><strong>応募者:</strong> ${escapeHtml(me.name)} (${escapeHtml(me.email)})</p>
        <p><strong>求人:</strong> ${escapeHtml(job.position)} / ${escapeHtml(job.company)}</p>
        <p><strong>転職意向:</strong> ${escapeHtml(body?.intent ?? "")}</p>
        <p><strong>応募理由:</strong><br>${escapeHtml(body?.reason ?? "").replace(/\n/g, "<br>")}</p>
        <p><strong>現在の状況:</strong><br>${escapeHtml(body?.currentSituation ?? "").replace(/\n/g, "<br>")}</p>
        <p><strong>面談希望:</strong> ${body?.wantsCounseling ? "あり" : "なし"}</p>
        <p><strong>自由記述:</strong><br>${escapeHtml(body?.freeText ?? "").replace(/\n/g, "<br>")}</p>
      `,
    });
  }

  return NextResponse.json({ application: toApplication(data as ApplicationRow) });
}
