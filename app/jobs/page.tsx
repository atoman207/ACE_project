import { Suspense } from "react";
import { redirect } from "next/navigation";
import JobsClient from "./JobsClient";
import { getAllJobs, getJobKinds } from "@/lib/jobs-data";
import { getCurrentMember } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "アクチュアリー求人一覧",
  description:
    "生命保険・損害保険・再保険・コンサル・年金を中心としたアクチュアリー特化求人を条件から探す。",
};

export default async function JobsPage() {
  const me = await getCurrentMember();
  if (!me) redirect("/login?next=/jobs");

  const [jobs, jobKinds] = await Promise.all([getAllJobs(), getJobKinds()]);
  return (
    <Suspense fallback={<div className="container-x py-16">読み込み中...</div>}>
      <JobsClient jobs={jobs} jobKinds={jobKinds} />
    </Suspense>
  );
}
