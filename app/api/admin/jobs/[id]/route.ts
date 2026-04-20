import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Job } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const me = await getCurrentMember();
  if (!me) return { error: NextResponse.json({ error: "unauthenticated" }, { status: 401 }) };
  if (!me.isAdmin) return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  return { me };
}

function payloadToDbRow(body: Partial<Job> & { tags?: string[]; requirements?: string[] }): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  const map: Record<string, string> = {
    company: "company",
    companyKind: "company_kind",
    position: "position",
    summary: "summary",
    location: "location",
    salary: "salary",
    salaryMin: "salary_min",
    salaryMax: "salary_max",
    employmentType: "employment_type",
    remote: "remote",
    status: "status",
    description: "description",
    companyOverview: "company_overview",
    workHours: "work_hours",
    holidays: "holidays",
    idealCandidate: "ideal_candidate",
    isConfidential: "is_confidential",
    published: "published",
    sortOrder: "sort_order",
  };
  for (const [k, col] of Object.entries(map)) {
    const v = (body as Record<string, unknown>)[k];
    if (v !== undefined) row[col] = v;
  }
  if (Array.isArray(body.tags)) row.tags = body.tags;
  if (Array.isArray(body.requirements)) row.requirements = body.requirements;
  if (Array.isArray(body.preferred)) row.preferred = body.preferred;
  if (Array.isArray(body.benefits)) row.benefits = body.benefits;
  if (Array.isArray(body.selectionProcess)) row.selection_process = body.selectionProcess;
  return row;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const row = payloadToDbRow(body as Partial<Job>);
  if (Object.keys(row).length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("jobs").update(row).eq("id", params.id).select("*").single();
  if (error || !data) return NextResponse.json({ error: error?.message ?? "update failed" }, { status: 500 });
  return NextResponse.json({ job: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("jobs").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
