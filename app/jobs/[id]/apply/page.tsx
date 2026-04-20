import { notFound } from "next/navigation";
import { getJobById } from "@/lib/jobs-data";
import ApplyClient from "./ApplyClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "求人に応募する" };

export default async function ApplyPage({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id);
  if (!job) notFound();
  return <ApplyClient job={job} />;
}
