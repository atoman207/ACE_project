import { notFound, redirect } from "next/navigation";
import { getAllJobs, getJobById } from "@/lib/jobs-data";
import { getCurrentMember } from "@/lib/auth";
import JobDetailClient from "./JobDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id);
  if (!job) return {};
  return {
    title: `${job.position}｜${job.company}`,
    description: job.summary,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const me = await getCurrentMember();
  if (!me) redirect(`/login?next=/jobs/${params.id}`);

  const [job, jobs] = await Promise.all([getJobById(params.id), getAllJobs()]);
  if (!job) notFound();
  if (!job.published && !me.isAdmin) notFound();
  const similar = jobs.filter(
    (j) => j.id !== job.id && j.companyKind === job.companyKind && j.status === "募集中",
  ).slice(0, 3);
  return <JobDetailClient job={job} similar={similar} />;
}
