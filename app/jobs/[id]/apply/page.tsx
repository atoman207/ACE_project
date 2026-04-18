import { notFound } from "next/navigation";
import { getJob, JOBS } from "@/lib/mockJobs";
import ApplyClient from "./ApplyClient";

export function generateStaticParams() {
  return JOBS.map((j) => ({ id: j.id }));
}

export const metadata = { title: "求人に応募する" };

export default function ApplyPage({ params }: { params: { id: string } }) {
  const job = getJob(params.id);
  if (!job) notFound();
  return <ApplyClient job={job} />;
}
