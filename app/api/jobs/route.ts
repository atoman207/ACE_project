import { NextResponse } from "next/server";
import { getAllJobs } from "@/lib/jobs-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await getAllJobs();
  return NextResponse.json(jobs);
}
