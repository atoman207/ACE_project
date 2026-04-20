import { NextResponse } from "next/server";
import { JOBS } from "@/lib/mockJobs";
import { createSupabaseServerClient, canUseSupabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type JobRowInsert = {
  id: string;
  company: string;
  company_kind: string;
  position: string;
  summary: string;
  location: string;
  salary: string;
  salary_min: number;
  salary_max: number;
  employment_type: string;
  remote: string;
  tags: string[];
  status: string;
  posted_at: string;
  description: string;
  requirements: string[];
  preferred: string[];
  company_overview: string;
  work_hours: string;
  benefits: string[];
  holidays: string;
  selection_process: string[];
  ideal_candidate: string;
  is_confidential: boolean;
};

export async function POST(request: Request) {
  if (!canUseSupabaseServer()) {
    return NextResponse.json(
      { ok: false, error: "Supabase environment variables are not configured." },
      { status: 500 },
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is required to seed rows because RLS blocks anon inserts.",
      },
      { status: 500 },
    );
  }

  const expectedSecret = process.env.SEED_SECRET;
  if (expectedSecret) {
    const header = request.headers.get("x-seed-secret");
    if (header !== expectedSecret) {
      return NextResponse.json({ ok: false, error: "Invalid seed secret." }, { status: 401 });
    }
  }

  const supabase = createSupabaseServerClient();
  const tableName = process.env.SUPABASE_JOBS_TABLE?.trim() || "jobs";

  const rows: JobRowInsert[] = JOBS.map((job) => ({
    id: job.id,
    company: job.company,
    company_kind: job.companyKind,
    position: job.position,
    summary: job.summary,
    location: job.location,
    salary: job.salary,
    salary_min: job.salaryMin,
    salary_max: job.salaryMax,
    employment_type: job.employmentType,
    remote: job.remote,
    tags: job.tags,
    status: job.status,
    posted_at: job.postedAt,
    description: job.description,
    requirements: job.requirements,
    preferred: job.preferred,
    company_overview: job.companyOverview,
    work_hours: job.workHours,
    benefits: job.benefits,
    holidays: job.holidays,
    selection_process: job.selectionProcess,
    ideal_candidate: job.idealCandidate,
    is_confidential: Boolean(job.isConfidential),
  }));

  const { error } = await supabase.from(tableName).upsert(rows, { onConflict: "id" });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        hint:
          "Make sure you ran supabase/schema.sql first so the jobs table exists, and that SUPABASE_SERVICE_ROLE_KEY is valid.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, inserted: rows.length, table: tableName });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST /api/admin/seed-jobs to seed the jobs table." },
    { status: 405 },
  );
}
