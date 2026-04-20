import { cache } from "react";
import { createSupabaseServerClient, canUseSupabaseServer } from "@/lib/supabase-server";
import type { Job } from "@/lib/types";

/** Raw row from `public.jobs` — camelCase or snake_case columns both accepted */
type JobRow = Partial<Record<keyof Job | string, unknown>>;
type QueryResult = {
  table: string;
  data: JobRow[] | null;
  error: { message: string; code?: string; cause?: unknown } | null;
};

const COMPANY_KINDS: Job["companyKind"][] = [
  "生命保険",
  "損害保険",
  "再保険",
  "コンサル",
  "信託銀行",
  "年金",
  "その他",
];

const STATUSES: Job["status"][] = ["募集中", "募集終了"];

const REMOTES: Job["remote"][] = ["フルリモート可", "一部リモート可", "出社"];

const EMPLOYMENT: Job["employmentType"][] = ["正社員", "契約社員", "業務委託"];
const TABLE_NOT_FOUND_CODE = "PGRST205";
const JOB_TABLE_CANDIDATES = [
  "jobs",
  "job",
  "job_posts",
  "job_postings",
  "positions",
];

function asString(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function asNumber(v: unknown, fallback = 0) {
  return typeof v === "number" ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.filter((x): x is string => typeof x === "string");
  }
  if (typeof v === "string") {
    const trimmed = v.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((x): x is string => typeof x === "string");
      }
    } catch {
      return trimmed
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function rowToJob(row: JobRow): Job {
  return {
    id: asString(row.id),
    company: asString(row.company),
    companyKind: asString(row.companyKind ?? row.company_kind, "その他") as Job["companyKind"],
    position: asString(row.position),
    summary: asString(row.summary),
    location: asString(row.location),
    salary: asString(row.salary),
    salaryMin: asNumber(row.salaryMin ?? row.salary_min),
    salaryMax: asNumber(row.salaryMax ?? row.salary_max),
    employmentType: asString(row.employmentType ?? row.employment_type, "正社員") as Job["employmentType"],
    remote: asString(row.remote, "出社") as Job["remote"],
    tags: asStringArray(row.tags),
    status: asString(row.status, "募集中") as Job["status"],
    postedAt: asString(row.postedAt ?? row.posted_at),
    description: asString(row.description),
    requirements: asStringArray(row.requirements),
    preferred: asStringArray(row.preferred),
    companyOverview: asString(row.companyOverview ?? row.company_overview),
    workHours: asString(row.workHours ?? row.work_hours),
    benefits: asStringArray(row.benefits),
    holidays: asString(row.holidays),
    selectionProcess: asStringArray(row.selectionProcess ?? row.selection_process),
    idealCandidate: asString(row.idealCandidate ?? row.ideal_candidate),
    isConfidential: Boolean(row.isConfidential ?? row.is_confidential),
    published: row.published === undefined ? true : Boolean(row.published),
    sortOrder: asNumber(row.sortOrder ?? row.sort_order, 0),
  };
}

function assertNonEmpty(value: string, field: string, rowIndex: number) {
  if (!value.trim()) {
    throw new Error(
      `[jobs] Row ${rowIndex + 1}: missing or empty "${field}". Map DB column to camelCase or snake_case (e.g. company_kind).`,
    );
  }
}

function validateMappedJob(job: Job, rowIndex: number): void {
  assertNonEmpty(job.id, "id", rowIndex);
  assertNonEmpty(job.company, "company", rowIndex);
  assertNonEmpty(job.position, "position", rowIndex);
  assertNonEmpty(job.summary, "summary", rowIndex);
  assertNonEmpty(job.location, "location", rowIndex);
  assertNonEmpty(job.salary, "salary", rowIndex);
  assertNonEmpty(job.postedAt, "postedAt / posted_at", rowIndex);
  assertNonEmpty(job.description, "description", rowIndex);
  assertNonEmpty(job.companyOverview, "companyOverview / company_overview", rowIndex);
  assertNonEmpty(job.workHours, "workHours / work_hours", rowIndex);
  assertNonEmpty(job.holidays, "holidays", rowIndex);
  assertNonEmpty(job.idealCandidate, "idealCandidate / ideal_candidate", rowIndex);

  if (!COMPANY_KINDS.includes(job.companyKind)) {
    throw new Error(
      `[jobs] Row ${rowIndex + 1}: companyKind "${job.companyKind}" is invalid. Use one of: ${COMPANY_KINDS.join(", ")}.`,
    );
  }
  if (!STATUSES.includes(job.status)) {
    throw new Error(
      `[jobs] Row ${rowIndex + 1}: status "${job.status}" is invalid. Use: ${STATUSES.join(" or ")}.`,
    );
  }
  if (!REMOTES.includes(job.remote)) {
    throw new Error(
      `[jobs] Row ${rowIndex + 1}: remote "${job.remote}" is invalid. Use one of: ${REMOTES.join(", ")}.`,
    );
  }
  if (!EMPLOYMENT.includes(job.employmentType)) {
    throw new Error(
      `[jobs] Row ${rowIndex + 1}: employmentType "${job.employmentType}" is invalid. Use one of: ${EMPLOYMENT.join(", ")}.`,
    );
  }

  if (job.requirements.length === 0) {
    throw new Error(`[jobs] Row ${rowIndex + 1}: requirements must be a non-empty text[] or JSON string array.`);
  }
  if (job.benefits.length === 0) {
    throw new Error(`[jobs] Row ${rowIndex + 1}: benefits must be a non-empty text[] or JSON string array.`);
  }
  if (job.selectionProcess.length === 0) {
    throw new Error(
      `[jobs] Row ${rowIndex + 1}: selectionProcess / selection_process must be a non-empty text[] or JSON string array.`,
    );
  }

  if (job.salaryMin <= 0 || job.salaryMax <= 0) {
    throw new Error(
      `[jobs] Row ${rowIndex + 1}: salary_min and salary_max must be positive numbers (万円単位の想定).`,
    );
  }
}

const fetchJobsFromSupabase = cache(async (): Promise<Job[]> => {
  if (!canUseSupabaseServer()) {
    throw new Error(
      "[jobs] Supabase is not configured. Copy .env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  const supabase = createSupabaseServerClient();
  const preferredTable = process.env.SUPABASE_JOBS_TABLE?.trim();
  const tableCandidates = preferredTable
    ? [preferredTable, ...JOB_TABLE_CANDIDATES.filter((t) => t !== preferredTable)]
    : JOB_TABLE_CANDIDATES;

  let selected: QueryResult | null = null;
  let lastError: QueryResult["error"] = null;

  for (const tableName of tableCandidates) {
    const { data, error } = await supabase.from(tableName).select("*");
    const result: QueryResult = {
      table: tableName,
      data: data as JobRow[] | null,
      error: error
        ? {
            message: error.message,
            code: "code" in error && typeof error.code === "string" ? error.code : undefined,
            cause: "cause" in error ? error.cause : undefined,
          }
        : null,
    };

    if (!result.error) {
      selected = result;
      break;
    }

    lastError = result.error;
    if (result.error.code !== TABLE_NOT_FOUND_CODE) {
      selected = result;
      break;
    }
  }

  if (!selected) {
    throw new Error(
      `[jobs] Supabase query failed: could not find a table for jobs data. Tried: ${tableCandidates.join(", ")}. ` +
        `Set SUPABASE_JOBS_TABLE in .env.local if your table name is different.`,
    );
  }

  if (selected.error) {
    const detail = selected.error.cause instanceof Error ? ` (${selected.error.cause.message})` : "";
    throw new Error(
      `[jobs] Supabase query failed on table "${selected.table}": ${selected.error.message}${detail}. ` +
        `Check NEXT_PUBLIC_SUPABASE_URL, keys, RLS (service role bypasses RLS), and table permissions.`,
    );
  }

  if (!selected.data || selected.data.length === 0) {
    throw new Error(
      `[jobs] Table "${selected.table}" returned no rows. Insert at least one job row.`,
    );
  }

  const jobs: Job[] = [];
  for (let i = 0; i < selected.data.length; i++) {
    const job = rowToJob(selected.data[i] as JobRow);
    validateMappedJob(job, i);
    jobs.push(job);
  }

  return jobs.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.postedAt < b.postedAt ? 1 : -1;
  });
});

export async function getAllJobs(): Promise<Job[]> {
  const all = await fetchJobsFromSupabase();
  return all.filter((j) => j.published);
}

/** Admin-only — returns published + unpublished. */
export async function getAllJobsForAdmin(): Promise<Job[]> {
  return fetchJobsFromSupabase();
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const jobs = await fetchJobsFromSupabase();
  return jobs.find((j) => j.id === id);
}

export async function getJobKinds(): Promise<string[]> {
  const jobs = await getAllJobs();
  return Array.from(new Set(jobs.map((j) => j.companyKind)));
}

export async function getPopularTags(limit = 8): Promise<string[]> {
  const jobs = await getAllJobs();
  const count = new Map<string, number>();

  for (const job of jobs) {
    for (const tag of job.tags) {
      count.set(tag, (count.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(count.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, limit);
}
