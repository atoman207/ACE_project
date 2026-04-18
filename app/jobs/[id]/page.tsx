import { notFound } from "next/navigation";
import { getJob, JOBS } from "@/lib/mockJobs";
import JobDetailClient from "./JobDetailClient";

export function generateStaticParams() {
  return JOBS.map((j) => ({ id: j.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const job = getJob(params.id);
  if (!job) return {};
  return {
    title: `${job.position}｜${job.company}`,
    description: job.summary,
  };
}

export default function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = getJob(params.id);
  if (!job) notFound();
  const similar = JOBS.filter(
    (j) => j.id !== job.id && j.companyKind === job.companyKind && j.status === "募集中"
  ).slice(0, 3);
  return <JobDetailClient job={job} similar={similar} />;
}
